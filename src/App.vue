<template>
  <v-app>
    <Toolbar/>
    <PlotDrawer/>
    <v-content>
      <PlotView/>
      <v-container>
        <Footer/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import PlotDrawer from '@/components/ui/PlotDrawer'
import PlotView from '@/views/PlotView'
import Toolbar from '@/components/ui/Toolbar'
import Footer from '@/components/ui/Footer'

export default {
  name: 'App',
  components: {
    PlotDrawer,
    PlotView,
    Toolbar,
    Footer
  },
  created () {
    if (window.innerWidth < 1264) {
      this.$store.commit('toggleNavDrawer', false)
    }
  }
}
</script>
