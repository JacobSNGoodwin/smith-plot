<template>
  <v-expansion-panel color="secondary">
    <v-expansion-panel-content>
      <template v-slot:header>
        <h2>Plot List</h2>
      </template>
      <v-card>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12 sm6 md4 v-for="plot in plotsByName" :key="plot.id">
              <v-switch
                :input-value="plot.visible"
                :label="plot.name"
                value
                @change="togglePlot($event, plot.id)"
              ></v-switch>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'PlotList',
  methods: {
    togglePlot (event, id) {
      this.$store.commit('togglePlotVisibility', { event, id })
    }
  },
  computed: {
    ...mapGetters(['plotsByName'])
  }
}
</script>

<style lang="stylus" scoped>
.expansion-content
  padding: 2em
</style>
