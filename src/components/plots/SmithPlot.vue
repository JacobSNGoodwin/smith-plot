<template>
  <v-card flat>
    <svg :viewBox="svgBox" preserveApectRation="xMidYMid meet">
      <g class="realCircles" :transform="groupTranslate">
        <path v-for="path in realPaths" :key="path" :d="path"></path>
      </g>
    </svg>
  </v-card>
</template>

<script>
import { getRealPath } from '../../util/smithMath'
export default {
  name: 'SmithPlot',
  data () {
    return {
      margin: 0.025,
      realLineValues: [Number.MIN_VALUE, 0.2, 0.5, 1, 2, 5, 10],
      imagLineValues: [0.2, 0.5, 1, 2, 5, 10]
    }
  },
  computed: {
    svgBox () {
      const totalWidth = 1 + 2 * this.margin
      return `0 0 ${totalWidth} ${totalWidth}`
    },
    groupTranslate () {
      return `translate(${this.margin}, ${this.margin})`
    },
    realPaths () {
      return this.realLineValues.map(realValue => getRealPath(realValue))
    }
  }
}
</script>

<style lang="stylus" scoped>
.realCircles
  stroke: black
  stroke-width: .005
  fill: none
</style>
