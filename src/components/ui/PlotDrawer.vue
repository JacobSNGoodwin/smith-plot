<template>
  <v-navigation-drawer right fixed clipped app v-model="drawer" disable-resize-watcher>
    <v-layout justify-center>
      <FileButton round color="secondary" @file-update="getFiles" :loading="loadingFiles">
        Add
        <v-icon>add</v-icon>
      </FileButton>
    </v-layout>
    <v-list subheader>
      <v-list-tile>
        <v-list-tile-title class="title">Plots</v-list-tile-title>
      </v-list-tile>
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
import { mapState, mapGetters } from 'vuex'
import FileButton from '@/components/ui/FileButton'
export default {
  name: 'PlotDrawer',
  components: {
    FileButton
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
    ...mapState([
      'loadingFiles'
    ]),
    ...mapGetters([
      'plotsByName'
    ])
  }
}
</script>

<style lang="stylus" scoped>
.title
  text-align: center
  padding: 1em 0

.FileButton
  display: block

  button
    margin: auto
</style>
