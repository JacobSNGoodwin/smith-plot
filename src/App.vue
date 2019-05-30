<template>
  <v-app>
    <Toolbar/>
    <PlotDrawer/>
    <v-content>
      <PlotView/>
    </v-content>
    <Footer/>
  </v-app>
</template>

<script>
import PlotDrawer from '@/components/ui/PlotDrawer'
import PlotView from '@/views/PlotView'
import Toolbar from '@/components/ui/Toolbar'
import Footer from '@/components/ui/Footer'

export default {
  name: 'App',
  metaInfo: {
    title: 'SmithPlot',
    meta: [
      { 'http-equiv': 'Content-Type', content: 'text/html; charset=utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: 'Modern Single Page Application for Plotting Touchstone files on a Smith Chart and in Cartesian Coordinates.' },
      // OpenGraph data (Most widely used)
      { property: 'og:title', content: 'SmithPlot' },
      { property: 'og:site_name', content: 'SmithPlot' },
      // The list of types is available here: http://ogp.me/#types
      { property: 'og:type', content: 'website' },
      // Should the the same as your canonical link, see below.
      { property: 'og:url', content: 'https://www.smithplot.com' },
      { property: 'og:image', content: 'https://www.smithplot.com/img/SmithPlotter.PNG' },
      // Often the same as your meta description, but not always.
      { property: 'og:description', content: 'Modern Single Page Application for Plotting Touchstone files on a Smith Chart and in Cartesian Coordinates.' },

      // Twitter card
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:site', content: 'https://www.smithplot.com' },
      { name: 'twitter:title', content: 'SmithPlot' },
      { name: 'twitter:description', content: 'Modern Single Page Application for Plotting Touchstone files on a Smith Chart and in Cartesian Coordinates.' },
      // Your twitter handle, if you have one.
      { name: 'twitter:creator', content: '@JacobSNGoodwin' },
      { name: 'twitter:image:src', content: 'https://www.smithplot.com/img/SmithPlotter.PNG' },

      // Google / Schema.org markup:
      { itemprop: 'name', content: 'SmithPlot' },
      { itemprop: 'description', content: 'Modern Single Page Application for Plotting Touchstone files on a Smith Chart and in Cartesian Coordinates.' },
      { itemprop: 'image', content: 'https://www.smithplot.com/img/SmithPlotter.PNG' }
    ],
    link: [
      { rel: 'canonical', href: 'https://www.smithplot.com' }
    ]
  },
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
