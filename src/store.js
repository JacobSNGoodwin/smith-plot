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
    plots: {},
    loadingFiles: false,
    navDrawer: true,
    plotType: 'smith',
    fileToModify: null,
    error: null
  },
  mutations: {
    addPlot (state, plot) {
      state.plots[plot.id] = {
        ...plot.data
      }
    },
    addToFileList (state, plotInfo) {
      state.fileList.push(plotInfo)
    },
    clearError (state) {
      this.state.error = null
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
    loadFiles ({ commit }, fileList) {
      commit('startLoading')

      let readCount = 0

      for (let i = 0; i < fileList.length; i++) {
        // use file inside of closure to assure we read every file one by one
        ;(function (file) {
          const name = file.name
          const id = uuidv1()
          const reader = new FileReader()

          reader.onload = function (e) {
            try {
              const network = new Network(e.target.result, file.name)
              const plotData = {
                data: network.data,
                unit: network.freqUnit,
                z0: network.z0,
                n: network.nPorts
              }

              // fileList will also contains a list of S-parameters for the file
              // and a visibility for each
              const sPlots = []
              for (let i = 0; i < plotData.n; i++) {
                for (let j = 0; j < plotData.n; j++) {
                  const label = `s${i + 1},${j + 1}`
                  sPlots.push({
                    label,
                    indeces: [i, j],
                    visible: false,
                    disabledSmith: i !== j, // state to enable/plot on Smith Chart,
                    color: colorGen.next().value
                  })
                }
              }

              // commit plots first so that they're available for getters
              // that iterate of the fileList
              commit('addPlot', { id, data: plotData })
              commit('addToFileList', { id, name, sPlots })

              readCount++

              if (readCount === fileList.length) {
                // final file has read
                commit('stopLoading')
              }
            } catch (error) {
              commit('setError', {
                userMessage: `Error reading file "${file.name}"`,
                error: error.message
              })
              commit('stopLoading')
            }
          }

          reader.readAsText(file, 'UTF-8')
        })(fileList[i])
      }
    }
  },
  getters: {
    enabledPlots (state, getters) {
      const files = getters.filesByName

      const allPlots = []

      files.forEach(file => {
        file.sPlots.forEach(plot => {
          const plotData = {
            ...plot,
            fileId: file.id,
            fileName: file.name,
            freq: state.plots[file.id].data.freq,
            s: state.plots[file.id].data.s[plot.indeces[0]][plot.indeces[1]],
            n: state.plots[file.id].n,
            unit: state.plots[file.id].unit,
            z0: state.plots[file.id].z0
          }
          if (plot.visible) {
            allPlots.push(plotData)
          }
        })
      })

      return allPlots
    },
    filesByName: state => {
      return state.fileList.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1
        }

        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1
        }

        return 0
      })
    }
  }
})
