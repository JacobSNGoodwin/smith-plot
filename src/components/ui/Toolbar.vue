<template>
  <v-toolbar app absolute clipped-right color="primary">
    <v-toolbar-title class="white--text">RF Plotter</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn @click.stop="toggleDrawer" flat color="white">
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
