<template>
  <v-expansion-panel color="secondary">
    <v-expansion-panel-content>
      <template v-slot:header>
        <h2>Plot List</h2>
      </template>
      <v-card>
        <v-card-text v-for="plot in plotsByName" :key="plot.id">{{plot.name}}</v-card-text>
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
