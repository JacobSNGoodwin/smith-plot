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
          <g class="axisGroup" :transform="`translate(${this.axesSettings.insetLeft}, 0)`">
            <path class="yAxis" :d="axisData.yAxisPath"></path>
            <path v-if="axisData.zeroPath" class="zeroAxis" :d="axisData.zeroPath"></path>
            <g
              v-for="tick in axisData.ticksY"
              :key="tick.label"
              :transform="`translate(0, ${tick.offset})`"
            >
              <line x2="-10"></line>
              <text class="tickLabel yLabel" x="-16" dy="6">{{tick.label.toFixed(2)}}</text>
            </g>
          </g>
          <g
            class="axisGroup"
            :transform="`translate(0, ${this.viewPort.y - this.axesSettings.insetBottom})`"
          >
            <path class="xAxis" :d="axisData.xAxisPath"></path>
            <text
              class="tickLabel xUnit"
              :transform="`translate(${this.viewPort.x / 2}, ${axesSettings.insetBottom})`"
            >{{freqUnitLabel[axesSettings.plotFreqUnit]}}</text>
            <g
              v-for="tick in axisData.ticksX"
              :key="tick.label"
              :transform="`translate(${tick.offset}, 0)`"
            >
              <line v-if="tick.offset" y2="10"></line>
              <text class="tickLabel xLabel" x="0" dy="35">{{tick.label.toFixed(2)}}</text>
            </g>
          </g>
          <g v-for="(plot, index) in plotsAllComponents" :key="plot.fileName+plot.label">
            <path class="cartTraces" :d="axisData.plotPaths[index]" :stroke="plot.color"></path>
          </g>
        </g>
      </svg>
    </div>
  </v-card>
</template>

<script>
import { getSComponents, getAxisData, normalizeFreq } from '../../util/cartesianMath'
export default {
  name: 'CartesianPlot',
  props: {
    plots: Array
  },
  data () {
    return {
      viewPort: {
        x: 1200,
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
        insetTop: 10, // inset of axes for group
        insetBottom: 90,
        insetLeft: 80,
        insetRight: 20
      },
      freqUnitLabel: {
        'HZ': 'Hz',
        'KHZ': 'kHz',
        'MHZ': 'MHz',
        'GHZ': 'GHz',
        'THZ': 'THz',
        'PHZ': 'PHz'
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
    axisData () {
      return getAxisData(this.plotsAllComponents, this.selectedPlotType, this.viewPort, this.axesSettings)
    }
  }
}
</script>

<style lang="stylus" scoped>
.cartesianContainer
  max-width: 1200px
  margin: auto
  padding: 2em 0

.cartesianSvg
  shape-rendering: geometricPrecision

.cartTraces
  fill: none
  stroke-width: 5

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
  text-rendering: geometricPrecision

.yLabel
  text-anchor: end

.xLabel
  text-anchor: middle

.xUnit
  text-anchor: middle

.zeroAxis
  stroke-width: 1.2
  stroke-dasharray: 5, 5
</style>
