<template>
  <v-card flat>
    <div class="cartesianContainer">
      <svg class="cartesianSvg" :viewBox="svgBox" preserveApectRation="xMidYMid meet"></svg>
    </div>
  </v-card>
</template>

<script>
import { getSComponents } from '../../util/cartesianMath'
export default {
  name: 'CartesianPlot',
  props: {
    plots: Array
  },
  data () {
    return {
      viewPort: 1000,
      margin: 25
    }
  },
  computed: {
    svgBox () {
      const totalWidth = this.viewPort + 2 * this.margin
      return `0 0 ${totalWidth} ${totalWidth}`
    },
    plotsAllComponents () {
      const newPlots = this.plots.map(plot => {
        const plotComponents = getSComponents(plot.s)

        return {
          ...plot,
          ...plotComponents
        }
      })

      return newPlots
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
</style>
