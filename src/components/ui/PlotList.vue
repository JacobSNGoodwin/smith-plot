<template>
  <div class="text-xs-center">
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn round color="primary" v-on="on">
          Select
          <v-icon>arrow_drop_down</v-icon>
        </v-btn>
      </template>
      <h3>Menu Content</h3>
    </v-menu>
  </div>
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
