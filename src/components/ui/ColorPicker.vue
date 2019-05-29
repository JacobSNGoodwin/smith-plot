<template>
  <v-menu offset-x left :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <v-btn class="custom-size" :color="colors.hex8" fab dark v-on="on"></v-btn>
    </template>
    <v-card>
      <chrome-picker v-model="colors" @input="debouncedColorChange"/>
    </v-card>
  </v-menu>
</template>

<script>
import debounce from 'lodash/debounce'
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
        hex: null,
        hex8: null,
        a: null
      }
    }
  },
  methods: {
    debouncedColorChange: debounce(function () { this.$emit('color-change', this.colors.hex8) }, 100)
  },
  created () {
    this.colors = {
      hex: this.currentColor,
      hex8: this.currentColor + 'FF',
      a: 1
    }
  }
}
</script>

<style lang="stylus" scoped>
.custom-size
  height: 32px
  width: 32px
</style>
