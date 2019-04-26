<template>
  <v-container>
    <FileButton round color="secondary">
      <h3>Select File</h3>
      <v-icon>add</v-icon>
    </FileButton>

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
  }
}
</script>
