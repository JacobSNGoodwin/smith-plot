<template>
  <v-app>
    <Toolbar/>
    <PlotDrawer/>
    <v-content>
      <PlotView/>
    </v-content>
  </v-app>
</template>

<script>
import PlotDrawer from '@/components/ui/PlotDrawer'
import PlotView from '@/views/PlotView'
import Toolbar from '@/components/ui/Toolbar'

export default {
  name: 'App',
  components: {
    PlotDrawer,
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
