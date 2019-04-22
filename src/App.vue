<template>
  <v-app>
    <v-toolbar app color='primary'>
      <v-toolbar-side-icon class="white--text"></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">
        RF Plotter
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        href="#"
        target="_blank"
        class="white--text"
      >
        <span class="mr-2">Link</span>
      </v-btn>
    </v-toolbar>
    <v-content>
        <PlotSelection />
    </v-content>
  </v-app>
</template>

<script>
import PlotSelection from '@/views/PlotSelection'

export default {
  name: 'App',
  components: {
    PlotSelection
  },
  data () {
    return {
      //
    }
  }
}
</script>
