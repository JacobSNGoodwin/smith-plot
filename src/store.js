import Vue from 'vue'
import Vuex from 'vuex'
import uuidv1 from 'uuid/v1'
import Network from 'rf-network'
// import math from 'mathjs'

import colorGenerator from './util/colorGenerator'

Vue.use(Vuex)

// globally declared so as to exhaust color list before repeating
const colorGen = colorGenerator()

export default new Vuex.Store({
  state: {
    fileList: [],
    files: {},
    plots: {},
    loadingFiles: false,
    navDrawer: true,
    plotType: 'smith',
    fileToModify: null,
    error: null
  },
  mutations: {
    addPlot (state, plot) {
      // use Vue.set to make sure object properties are reactive
      // could also use spread operator, but seems slower (need testing)
      Vue.set(state.plots, plot.plotId, plot.plotData)
    },
    addFile (state, file) {
      // use Vue.set to make sure object properties are reactive
      Vue.set(state.files, file.fileId, file.fileData)
      state.fileList.push(file.fileId)
    },
    clearError (state) {
      state.error = null
    },
    deleteFile (state, fileId) {
      // first delete all plots key/values related to this file
      state.files[fileId].plotList.forEach(plotId => {
        delete state.plots[plotId]
      })
      // delete fileId from fileList and key/value from files
      state.fileList = state.fileList.filter(
        storeFileId => fileId !== storeFileId
      )
      delete state.files[fileId]
      state.fileToModify = null
    },
    setError (state, error) {
      state.error = error
    },
    setFileToModify (state, fileId) {
      state.fileToModify = fileId
    },
    setPlotColor (state, plotInfo) {
      state.plots[plotInfo.plotId].color = plotInfo.value
    },
    setPlotType (state, plotType) {
      state.plotType = plotType
    },
    setAllPlotsVisibility (state, file) {
      state.files[file.fileId].plotList.map(plotId => {
        state.plots[plotId].visible = file.value
      })
    },
    setPlotVisibility (state, plotInfo) {
      state.plots[plotInfo.plotId].visible = plotInfo.value
    },
    startLoading (state) {
      state.loadingFiles = true
    },
    startLoadingPlots (state) {
      state.loadingAllPlots = true
    },
    stopLoading (state) {
      state.loadingFiles = false
    },
    stopLoadingPlots (state) {
      state.loadingAllPlots = false
    },
    toggleNavDrawer (state, val) {
      if (val === null) {
        state.navDrawer = !state.navDrawer
      } else {
        state.navDrawer = val
      }
    },
    updateFileName (state, fileData) {
      state.files[fileData.fileId].fileName = fileData.name
      state.files[fileData.fileId].plotList.forEach(plotId => {
        state.plots[plotId].fileName = fileData.name
      })
      state.fileToModify = null
    }
  },
  actions: {
    loadFiles ({ commit }, payload) {
      commit('startLoading')

      let readCount = 0
      const fileList = payload.files

      const fileSizeLimit = 2000 * 1024 // temporarily set to 50kB
      const largeFileList = []

      for (let i = 0; i < fileList.length; i++) {
        // check file length - only read in if it meets length requirement
        if (fileList[i].size > fileSizeLimit) {
          largeFileList.push(fileList[i].name)
          continue
        }

        // use file inside of closure to assure we read every file one by one
        ;(function (file) {
          const fileId = uuidv1()
          const reader = new FileReader()

          reader.onload = function (e) {
            try {
              const network = new Network(e.target.result, file.name)

              // data to be added to file object
              const fileData = {
                fileName: network.fileName,
                unit: network.freqUnit,
                z0: network.z0,
                n: network.nPorts,
                plotList: []
              }

              // create plotList inside of fileData, add plot to plots map (object)
              for (let i = 0; i < fileData.n; i++) {
                for (let j = 0; j < fileData.n; j++) {
                  const plotId = uuidv1()
                  const label = `s${i + 1},${j + 1}`
                  fileData.plotList.push(plotId)

                  const plotData = {
                    label,
                    fileName: network.fileName,
                    freq: network.data.freq,
                    ...network.data.s[i][j],
                    indeces: [i, j],
                    visible: false,
                    unit: network.freqUnit, // duplicates of file may make access easier
                    z0: network.z0,
                    n: network.nPorts,
                    disabledSmith: i !== j, // state to enable/plot on Smith Chart,
                    color: colorGen.next().value
                  }

                  // add plot to state.plots
                  commit('addPlot', { plotId, plotData })
                }
              }

              // now that all plots have been added to state.plots, add file to state
              commit('addFile', { fileId, fileData })

              readCount++

              if (readCount === fileList.length) {
                // final file has read
                // clear file ref so same file could be reloaded (though that's not desirable here)
                payload.fileRef.value = null
                commit('stopLoading')
              }
            } catch (error) {
              commit('setError', {
                userMessage: `Error reading file "${file.name}"`,
                error: error.message
              })
              // clear file ref so same file could be reloaded (though that's not desirable here)
              payload.fileRef.value = null
              commit('stopLoading')
            }
          }

          reader.readAsText(file, 'UTF-8')
        })(fileList[i])
      }
      // show files that exceed file size limit
      if (largeFileList.length > 0) {
        const fileListString = largeFileList.join(', ')
        const message =
          'The following files exceed the size limit of ' +
          fileSizeLimit +
          ' bytes: ' +
          fileListString +
          '.'
        commit('setError', {
          userMessage: message,
          error: new Error('Some files exceed size limit')
        })
      }
      commit('stopLoading')
    }
  },
  getters: {
    enabledPlots: state => {
      const enabledPlots = []
      state.fileList.forEach(fileId => {
        state.files[fileId].plotList.forEach(plotId => {
          if (state.plots[plotId].visible) {
            enabledPlots.push({ plotId, ...state.plots[plotId] })
          }
        })
      })

      return enabledPlots
    },
    fileListByName: state => {
      return state.fileList.sort((a, b) => {
        if (
          state.files[a].fileName.toLowerCase() <
          state.files[b].fileName.toLowerCase()
        ) {
          return -1
        }

        if (
          state.files[a].fileName.toLowerCase() >
          state.files[b].fileName.toLowerCase()
        ) {
          return 1
        }

        return 0
      })
    }
  }
})
