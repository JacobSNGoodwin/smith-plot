<template>
  <v-container>
    <v-layout class="selection-buttons" justify-center>
      <FileButton round color="secondary" @file-update="getFiles" :loading="loadingFiles">
        Add
        <v-icon>add</v-icon>
      </FileButton>
    </v-layout>
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
import { mapState, mapGetters } from 'vuex'

import FileButton from '@/components/ui/FileButton'
// import EditPlot from '@/components/ui/EditPlot'
import PlotSelector from '@/components/PlotSelector'

export default {
  name: 'PlotView',
  components: {
    FileButton,
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
    getFiles (event) {
      const files = event.target.files

      // check length - a cancel after successful load will produce a change event
      if (files.length > 0) {
        this.$store.dispatch('loadFiles', files)
      }
    },
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
  },
  computed: {
    ...mapState([
      'loadingFiles'
    ]),
    ...mapGetters([
      'plotsByName'
    ])
  }
}
</script>

<style lang="stylus" scoped>
p
  text-align: center

.selection-buttons
  padding-bottom: 2em
</style>
