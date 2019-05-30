<template>
  <svg class="coax" viewBox="0 0 800 800" preserveAspectRatio="xMinYMin meet">
    <g>
      <circle id="outer" r="350" cx="400" cy="400"></circle>
      <circle id="dielectric" r="250" cy="400" cx="400"></circle>
      <circle id="inner" r="125" cy="400" cx="400"></circle>
    </g>
  </svg>
</template>

<script>
export default {
  name: 'CoaxIcon'
}
</script>

// <style lang="stylus" scoped>
#outer
  fill: #37474f

#dielectric
  fill: #ffffff

#inner
  fill: #304ffe
</style>
