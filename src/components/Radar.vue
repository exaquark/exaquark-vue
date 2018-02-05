<template>
  <div class="Radar">

    <gmap-map
      :center="geo"
      :zoom="zoom"
      class="map-canvas"
    ></gmap-map>

  </div>
</template>

<script>

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
    }
  },
  computed: {
    geo: function () {
      return {
        lat: this.lat,
        lng: this.lng
      }
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
