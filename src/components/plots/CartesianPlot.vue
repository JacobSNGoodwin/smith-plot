<template>
  <v-card flat>
    <v-layout column align-center>
      <v-switch class="switch" v-model="showDataPoints" label="Show Datapoints?"></v-switch>
    </v-layout>
    <v-layout row justify-center>
      <v-flex sm3 xs6>
        <v-select
          class="selectPlot"
          v-model="selectedPlotType"
          :items="plotTypes"
          item-text="name"
          item-value="val"
          label="Plot Type"
        ></v-select>
      </v-flex>
      <v-flex sm3 xs6>
        <v-select
          class="selectPlot"
          v-model="axesSettings.plotFreqUnit"
          :items="freqUnits"
          item-text="name"
          item-value="val"
          label="Freq Unit"
        ></v-select>
      </v-flex>
    </v-layout>
    <div class="cartesianContainer">
      <svg class="cartesianSvg" :viewBox="svgBox" preserveApectRation="xMidYMid meet">
        <g class="cartesianGroup" :transform="groupTranslate">
          <g class="axisGroup" :transform="`translate(${this.axesSettings.insetLeft}, 0)`">
            <path class="yAxis" :d="plotData.yAxisPath"></path>
            <path v-if="plotData.zeroPath" class="zeroAxis" :d="plotData.zeroPath"></path>
            <g
              v-for="tick in plotData.ticksY"
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
            <path class="xAxis" :d="plotData.xAxisPath"></path>
            <text
              class="tickLabel xUnit"
              :transform="`translate(${this.viewPort.x / 2}, ${axesSettings.insetBottom + 10})`"
            >{{freqUnitLabel[axesSettings.plotFreqUnit]}}</text>
            <g
              v-for="tick in plotData.ticksX"
              :key="tick.label"
              :transform="`translate(${tick.offset}, 0)`"
            >
              <line v-if="tick.offset" y2="10"></line>
              <text class="tickLabel xLabel" x="0" dy="35">{{tick.label.toFixed(2)}}</text>
            </g>
          </g>
          <g v-for="(plot, index) in plots" :key="plot.fileId+plot.label">
            <path class="cartTraces" :d="plotData.plotPaths[index].path" :stroke="plot.color"></path>
            <circle
              v-for="d in plotData.plotPaths[index].pathData"
              :key="d.x"
              :cx="plotData.xScale(d.x)"
              :cy="plotData.yScale(d.y)"
              :r="dataPointRadius"
              :stroke="getStrokeFill(plot.color)"
              :fill="getStrokeFill(plot.color)"
              @mouseover="showTooltip(plot, index, d, $event)"
              @mouseout="hideTooltip"
            ></circle>
          </g>
        </g>
      </svg>
    </div>
    <v-tooltip
      :value="tooltipVisible"
      :position-x="tooltipX"
      :position-y="tooltipY"
      :color="tooltipData.color"
      absolute
      light
      bottom
    >
      <v-layout :style="fontStyle" justify-center column>
        <div class="subheading font-weight-bold">{{tooltipData.title}}</div>
        <div class="body-2">freq: {{tooltipData.freq}}</div>
        <div class="body-2">{{selectedPlotType}}: {{tooltipData.s}}</div>
      </v-layout>
    </v-tooltip>
  </v-card>
</template>

<script>
import * as chroma from 'chroma-js'
import { getPlotData } from '../../util/cartesianMath'
export default {
  name: 'CartesianPlot',
  props: {
    plots: Array
  },
  data () {
    return {
      viewPort: {
        x: 1200,
        y: 600
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
      freqUnits: [
        { name: 'KHz', val: 'KHZ' },
        { name: 'MHz', val: 'MHZ' },
        { name: 'GHz', val: 'GHZ' },
        { name: 'THz', val: 'THZ' }
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
        insetBottom: 70,
        insetLeft: 70,
        insetRight: 40
      },
      freqUnitLabel: {
        'HZ': 'Hz',
        'KHZ': 'kHz',
        'MHZ': 'MHz',
        'GHZ': 'GHz',
        'THZ': 'THz',
        'PHZ': 'PHz'
      },
      tooltipX: null,
      tooltipY: null,
      tooltipVisible: false,
      tooltipData: {
        freq: null,
        s: null,
        title: null,
        color: null
      },
      showDataPoints: false
    }
  },
  methods: {
    getStrokeFill (color) {
      return this.showDataPoints ? color : 'transparent'
    },
    showTooltip (plot, index, dataPoint, event) {
      const freq = dataPoint.x
      const s = dataPoint.y

      this.tooltipData.color = plot.color
      this.tooltipData.freq = `${freq.toFixed(4)} ${this.axesSettings.plotFreqUnit}`
      this.tooltipData.s = `${s.toFixed(4)}`

      this.tooltipData.title = `${plot.fileName} - ${plot.label}`

      this.tooltipX = event.clientX
      this.tooltipY = event.clientY
      this.tooltipVisible = true
    },
    hideTooltip (event) {
      this.tooltipVisible = false
    }
  },
  computed: {
    groupTranslate () {
      return `translate(${this.margin}, ${this.margin})`
    },
    svgBox () {
      const totalWidth = this.viewPort.x + 2 * this.margin
      const totalHeight = this.viewPort.y + 2 * this.margin
      return `0 0 ${totalWidth} ${totalHeight}`
    },
    plotData () {
      return getPlotData(this.plots, this.selectedPlotType, this.viewPort, this.axesSettings)
    },
    dataPointRadius () {
      return this.showDataPoints ? 5 : 10
    },
    fontStyle () {
      if (this.tooltipData.color === null) {
        return {
          color: '#fff'
        }
      }

      // choose font color based on luminance of background
      const luminance = chroma(this.tooltipData.color).luminance()

      if (luminance > 0.179) {
        return {
          color: '#000'
        }
      }

      return {
        color: '#fff'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.cartesianContainer
  max-width: 1000px
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
  // stroke: #333333
  fill: #333333
  stroke-width: 0
  font-size: 24px
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

.selectPlot
  padding: 0 1em
</style>
