<template>
  <v-card flat color="accent">
    <svg :viewBox="svgBox" preserveApectRation="xMidYMid meet"></svg>
  </v-card>
</template>

<script>
export default {
  name: 'SmithPlot',
  data () {
    return {
      margin: 0.025,
      realLineValues: [0.2, 0.5, 1, 2, 5, 10],
      imagLineValues: [0.2, 0.5, 1, 2, 5, 10]
    }
  },
  computed: {
    svgBox () {
      const totalWidth = 1 + 2 * this.margin
      return `0 0 ${totalWidth} ${totalWidth}`
    }
  }
}
</script>

<style lang="stylus" scoped>
.smith
  background-color: $accent
</style>
