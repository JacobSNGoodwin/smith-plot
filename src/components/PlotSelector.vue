<template>
  <v-layout class="PlotSelector" justify-center>
    <v-flex xs12>
      <v-tabs fixed-tabs light icons-and-text>
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tab href="#smith">
          Smith
          <v-icon x-large>$vuetify.icons.smith</v-icon>
        </v-tab>
        <v-tab href="#cartesian">
          Rectangular
          <v-icon x-large>favorite</v-icon>
        </v-tab>

        <v-tab-item value="smith">
          <v-card flat>
            <v-card-text>Smith Component Here</v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item value="cartesian">
          <v-card flat>
            <v-card-text>Cartesian Component Here</v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'PlotSelector'
}
</script>

<style lang="stylus" scoped>
// .PlotSelector
//   margin: 2em auto
</style>
