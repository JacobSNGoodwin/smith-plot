<template>
  <v-toolbar app fixed clipped-right color="primary">
    <v-toolbar-title class="white--text">SmithPlot</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn @click.stop="toggleDrawer" flat color="secondary">
      Select Plots
      <v-icon right>mdi-chart-line</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {
  name: 'Toolbar',
  methods: {
    toggleDrawer () {
      this.$store.commit('toggleNavDrawer', null)
    }
  }
}
</script>
