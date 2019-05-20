<template>
  <v-container>
    <PlotSelector/>
    <!-- update:returnValue - handle state when clicking backdrop outside of dialog -->
    <v-dialog :value="fileToModify" max-width="500px" @update:returnValue="clearSelectedFile">
      <EditPlot
        v-if="fileToModify"
        @close-dialog="clearSelectedFile"
        @delete-plot="deleteFile"
        @update-plot-name="updatePlotName"
        :plot="fileToModify"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

import EditPlot from '@/components/ui/EditPlot'
import PlotSelector from '@/components/PlotSelector'

export default {
  name: 'PlotView',
  components: {
    PlotSelector,
    EditPlot
  },
  methods: {
    clearSelectedFile () {
      this.$store.commit('setFileToModify', null)
    },
    deleteFile () {
      this.$store.commit('deleteFile', this.fileToModify)
    },
    testChange (event) {
      console.log(event)
    },
    updatePlotName (newName) {
      this.$store.commit('updatePlotName', { id: this.fileToModify.id, name: newName })
    }
  },
  computed: {
    ...mapState([
      'fileToModify'
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
