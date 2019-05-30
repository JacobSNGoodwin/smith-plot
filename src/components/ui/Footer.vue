<template>
  <v-footer app height="auto" class="pa-1 subheading">
    <v-layout justify-center row wrap>
      <v-btn v-for="link in links" :key="link.url" :href="link.url" target="_blank" icon large>
        <v-icon large :color="link.color">{{link.icon}}</v-icon>
      </v-btn>
      <v-flex text-xs-center xs12>&copy; {{ new Date().getFullYear() }} - Jacob Goodwin</v-flex>
    </v-layout>
  </v-footer>
</template>

<script>
export default {
  data () {
    return {
      links: [
        { icon: 'mdi-linkedin', url: 'https://www.linkedin.com/in/jacobgoodwin1/', color: '#0077b5' },
        { icon: 'mdi-github-circle', url: 'https://github.com/Maxbrain0/smith-plot', color: '#6e5494' },
        { icon: '$vuetify.icons.coax', url: 'https://www.tlcalc.app', color: 'none' },
        { icon: 'mdi-email-outline', url: 'mailto: jacob.goodwin@gmail.com"', color: 'info' }
      ]
    }
  }
}
</script>
