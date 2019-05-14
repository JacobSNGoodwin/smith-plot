<template>
  <v-navigation-drawer right fixed clipped app v-model="drawer" disable-resize-watcher>
    <v-list>
      <v-list-group v-for="plot in plotsByName" :key="plot.id">
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>{{ plot.name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>Plots down here</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list-group>
    </v-list>
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
        if (val === false) {
          // this prevents committing to state twice
          // only to allow for clicking on backdrop in mobile mode
          this.$store.commit('toggleNavDrawer', val)
        }
      }
    },
    plotsByName () {
      return this.$store.getters.plotsByName
    }
  }
}
</script>
