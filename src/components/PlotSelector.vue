<template>
  <v-layout class="PlotSelector" justify-center>
    <v-flex xs12>
      <v-tabs fixed-tabs light icons-and-text @change="setPlotType($event)">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab href="#smith">
          Smith
          <v-icon x-large color="primary">$vuetify.icons.smith</v-icon>
        </v-tab>
        <v-tab href="#cartesian">
          Rectangular
          <v-icon x-large color="primary">mdi-chart-line</v-icon>
        </v-tab>

        <v-tab-item value="smith">
          <SmithPlot :plots="enabledSmithPlots"/>
        </v-tab-item>
        <v-tab-item value="cartesian">
          <!-- <CartesianPlot :plots="enabledPlots"/> -->
        </v-tab-item>
      </v-tabs>
    </v-flex>
  </v-layout>
</template>

<script>
import SmithPlot from '@/components/plots/SmithPlot.vue'
// import CartesianPlot from '@/components/plots/CartesianPlot.vue'
export default {
  name: 'PlotSelector',
  components: {
    SmithPlot
    // CartesianPlot
  },
  props: {
    enabledPlots: Array
  },
  methods: {
    setPlotType (event) {
      this.$store.commit('setPlotType', event)
    }
  },
  computed: {
    enabledSmithPlots () {
      return this.enabledPlots.filter(plot => !plot.disabledSmith)
    }
  }
}
</script>

<style lang="stylus" scoped>
// .PlotSelector
//   margin: 2em auto
</style>
