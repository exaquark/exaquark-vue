<template>
  <div class="RadarMarker">

    <!-- <gmap-marker
      :key="index"
      v-for="(m, index) in markers"
      :position="m.position"
      :clickable="true"
      :draggable="true"
      @click="center=m.position"
    ></gmap-marker> -->

  </div>
</template>

<script>
export default {
  name: 'RadarMarker',
  props: () => {
    return { }
  }
}
</script>

<style scoped lang="scss">
.RadarMarker {
}
</style>
