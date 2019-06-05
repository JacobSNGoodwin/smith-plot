<template>
  <v-navigation-drawer app floating right clipped v-model="drawer" disable-resize-watcher>
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
    <v-list subheader expand>
      <v-list-tile>
        <v-list-tile-title class="title">Plots</v-list-tile-title>
      </v-list-tile>
      <v-list-group v-for="fileId in fileListByName" :key="fileId">
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>{{ files[fileId].fileName }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
        <v-list-tile>
          <v-layout justify-space-around>
            <v-btn fab small outline color="info" @click.stop="enablePlotsInFile(fileId)">
              <v-icon>mdi-check-box-multiple-outline</v-icon>
            </v-btn>
            <v-btn fab small outline color="error" @click.stop="disablePlotsInFile(fileId)">
              <v-icon>mdi-minus-box-outline</v-icon>
            </v-btn>
            <v-btn fab small outline color="success" @click.stop="openModifyDialog(fileId)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-layout>
        </v-list-tile>
        <v-list-tile v-for="plotId in files[fileId].plotList" :key="plotId">
          <v-layout align-center>
            <v-checkbox
              :disabled="(plotType === 'smith' && plots[plotId].disabledSmith)"
              :color="plots[plotId].color"
              :value="plots[plotId].visible"
              @change="togglePlotVisibility(plotId, $event)"
              :label="plots[plotId].label"
            ></v-checkbox>
            <ColorPicker
              :currentColor="plots[plotId].color"
              @color-change="updateColor(plotId, $event)"
            />
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
    disablePlotsInFile (fileId) {
      this.$store.commit('setAllPlotsVisibility', { fileId, value: false })
    },
    enablePlotsInFile (fileId) {
      this.$store.commit('setAllPlotsVisibility', { fileId, value: true })
    },
    getFiles (event, fileRef) {
      const files = event.target.files

      // check length - a cancel after successful load will produce a change event
      if (files.length > 0) {
        this.$store.dispatch('loadFiles', { files, fileRef })
      }
    },
    openModifyDialog (fileId) {
      this.$store.commit('setFileToModify', fileId)
    },
    togglePlotVisibility (plotId, event) {
      const plotInfo = {
        plotId,
        value: event
      }
      this.$store.commit('setPlotVisibility', plotInfo)
    },
    updateColor (plotId, hexColor) {
      const plotInfo = {
        plotId,
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
      'fileListByName'
    ]),
    ...mapState([
      'files',
      'loadingFiles',
      'plots',
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

.ExpansionPanel
  box-shadow: none
  margin-top: 1em
</style>
