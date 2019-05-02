<template>
  <v-container>
    <FileButton round color="secondary" @file-update="getFiles">
      <h3>Select File</h3>
      <v-icon>add</v-icon>
    </FileButton>
    <v-layout justify-center>
      <v-flex xs12>
        <p>
          File name:
          <strong>{{currentFile.name}}</strong>
        </p>
      </v-flex>
    </v-layout>
    <PlotSelector/>
  </v-container>
</template>

<script>
import FileButton from '@/components/ui/FileButton'
import PlotSelector from '@/components/PlotSelector'
export default {
  name: 'PlotView',
  components: {
    FileButton,
    PlotSelector
  },
  data () {
    return {
      currentFile: null
    }
  },
  methods: {
    getFiles (files) {
      this.currentFile = files[0]
    }
  }
}
</script>

<style lang="stylus" scoped>
p
  text-align: center
</style>
