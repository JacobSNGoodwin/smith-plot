<template>
  <div>
    <v-btn v-bind="$attrs" @click="$refs.file.click()">
      <slot></slot>
    </v-btn>
    <input type="file" ref="file" @change="$emit('file-update', $event)" multiple>
  </div>
</template>

<script>
export default {
  name: 'FileButton'
}
</script>

<style lang="stylus" scoped>
input
  display: none
</style>
