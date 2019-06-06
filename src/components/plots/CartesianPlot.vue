<template>
  <v-card flat>
    <v-layout row wrap justify-center>
      <v-flex md3 sm4 xs12>
        <v-select
          class="selectPlot"
          v-model="selectedPlotType"
          :items="plotTypes"
          item-text="name"
          item-value="val"
          label="Plot Type"
        ></v-select>
      </v-flex>
      <v-flex sm3 xs12>
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
      <svg
        class="cartesianSvg"
        :viewBox="svgBox"
        preserveApectRation="xMidYMid meet"
        ref="cartesianSvg"
      >
        <g class="cartesianGroup" :transform="groupTranslate">
          <clipPath id="clipPlots">
            <rect
              :x="axesSettings.insetLeft-3"
              :y="axesSettings.insetTop-3"
              :width="viewPort.x-axesSettings.insetLeft-axesSettings.insetRight+6"
              :height="viewPort.y-axesSettings.insetTop-axesSettings.insetBottom+6"
            ></rect>
          </clipPath>
          <g class="axes">
            <g class="axisGroup" :transform="`translate(${this.axesSettings.insetLeft}, 0)`">
              <path class="yAxis" :d="computedAxes.yAxisPath"></path>
              <transition name="fade">
                <path v-if="computedAxes.zeroPath" class="zeroAxis" :d="computedAxes.zeroPath"></path>
              </transition>
              <transition-group name="fade" tag="g">
                <g
                  v-for="tick in computedAxes.ticksY"
                  :key="tick.label"
                  :transform="`translate(0, ${tick.offset})`"
                >
                  <line x2="-10"></line>
                  <text class="tickLabel yLabel" x="-16" dy="6">{{tick.label.toFixed(2)}}</text>
                </g>
              </transition-group>
            </g>
            <g
              class="axisGroup"
              :transform="`translate(0, ${this.viewPort.y - this.axesSettings.insetBottom})`"
            >
              <path class="xAxis" :d="computedAxes.xAxisPath"></path>
              <text
                class="tickLabel xUnit"
                :transform="`translate(${this.viewPort.x / 2}, ${axesSettings.insetBottom + 10})`"
              >{{freqUnitLabel[axesSettings.plotFreqUnit]}}</text>
              <transition-group name="fade" tag="g">
                <g
                  v-for="tick in computedAxes.ticksX"
                  :key="tick.label"
                  :transform="`translate(${tick.offset}, 0)`"
                >
                  <line v-if="tick.offset" y2="10"></line>
                  <text class="tickLabel xLabel" x="0" dy="35">{{getFreqInLocalUnit(tick.label)}}</text>
                </g>
              </transition-group>
            </g>
          </g>
          <transition-group name="fade" tag="g">
            <g v-for="plot in plots" :key="plot.plotId">
              <path
                class="cartTraces"
                :d="getPlotPath(plot).path"
                :stroke="plot.color"
                @mouseover="showTooltip(plot, $event)"
                @mousemove="showTooltip(plot, $event)"
                @mouseout="hideTooltip"
                clip-path="url(#clipPlots)"
              ></path>
            </g>
          </transition-group>
          <circle
            v-if="tooltipVisible"
            class="hoverCircle"
            :cx="hoverCircle.x"
            :cy="hoverCircle.y"
            r="10"
            :fill="tooltipData.color"
            pointer-events="none"
          ></circle>
        </g>
      </svg>
    </div>
    <v-layout justify-center row wrap mx-4>
      <v-flex md2 sm3 xs6 px-1>
        <v-text-field
          class="numberField"
          label="Min Freq"
          outline
          v-model.number="axesSettings.xMin"
          type="number"
          clearable
        ></v-text-field>
      </v-flex>
      <v-flex md2 sm3 xs6 px-1>
        <v-text-field
          class="numberField"
          label="Max Freq"
          outline
          type="number"
          v-model.number="axesSettings.xMax"
          clearable
        ></v-text-field>
      </v-flex>
      <v-flex md2 sm3 xs6 px-1>
        <v-text-field
          class="numberField"
          label="Min Y"
          outline
          type="number"
          v-model.number="axesSettings.yMin"
          clearable
        ></v-text-field>
      </v-flex>
      <v-flex md2 sm3 xs6 px-1>
        <v-text-field
          class="numberField"
          label="Max Y"
          outline
          type="number"
          v-model.number="axesSettings.yMax"
          clearable
        ></v-text-field>
      </v-flex>
      <v-flex md2 sm3 xs6 px-1>
        <v-text-field
          class="numberField"
          label="Ticks x"
          outline
          type="number"
          hint="Please enter a positive value"
          v-model.number="axesSettings.xTicks"
          clearable
        ></v-text-field>
      </v-flex>
      <v-flex md2 sm3 xs6 px-1>
        <v-text-field
          class="numberField"
          label="Ticks y"
          outline
          type="number"
          hint="Please enter a positive value"
          v-model.number="axesSettings.yTicks"
          clearable
        ></v-text-field>
      </v-flex>
    </v-layout>
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
import { getAxes, getNearestPointFromFreq, getPathFromPlot, normalizeFreq } from '../../util/cartesianMath'
export default {
  name: 'CartesianPlot',
  props: {
    plots: Array
  },
  data () {
    return {
      viewPort: {
        x: 1200,
        y: 550
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
        { name: 'GHz', val: 'GHZ' }
      ],
      selectedPlotType: 'sRe',
      axesSettings: {
        xMin: '',
        xMax: null,
        xTicks: null,
        yMin: null,
        yMax: null,
        yTicks: null,
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
      hoverCircle: {
        x: null,
        y: null
      },
      tooltipX: null,
      tooltipY: null,
      tooltipVisible: false,
      tooltipData: {
        freq: null,
        s: null,
        title: null,
        color: null
      }
    }
  },
  methods: {
    getFreqInLocalUnit (freqHz) {
      return normalizeFreq(freqHz, this.axesSettings.plotFreqUnit, 'HZ').toFixed(2)
    },
    getPlotPath (plot) {
      return getPathFromPlot(plot, this.selectedPlotType, this.computedAxes.xScale, this.computedAxes.yScale)
    },
    showTooltip (plot, event) {
      const pt = this.$refs.cartesianSvg.createSVGPoint()
      pt.x = event.clientX
      pt.y = event.clientY

      const svgCoords = pt.matrixTransform(event.target.getScreenCTM().inverse())
      const freqAtMouseOver = this.computedAxes.xScale.invert(svgCoords.x)

      const nearestIndex = getNearestPointFromFreq(freqAtMouseOver, plot.freq, plot.unit)

      const s = plot[this.selectedPlotType][nearestIndex]
      const freq = normalizeFreq(plot.freq[nearestIndex], this.axesSettings.plotFreqUnit, plot.unit)

      this.tooltipData.color = plot.color
      this.tooltipData.freq = `${freq.toFixed(4)} ${this.axesSettings.plotFreqUnit}`
      this.tooltipData.s = `${s.toFixed(4)}`

      this.tooltipData.title = `${plot.fileName} - ${plot.label}`

      this.hoverCircle.x = this.computedAxes.xScale(normalizeFreq(freq, 'HZ', this.axesSettings.plotFreqUnit))
      this.hoverCircle.y = this.computedAxes.yScale(s)

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
    computedAxes () {
      return getAxes(this.plots, this.selectedPlotType, this.viewPort, this.axesSettings)
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
  stroke-width: 7
  stroke-linecap: square

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

.fade-enter-active, .fade-leave-active
  transition: opacity .35s

.fade-enter, .fade-leave-to
  opacity: 0

.numberField input::-webkit-inner-spin-button, .numberField input::-webkit-outer-spin-button
  -webkit-appearance: none
  margin: 0

.numberField input[type='number']
  -moz-appearance: textfield
  -webkit-appearance: none
  appearance: none
  margin: 0
</style>
