<template>
  <v-layout class="FileButton" justify-center align-center column>
    <v-flex xs12>
      <v-btn v-bind="$attrs" @click="$refs.file.click()">
        <slot></slot>
      </v-btn>
      <input type="file" ref="file" @change="$emit('file-update', $event.target.files)">
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'FileButton'
}
</script>

<style lang="stylus" scoped>
input
  display: none

.FileButton
  padding: 1em 0
</style>
