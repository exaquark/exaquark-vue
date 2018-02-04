<template>
  <div class="Map">

    <gmap-map
      :center="geo"
      :zoom="zoom"
      class="map-canvas"
    ></gmap-map>

  </div>
</template>

<script>
import * as VueGoogleMaps from 'vue2-google-maps'
import Vue from 'vue'

const YOUR_API_TOKEN = process.env.MAPS.API_TOKEN // /config/prod.env.js

Vue.use(VueGoogleMaps, {
  load: {
    key: YOUR_API_TOKEN
  }
})

export default {
  name: 'Map',
  data: () => {
    return {
      geo: {
        lat: 1.3521,
        lng: 103.8198
      },
      zoom: 11
    }
  }
}
</script>
<style scoped lang="scss">
.Map {
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
