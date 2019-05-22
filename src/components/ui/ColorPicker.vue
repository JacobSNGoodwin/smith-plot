<template>
  <v-menu offset-x left :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <v-btn class="custom-size" :color="colors.hex8" fab dark v-on="on"></v-btn>
    </template>
    <v-card>
      <chrome-picker v-model="colors" @input="$emit('color-change', colors.hex8)"/>
    </v-card>
  </v-menu>
</template>

<script>
import { Chrome } from 'vue-color'
export default {
  name: 'ColorPicker',
  components: {
    'chrome-picker': Chrome
  },
  props: {
    currentColor: String
  },
  data () {
    return {
      colors: {
        hex8: this.currentColor
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.custom-size
  height: 32px
  width: 32px
</style>
