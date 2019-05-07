import Vue from 'vue'
import Vuex from 'vuex'
import uuidv1 from 'uuid/v1'
import Network from 'rf-network'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    plotList: [],
    plots: {},
    loadingFiles: false
  },
  mutations: {
    addPlot (state, plot) {
      state.plots[plot.id] = {
        ...plot.data,
        name: plot.name,
        visible: plot.visible
      }
    },
    addToPlotList (state, plotId) {
      state.plotList.push(plotId)
    },
    startLoading (state) {
      state.loadingFiles = true
    },
    stopLoading (state) {
      state.loadingFiles = false
    },
    togglePlotVisibility (state, toggleData) {
      state.plots[toggleData.id].visible = toggleData.event
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
            const network = new Network(e.target.result, file.name)
            const plotData = {
              s: network.data,
              unit: network.freqUnit,
              z0: network.z0,
              n: network.nPorts
            }

            // commit plots first so that they're available for getters
            // that iterate of the plotList
            commit('addPlot', { id, name, data: plotData, visible: true })
            commit('addToPlotList', id)

            readCount++

            if (readCount === fileList.length) {
              // final file has read
              commit('stopLoading')
            }
          }

          reader.readAsText(file, 'UTF-8')
        })(fileList[i])
      }
    }
  },
  getters: {
    plotsByName: state => {
      // sort plot list of ids by name
      const plotList = state.plotList.sort((a, b) => {
        if (
          state.plots[a].name.toLowerCase() < state.plots[b].name.toLowerCase()
        ) {
          return -1
        }

        if (
          state.plots[a].name.toLowerCase() > state.plots[b].name.toLowerCase()
        ) {
          return 1
        }

        return 0
      })
      return plotList.map(id => {
        return {
          id,
          ...state.plots[id]
        }
      })
    }
  }
})
