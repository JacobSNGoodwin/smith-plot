<template>
  <v-toolbar app absolute clipped-right color="primary">
    <v-toolbar-title class="white--text">RF Plotter</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-side-icon class="white--text" @click.stop="toggleDrawer"></v-toolbar-side-icon>
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
