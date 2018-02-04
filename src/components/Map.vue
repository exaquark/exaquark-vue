<template>
  <div class="Map">

    <gmap-map
      :center="{lat:10, lng:10}"
      :zoom="7"
      class="map-canvas"
    ></gmap-map>

  </div>
</template>

<script>
import * as VueGoogleMaps from 'vue2-google-maps'
import Vue from 'vue'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'YOUR_API_TOKEN'
  }
})
export default {
  name: 'Map'
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
