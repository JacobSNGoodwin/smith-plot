<template>
  <v-expansion-panel color="secondary">
    <v-expansion-panel-content>
      <template v-slot:header>
        <h2>Plot List</h2>
      </template>
      <v-card>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12 sm6 md4 v-for="plot in plots" :key="plot.id">
              <div>
                <v-switch
                  class="switch"
                  :input-value="plot.visible"
                  value
                  @change="$emit('toggle-visibility', { visible: $event, id: plot.id })"
                >
                  <template v-slot:label>
                    <v-btn flat small @click.stop="$emit('edit-plot', plot.id)">
                      {{plot.name}}
                      <v-icon small right>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                </v-switch>
              </div>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  name: 'PlotList',
  props: ['plots']
}
</script>

<style lang="stylus" scoped>
.expansion-content
  padding: 2em
</style>
