<template>
  <v-container>
    <PlotSelector :enabledPlots="enabledPlots"/>
    <!-- update:returnValue - handle state when clicking backdrop outside of dialog -->
    <v-dialog :value="fileToModify" max-width="500px" @update:returnValue="clearSelectedFile">
      <EditFile
        v-if="fileToModify"
        @close-dialog="clearSelectedFile"
        @delete-file="deleteFile"
        @update-file-name="updateFileName"
        :file="files[fileToModify]"
      />
    </v-dialog>
    <ErrorDialog :error="error" @clear-error="clearError"></ErrorDialog>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import EditFile from '@/components/ui/EditFile'
import PlotSelector from '@/components/PlotSelector'
import ErrorDialog from '@/components/ui/ErrorDialog'

export default {
  name: 'PlotView',
  components: {
    PlotSelector,
    EditFile,
    ErrorDialog
  },
  methods: {
    clearError () {
      this.$store.commit('clearError')
    },
    clearSelectedFile () {
      this.$store.commit('setFileToModify', null)
    },
    deleteFile () {
      this.$store.commit('deleteFile', this.fileToModify)
    },
    updateFileName (newName) {
      this.$store.commit('updateFileName', { id: this.fileToModify.id, name: newName })
    }
  },
  computed: {
    ...mapState([
      'fileToModify',
      'files',
      'error'
    ]),
    ...mapGetters([
      'enabledPlots'
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
