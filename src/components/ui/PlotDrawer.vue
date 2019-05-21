<template>
  <v-navigation-drawer right fixed clipped app v-model="drawer" disable-resize-watcher>
    <v-layout justify-center>
      <FileButton
        class="FileButton"
        round
        color="secondary"
        @file-update="getFiles"
        :loading="loadingFiles"
      >
        Add
        <v-icon>add</v-icon>
      </FileButton>
    </v-layout>
    <v-list subheader>
      <v-list-tile>
        <v-list-tile-title class="title">Plots</v-list-tile-title>
      </v-list-tile>
      <v-list-group v-for="file in filesByName" :key="file.id">
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>{{ file.name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
        <v-list-tile>
          <v-layout justify-center>
            <v-btn small round @click.stop="openModifyDialog(file)">Edit</v-btn>
          </v-layout>
        </v-list-tile>
        <v-list-tile v-for="(plot, index) in file.sPlots" :key="plot.label">
          <v-layout align-center>
            <!-- <v-list-tile-action> -->
            <v-checkbox
              :disabled="(plotType === 'smith' && plot.disabledSmith)"
              :color="plot.color"
              :input-value="plot.visibile"
              @change="togglePlotVisibility({index, id: file.id}, $event)"
              :label="plot.label"
            ></v-checkbox>
            <ColorPicker
              :currentColor="plot.color"
              @color-change="updateColor({index, id: file.id}, $event)"
            />
            <!-- <v-btn :color="plot.color" small dark depressed>Change</v-btn> -->
          </v-layout>
        </v-list-tile>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import FileButton from '@/components/ui/FileButton'
import ColorPicker from '@/components/ui/ColorPicker'

export default {
  name: 'PlotDrawer',
  components: {
    FileButton,
    ColorPicker
  },
  methods: {
    getFiles (event) {
      const files = event.target.files

      // check length - a cancel after successful load will produce a change event
      if (files.length > 0) {
        this.$store.dispatch('loadFiles', files)
      }
    },
    openModifyDialog (file) {
      this.$store.commit('setFileToModify', file)
    },
    togglePlotVisibility (plotToToggle, event) {
      const plotInfo = {
        ...plotToToggle,
        value: event
      }
      this.$store.commit('setPlotVisibility', plotInfo)
    },
    updateColor (plotToUpdate, hexColor) {
      const plotInfo = {
        ...plotToUpdate,
        value: hexColor
      }
      this.$store.commit('setPlotColor', plotInfo)
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
    ...mapGetters([
      'filesByName'
    ]),
    ...mapState([
      'loadingFiles',
      'plotType'
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
  padding-top: 1em
</style>
