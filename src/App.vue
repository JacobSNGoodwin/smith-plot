<template>
  <v-app>
    <Toolbar/>
    <v-content>
      <v-container justify-space-around>
        <PlotSelection/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import PlotSelection from '@/views/PlotSelection'
import Toolbar from '@/components/ui/Toolbar'

export default {
  name: 'App',
  components: {
    PlotSelection,
    Toolbar
  },
  data () {
    return {
      //
    }
  }
}
</script>
