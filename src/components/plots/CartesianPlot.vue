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
        <g class="cartesianGroup" :transform="groupTranslate">
          <g class="axisGroup" :transform="`translate(${this.axesSettings.inset}, 0)`">
            <path class="yAxis" :d="yAxisData.path"></path>
            <g
              v-for="tick in yAxisData.ticks"
              :key="tick.label"
              :transform="`translate(0, ${tick.offsetY})`"
            >
              <line x2="-10"></line>
              <text class="tickLabel" x="-16" dy="6">{{tick.label.toFixed(3)}}</text>
            </g>
          </g>
          <g
            v-if="xAxisData"
            class="axisGroup"
            :transform="`translate(0, ${this.viewPort.y - this.axesSettings.inset})`"
          >
            <path class="xAxis" :d="xAxisData.path"></path>
            <g
              v-for="tick in xAxisData.ticks"
              :key="tick.label"
              :transform="`translate(${tick.offsetX}, 0)`"
            >
              <line v-if="tick.offsetX" y2="10"></line>
            </g>
          </g>
        </g>
      </svg>
    </div>
  </v-card>
</template>

<script>
import { getSComponents, getXAxisData, getYAxisData, normalizeFreq } from '../../util/cartesianMath'
export default {
  name: 'CartesianPlot',
  props: {
    plots: Array
  },
  data () {
    return {
      viewPort: {
        x: 1000,
        y: 750
      },
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
        xTicks: 5,
        ymin: -100,
        ymax: 100,
        yTicks: 5,
        plotFreqUnit: 'GHZ', // default unit of GHz
        inset: 50 // inset of axes for group
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
      const totalWidth = this.viewPort.x + 2 * this.margin
      const totalHeight = this.viewPort.y + 2 * this.margin
      return `0 0 ${totalWidth} ${totalHeight}`
    },
    xAxisData () {
      return getXAxisData(this.plotsAllComponents, this.viewPort, this.axesSettings)
    },
    yAxisData () {
      return getYAxisData(this.plotsAllComponents, this.selectedPlotType, this.viewPort, this.axesSettings)
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

.axisGroup
  stroke: #333333
  stroke-width: 3
  fill: none

.tickLabel
  stroke: #333333
  fill: #333333
  stroke-width: 1
  font-size: 20px
  font-family: Roboto
  text-anchor: end
  text-rendering: geometricPrecision
</style>
