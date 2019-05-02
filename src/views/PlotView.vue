<template>
  <v-container>
    <FileButton round color="secondary" @file-update="getFiles" :loading="loadingFiles">
      <h3>Select Files</h3>
      <v-icon>add</v-icon>
    </FileButton>
    <PlotSelector/>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

import FileButton from '@/components/ui/FileButton'
import PlotSelector from '@/components/PlotSelector'
export default {
  name: 'PlotView',
  components: {
    FileButton,
    PlotSelector
  },
  methods: {
    getFiles (event) {
      this.$store.dispatch('loadFiles', event.target.files)
    }
  },
  computed: mapState([
    'loadingFiles'
  ])
}
</script>

<style lang="stylus" scoped>
p
  text-align: center
</style>
