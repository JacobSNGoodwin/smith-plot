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
              <v-checkbox :label="plot.name" value="true"></v-checkbox>
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
  computed: {
    ...mapGetters(['plotsByName'])
  }
}
</script>

<style lang="stylus" scoped>
.expansion-content
  padding: 2em
</style>
