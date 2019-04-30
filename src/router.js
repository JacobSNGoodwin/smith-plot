import Vue from 'vue'
import Router from 'vue-router'
// import PlotSelection from './views/PlotSelection.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // {
    //   path: '/',
    //   name: 'plotSelection',
    //   component: PlotSelection
    // }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting - lazy loading
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
