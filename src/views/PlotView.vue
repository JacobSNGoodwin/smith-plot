<template>
  <v-container>
    <PlotSelector/>
    <!-- <v-dialog v-model="dialog" max-width="500px">
      <EditPlot
        v-if="selectedPlot"
        @close-dialog="clearSelectedPlot"
        @delete-plot="deletePlot"
        @update-plot-name="updatePlotName"
        :plot="selectedPlot"
      />
    </v-dialog>-->
  </v-container>
</template>

<script>
// import EditPlot from '@/components/ui/EditPlot'
import PlotSelector from '@/components/PlotSelector'

export default {
  name: 'PlotView',
  components: {
    PlotSelector
    // EditPlot
  },
  data () {
    return {
      selectedPlot: null,
      dialog: false
    }
  },
  methods: {
    togglePlot (payload) {
      // payload.id, payload.visible
      this.$store.commit('togglePlotVisibility', payload)
    },
    editPlot (plot) {
      this.selectedPlot = plot
      this.dialog = true
    },
    clearSelectedPlot () {
      this.selectedPlot = null
      this.dialog = false
    },
    deletePlot () {
      this.$store.commit('deletePlot', this.selectedPlot)
      this.selectedPlot = null
      this.dialog = false
    },
    updatePlotName (newName) {
      this.$store.commit('updatePlotName', { id: this.selectedPlot.id, name: newName })
      this.selectedPlot = null
      this.dialog = false
    }
  }
}
</script>

<style lang="stylus" scoped>
p
  text-align: center

.selection-buttons
  padding-bottom: 2em
</style>
