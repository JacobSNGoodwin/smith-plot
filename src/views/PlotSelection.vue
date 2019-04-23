<template>
  <v-layout justify-center align-center>
    <FileButton round color="secondary">
      <h3>Select File</h3>
      <v-icon>add</v-icon>
    </FileButton>
  </v-layout>
</template>

<script>
import FileButton from '@/components/ui/FileButton'
export default {
  name: 'PlotSelection',
  components: {
    FileButton
  }
}
</script>
