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
      state.plots[plot.plotId] = plot.plotData
    },
    addFile (state, file) {
      state.files[file.fileId] = file.fileData
      state.fileList.push(file.fileId)
    },
    clearError (state) {
      state.error = null
    },
    deleteFile (state, plotToDelete) {
      // remove from plot list
      // remove from plots (plot data)
      state.fileList = state.fileList.filter(
        plot => plot.id !== plotToDelete.id
      )
      delete state.plots[plotToDelete.id]
      state.fileToModify = null
    },
    setError (state, error) {
      state.error = error
    },
    setFileToModify (state, file) {
      state.fileToModify = file
    },
    setPlotColor (state, plotInfo) {
      const fileIndexToUpdate = state.fileList.findIndex(
        file => file.id === plotInfo.id
      )

      state.fileList[fileIndexToUpdate].sPlots[plotInfo.index].color =
        plotInfo.value
    },
    setPlotType (state, plotType) {
      state.plotType = plotType
    },
    setAllPlotsVisibility (state, fileVisibility) {
      const fileIndexToUpdate = state.fileList.findIndex(
        file => file.id === fileVisibility.id
      )

      state.fileList[fileIndexToUpdate].sPlots.forEach(plot => {
        plot.visible = fileVisibility.value
      })
    },
    setPlotVisibility (state, plotInfo) {
      const fileIndexToUpdate = state.fileList.findIndex(
        file => file.id === plotInfo.id
      )

      state.fileList[fileIndexToUpdate].sPlots[plotInfo.index].visible =
        plotInfo.value
    },
    startLoading (state) {
      state.loadingFiles = true
    },
    stopLoading (state) {
      state.loadingFiles = false
    },
    toggleNavDrawer (state, val) {
      if (val === null) {
        state.navDrawer = !state.navDrawer
      } else {
        state.navDrawer = val
      }
    },
    updatePlotName (state, plotData) {
      const plotIndex = state.fileList.findIndex(
        plot => plot.id === plotData.id
      )
      state.fileList[plotIndex].name = plotData.name
      state.fileToModify = null
    }
  },
  actions: {
    loadFiles ({ commit }, payload) {
      commit('startLoading')

      let readCount = 0
      const fileList = payload.files

      for (let i = 0; i < fileList.length; i++) {
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
                    freq: network.data.freq,
                    sParams: network.data.s[i][j],
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
    }
  },
  getters: {
    enabledPlotList (state) {
      const enabledPlots = []

      state.fileList.forEach(fileId => {
        state.files[fileId].plotList.forEach(plotId => {
          if (state.plots[plotId].visible) {
            enabledPlots.push(plotId)
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
