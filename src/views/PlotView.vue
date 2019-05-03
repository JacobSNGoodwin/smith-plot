<template>
  <v-container>
    <FileButton round color="secondary" @file-update="getFiles" :loading="loadingFiles">
      <h3>Add</h3>
      <v-icon>add</v-icon>
    </FileButton>
    <FileList/>
    <PlotSelector/>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

import FileButton from '@/components/ui/FileButton'
import FileList from '@/components/ui/FileList'
import PlotSelector from '@/components/PlotSelector'
export default {
  name: 'PlotView',
  components: {
    FileList,
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
    }
  },
  computed: {
    ...mapState([
      'loadingFiles'
    ])
  }
}
</script>

<style lang="stylus" scoped>
p
  text-align: center
</style>
