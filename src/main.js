import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueMultianalytics from 'vue-multianalytics'

const MAP_API_TOKEN = process.env.MAPS.API_TOKEN // /config/prod.env.js

Vue.use(VueGoogleMaps, {
  load: {
    key: MAP_API_TOKEN
  }
})

Vue.use(VueMultianalytics, {
  modules: {
    ga: {
      appName: 'Chatmap', // Mandatory
      appVersion: '0.1', // Mandatory
      trackingId: 'UA-112990587-2', // Mandatory
      debug: false // Whether or not display console logs debugs (optional)
    },
    mixpanel: {
      token: 'a036bcecd11b37a07555d80128765c32'
    }
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    let previousState = localStorage.getItem('chatmapEntityState')
    let entityState = JSON.parse(previousState)
    if (entityState && entityState.geo && entityState.geo.lat && entityState.geo.lng && !isNaN(entityState.geo.lat) && !isNaN(entityState.geo.lng)) {
      console.log('commiting previous state', entityState)
      this.$ma.trackEvent({action: 'user-return'})
      store.commit('SET_ENTITY_STATE', entityState)
      store.commit('RESET_DEFAULTS')
    } else {
      this.$ma.trackEvent({action: 'user-new'})
      store.commit('TOGGLE_LOCATION_MODAL', entityState)
    }
  }
})
