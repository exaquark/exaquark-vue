<template>
  <div class="Radar">

    <gmap-map :center="geo" :zoom="zoom" class="map-canvas" @center_changed="updateCenter">
      <google-cluster>
        <RadarMarker v-for="neighbor in markers" :key="neighbor.iid" :entityState="neighbor" />
      </google-cluster>
    </gmap-map>

  </div>
</template>

<script>
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import RadarMarker from '@/components/RadarMarker.vue'
Vue.component('google-map', VueGoogleMaps.Map)
Vue.component('google-marker', VueGoogleMaps.Marker)
Vue.component('google-cluster', VueGoogleMaps.Cluster)
export default {
  name: 'Radar',
  props: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    },
    zoom: {
      type: Number,
      default: 17,
      validator: function (value) {
        return value <= 17
      }
    },
    markers: {
      type: Array,
      required: false
    }
  },
  components: {
    RadarMarker
  },
  computed: {
    geo: function () {
      return {
        lat: this.lat,
        lng: this.lng
      }
    }
  },
  methods: {
    updateCenter: function (newCenter) {
      console.log('newCenter', newCenter)
    }
  }
}
</script>
<style scoped lang="scss">
.Radar {
  position: absolute;
  width: 100%;
  height: 100%;
  .map-canvas {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
