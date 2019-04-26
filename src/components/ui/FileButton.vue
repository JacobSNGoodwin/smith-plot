<template>
  <v-layout justify-center align-center column>
    <v-flex xs12>
      <v-btn v-bind="$attrs" @click="$refs.file.click()">
        <slot></slot>
      </v-btn>
      <input type="file" ref="file" @change="processFile($event)">
    </v-flex>
    <v-flex xs12>
      <p>
        File name:
        <strong>{{fileName}}</strong>
      </p>
    </v-flex>
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
  display: block
  margin-top: 1em
</style>
