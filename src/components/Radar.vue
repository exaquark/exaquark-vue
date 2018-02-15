<template>
  <div class="Radar">

    <gmap-map :center="geo" :zoom="zoom" class="map-canvas" @center_changed="updateCenter" :options="defaultMapOptions">
      <gmap-marker
        key="currentUser"
        :position="geo"
        :clickable="false"
        :draggable="false"
        :icon="defaultIconOptions"
      />
      <RadarMarker v-for="neighbor in markers" :key="neighbor.iid" :entityState="neighbor" />
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
  data: () => {
    return {
      defaultIconOptions: {
        url: 'https://i.imgur.com/zRERkjv.gif',
        scaledSize: {width: 50, height: 50, f: 'px', b: 'px'},
        rotation: 45
      },
      // defaultIconOptions: {
      //   path: 'M0,5a5,5 0 1,0 10,0a5,5 0 1,0 -10,0',
      //   fillColor: '#425AFF',
      //   fillOpacity: 0.5,
      //   strokeWeight: 0,
      //   scale: 3
      // },
      defaultMapOptions: {
        clickableIcons: false,
        streetViewControl: false,
        panControlOptions: false,
        gestureHandling: 'greedy',
        disableDefaultUI: true,
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        draggable: false,
        styles: [
          {
            elementType: 'geometry',
            stylers: [{color: '#f5f5f5'}]
          },
          {
            elementType: 'labels.icon',
            stylers: [{visibility: 'off'}]
          },
          {
            elementType: 'labels.text.fill',
            stylers: [{color: '#616161'}]
          },
          {
            elementType: 'labels.text.stroke',
            stylers: [{color: '#f5f5f5'}]
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [{color: '#bdbdbd'}]
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{color: '#eeeeee'}]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#757575'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{color: '#e5e5e5'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9e9e9e'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#ffffff'}]
          },
          {
            featureType: 'road.arterial',
            elementType: 'labels.text.fill',
            stylers: [{color: '#757575'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#dadada'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{color: '#616161'}]
          },
          {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9e9e9e'}]
          },
          {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [{color: '#e5e5e5'}]
          },
          {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [{color: '#eeeeee'}]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{color: '#c9c9c9'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9e9e9e'}]
          }
        ]
      }
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
    // temp function to mimic movement in a world
    updateCenter: function (newCenter) {
      this.$emit('onMove', newCenter)
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
