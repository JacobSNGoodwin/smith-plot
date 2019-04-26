<template>
  <v-app>
    <Toolbar/>
    <v-content>
      <PlotView/>
    </v-content>
  </v-app>
</template>

<script>
import PlotView from '@/views/PlotView'
import Toolbar from '@/components/ui/Toolbar'

export default {
  name: 'App',
  components: {
    PlotView,
    Toolbar
  },
  data () {
    return {
      //
    }
  }
}
</script>
