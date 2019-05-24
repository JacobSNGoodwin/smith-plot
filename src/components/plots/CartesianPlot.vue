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
      margin: 25,
      plotTypes: [
        { name: 'Real', val: 're' },
        { name: 'Imaginary', val: 'im' },
        { name: 'Magnitude', val: 'mag' },
        { name: 'dB', val: 'db' },
        { name: 'Angle - Radians', val: 'rad' },
        { name: 'Angle - Degrees', val: 'deg' }
      ],
      selectedPlotType: 'Real'
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

.selectPlot
  margin-top: 1.5em
</style>
