<template>
  <v-navigation-drawer right fixed clipped app v-model="drawer">
    <h3>A plot drawer</h3>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'PlotDrawer',
  computed: {
    drawer: {
      get () {
        return this.$store.state.navDrawer
      },
      set (val) {
        this.$store.commit('toggleNavDrawer', val)
      }
    }
  }
}
</script>
