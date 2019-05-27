<template>
  <v-card flat>
    <v-layout row justify-space-around>
      <v-flex sm4 xs10>
        <v-select
          class="selectPlot"
          v-model="selectedPlotType"
          :items="plotTypes"
          item-text="name"
          item-value="val"
          label="Plot Type"
        ></v-select>
      </v-flex>
    </v-layout>
    <div class="cartesianContainer">
      <svg class="cartesianSvg" :viewBox="svgBox" preserveApectRation="xMidYMid meet">
        <g class="cartesianGroup" :transform="groupTranslate"></g>
      </svg>
    </div>
  </v-card>
</template>

<script>
import { getSComponents, getXLimits, getYLimits, normalizeFreq } from '../../util/cartesianMath'
export default {
  name: 'CartesianPlot',
  props: {
    plots: Array
  },
  data () {
    return {
      viewPort: 1000,
      margin: 25,
      plotTypes: [
        { name: 'Real', val: 'sRe' },
        { name: 'Imaginary', val: 'sIm' },
        { name: 'Magnitude', val: 'sMag' },
        { name: 'dB', val: 'sDb' },
        { name: 'Angle - Radians', val: 'sAngle' },
        { name: 'Angle - Degrees', val: 'sDeg' }
      ],
      selectedPlotType: 'sRe',
      axesSettings: {
        xmin: 0,
        xmax: 1E9,
        xticks: 5,
        ymin: -100,
        ymax: 100,
        yticks: 5,
        plotFreqUnit: 'GHZ' // default unit of GHz
      }
    }
  },
  computed: {
    groupTranslate () {
      return `translate(${this.margin}, ${this.margin})`
    },
    plotsAllComponents () {
      const newPlots = this.plots.map(plot => {
        const plotComponents = getSComponents(plot.s)

        const freqToLocalUnit = normalizeFreq(plot.freq, this.axesSettings.plotFreqUnit, plot.unit) // make all plots have same freq unit

        return {
          ...plot,
          freq: freqToLocalUnit,
          ...plotComponents
        }
      })

      return newPlots
    },
    svgBox () {
      const totalWidth = this.viewPort + 2 * this.margin
      return `0 0 ${totalWidth} ${totalWidth}`
    },
    xLimits () {
      return getXLimits(this.plotsAllComponents)
    },
    yLimits () {
      return getYLimits(this.plotsAllComponents, this.selectedPlotType)
    }
  }
}
</script>

<style lang="stylus" scoped>
.cartesianContainer
  max-width: 750px
  margin: auto
  padding: 2em 0

.cartesianSvg
  shape-rendering: geometricPrecision

.selectPlot
  margin-top: 1.5em
</style>
