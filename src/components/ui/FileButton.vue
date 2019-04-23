<template>
  <div>
    <v-btn v-bind="$attrs" @click="$refs.file.click()">
      <slot></slot>
    </v-btn>
    <input type="file" ref="file" @change="processFile($event)">
  </div>
</template>

<script>
export default {
  name: 'FileButton',
  methods: {
    processFile (event) {
      console.log(event.target.files)
    }
  }
}
</script>

<style lang="stylus" scoped>
input
  display: none
</style>
