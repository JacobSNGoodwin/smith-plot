import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

import '@mdi/font/css/materialdesignicons.css'
import SmithIcon from '../icons/SmithIcon.vue'
import CoaxIcon from '../icons/CoaxIcon.vue'

Vue.use(Vuetify, {
  iconfont: 'mdi',
  theme: {
    primary: '#254070',
    secondary: '#FFD65E',
    accent: '#EDAFB8',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  },
  icons: {
    smith: {
      component: SmithIcon
    },
    coax: {
      component: CoaxIcon
    }
  }
})
