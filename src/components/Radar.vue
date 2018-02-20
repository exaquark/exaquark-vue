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
      <RadarMarker v-for="neighbor in markers" :key="neighbor.iid" :neighborState="neighbor" />
    </gmap-map>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import RadarMarker from '@/components/RadarMarker.vue'
Vue.component('google-map', VueGoogleMaps.Map)
Vue.component('google-marker', VueGoogleMaps.Marker)
const DEFAULT_AVATAR = process.env.AVATARS.ME // /config/prod.env.js
const DEFAULT_ZOOM_LEVEL = 19
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
      default: DEFAULT_ZOOM_LEVEL,
      validator: function (value) {
        return value <= DEFAULT_ZOOM_LEVEL
      }
    },
    markers: {
      type: Array,
      required: false
    }
  },
  data: () => {
    return {
      defaultMapOptions: {
        clickableIcons: false,
        streetViewControl: true,
        panControlOptions: false,
        // gestureHandling: 'greedy',
        keyboardShortcuts: false,
        disableDefaultUI: false,
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: true,
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
    ...mapGetters([
      'customAvatar'
    ]),
    geo: function () {
      return {
        lat: this.lat,
        lng: this.lng
      }
    },
    defaultIconOptions: function () {
      let avatarUrl = this.customAvatar || DEFAULT_AVATAR
      // let avatarUrl = this.customAvatar || DEFAULT_AVATAR
      return {
        url: avatarUrl,
        scaledSize: {width: 30, height: 30, f: 'px', b: 'px'},
        rotation: 45
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
  position: relative;
  width: 100%;
  height: 100%;
  .map-canvas {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
