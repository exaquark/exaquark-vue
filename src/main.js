import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import * as VueGoogleMaps from 'vue2-google-maps'

const MAP_API_TOKEN = process.env.MAPS.API_TOKEN // /config/prod.env.js

Vue.use(VueGoogleMaps, {
  load: {
    key: MAP_API_TOKEN,
    libraries: 'places' // load places for autocomplete
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
