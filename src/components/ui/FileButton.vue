<template>
  <v-layout justify-center align-center>
    <v-btn v-bind="$attrs" @click="$refs.file.click()">
      <slot></slot>
    </v-btn>
    <input type="file" ref="file" @change="processFile($event)">
    <p>
      File name:
      <strong>{{fileName}}</strong>
    </p>
  </div>
  </v-layout>
</template>

<script>
export default {
  name: 'FileButton',
  data () {
    return {
      fileName: null
    }
  },
  methods: {
    processFile (event) {
      this.fileName = event.target.files[0].name
    }
  }
}
</script>

<style lang="stylus" scoped>
input
  display: none

p
  margin-top: 1em
</style>
