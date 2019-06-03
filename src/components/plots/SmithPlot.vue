<template>
  <v-card flat>
    <v-layout column align-center>
      <v-switch class="switch" v-model="showDataPoints" label="Show Datapoints?"></v-switch>
    </v-layout>
    <div class="smithContainer">
      <svg class="smithSvg" :viewBox="svgBox" preserveApectRation="xMidYMid meet">
        <g class="realCircles" :transform="groupTranslate">
          <path v-for="path in realPaths" :key="path" :d="path"></path>
        </g>
        <g class="imagCircles" :transform="groupTranslate">
          <path v-for="path in imagPaths" :key="path" :d="path"></path>
        </g>

        <transition-group :transform="smithTranslate" name="fade" tag="g">
          <g v-for="(plot, index) in plots" :key="plot.plotId">
            <path class="smithTraces" :d="smithLines[index]" :stroke="plot.color"></path>
            <circle
              v-for="(freq, index) in plot.freq"
              :key="freq"
              :cx="getDataPoint(plot, index).cx"
              :cy="getDataPoint(plot, index).cy"
              :r="dataPointRadius"
              :stroke="getStrokeFill(plot.color)"
              :fill="getStrokeFill(plot.color)"
              @mouseover="showTooltip(plot, index, $event)"
              @mouseout="hideTooltip"
            ></circle>
          </g>
        </transition-group>
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
        <div class="body-2">Zref: {{tooltipData.z0}}</div>
        <div class="body-2">freq: {{tooltipData.freq}}</div>
        <div class="body-2">S: {{tooltipData.s}}</div>
        <div class="body-2">Z: {{tooltipData.z}}</div>
      </v-layout>
    </v-tooltip>
  </v-card>
</template>

<script>
import * as chroma from 'chroma-js'
import math from 'mathjs'
import { getRealPath, getImagPath, getSmithPlotLine, getSmithCoordinate, gammaToZLoad } from '../../util/smithMath'
export default {
  name: 'SmithPlot',
  props: {
    plots: Array
  },
  data () {
    return {
      viewPort: 1000,
      margin: 25,
      realLineValues: [0, 0.2, 0.5, 1, 2, 5, 10],
      imagLineValues: [-10, -5, -2, -1, -0.5, -0.2, 0, 0.2, 0.5, 1, 2, 5, 10],
      tooltipX: null,
      tooltipY: null,
      tooltipVisible: false,
      tooltipData: {
        freq: null,
        s: null,
        z: null,
        z0: null,
        title: null,
        color: null
      },
      showDataPoints: false
    }
  },
  methods: {
    getDataPoint (plot, index) {
      return getSmithCoordinate(plot.sParams.sRe[index], plot.sParams.sIm[index])
    },
    showTooltip (plot, index, event) {
      const freq = plot.freq[index]
      const sRe = plot.sParams.sRe[index]
      const sIm = plot.sParams.sIm[index]

      // for displaying complex number as a string
      let sSign = '+'
      let sImag = sIm
      if (sIm < 0) {
        sSign = '-'
        sImag = -1 * sIm
      }

      const z = gammaToZLoad(math.complex(sRe, sIm), plot.z0)

      let zSign = '+'
      let zImag = z.im
      if (z.im < 0) {
        zSign = '-'
        zImag = -1 * z.im
      }

      this.tooltipData.color = plot.color
      this.tooltipData.z0 = plot.z0
      this.tooltipData.freq = `${freq.toFixed(4)} ${plot.unit}`
      this.tooltipData.s = `${sRe.toFixed(4)} ${sSign} ${sImag.toFixed(4)}i`
      this.tooltipData.z = `${z.re.toFixed(4)} ${zSign} ${zImag.toFixed(4)}i \u03A9`

      this.tooltipData.title = `${plot.fileName} - ${plot.label}`

      this.tooltipX = event.clientX
      this.tooltipY = event.clientY
      this.tooltipVisible = true
    },
    getStrokeFill (color) {
      return this.showDataPoints ? color : 'transparent'
    },
    hideTooltip (event) {
      this.tooltipVisible = false
    }

  },
  computed: {
    svgBox () {
      const totalWidth = this.viewPort + 2 * this.margin
      return `0 0 ${totalWidth} ${totalWidth}`
    },
    groupTranslate () {
      return `translate(${this.margin}, ${this.margin})`
    },
    realPaths () {
      return this.realLineValues.map(realValue => getRealPath(realValue))
    },
    imagPaths () {
      return this.imagLineValues.map(imagValue => getImagPath(imagValue))
    },
    smithTranslate () {
      return `translate(${this.margin + this.viewPort / 2}, ${this.margin + this.viewPort / 2})`
    },
    smithLines () {
      return this.plots.map(plot => getSmithPlotLine(plot))
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
.smithContainer
  max-width: 600px
  margin: auto
  padding: 2em 0

.smithSvg
  shape-rendering: geometricPrecision

.realCircles
  stroke: #333333
  stroke-width: 5
  fill: none

.imagCircles
  stroke: #333333
  stroke-width: 5
  fill: none

.smithTraces
  stroke-width: 5
  fill: none

.fade-enter-active, .fade-leave-active
  transition: opacity .35s

.fade-enter, .fade-leave-to
  opacity: 0

.switch
  div
    margin: auto
</style>
