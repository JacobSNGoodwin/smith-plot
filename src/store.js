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
        ...plot.data
      }
    },
    addToPlotList (state, plotInfo) {
      state.plotList.push(plotInfo)
    },
    startLoading (state) {
      state.loadingFiles = true
    },
    stopLoading (state) {
      state.loadingFiles = false
    },
    togglePlotVisibility (state, toggleData) {
      const element = state.plotList.findIndex(
        plot => plot.id === toggleData.id
      )
      state.plotList[element].visible = toggleData.visible
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
            commit('addPlot', { id, data: plotData })
            commit('addToPlotList', { id, name, visible: true })

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
      return state.plotList.sort((a, b) => {
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
