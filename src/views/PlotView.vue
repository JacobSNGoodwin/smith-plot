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
      const files = event.target.files

      // check length - a cancel after successful load will produce a change event
      if (files.length > 0) {
        this.$store.dispatch('loadFiles', files)
      }
    },
    print (event) {
      console.log(event)
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
