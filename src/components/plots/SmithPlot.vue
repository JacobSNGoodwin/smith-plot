<template>
  <v-card flat>
    <div class="smithContainer">
      <svg class="smithSvg" :viewBox="svgBox" preserveApectRation="xMidYMid meet">
        <g class="realCircles" :transform="groupTranslate">
          <path v-for="path in realPaths" :key="path" :d="path"></path>
        </g>
        <g class="imagCircles" :transform="groupTranslate">
          <path v-for="path in imagPaths" :key="path" :d="path"></path>
        </g>

        <transition-group :transform="smithTranslate" name="fade" tag="g">
          <g v-for="(plot, index) in plots" :key="plot.fileName+plot.label">
            <path class="smithTraces" :d="smithLines[index]" :stroke="plot.color"></path>
            <circle
              v-for="(freq, index) in plot.freq"
              :key="freq"
              :cx="getDataPoint(plot, index).cx"
              :cy="getDataPoint(plot, index).cy"
              :r="5"
              :stroke="plot.color"
              :fill="plot.color"
              @mouseover="showTooltip"
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
      absolute
      light
      bottom
    >
      <span>A dadgummed tooltip</span>
    </v-tooltip>
  </v-card>
</template>

<script>
import { getRealPath, getImagPath, getSmithPlotLine, getSmithCoordinate } from '../../util/smithMath'
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
      tooltipVisible: false
    }
  },
  methods: {
    getDataPoint (plot, index) {
      return getSmithCoordinate(plot.s[index])
    },
    showTooltip (event) {
      this.tooltipX = event.clientX
      this.tooltipY = event.clientY
      this.tooltipVisible = true
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
    }
  }
}
</script>

<style lang="stylus" scoped>
.smithContainer
  max-width: 750px
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

circle
  stroke-width: 5
</style>
