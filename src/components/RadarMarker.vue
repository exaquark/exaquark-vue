<template>
  <div class="RadarMarker">

    <gmap-marker
      :key="entityState.iid"
      :position="position"
      :clickable="true"
      :draggable="false"
    />

  </div>
</template>

<script>
export default {
  name: 'RadarMarker',
  props: {
    entityState: {
      type: Object,
      required: true
    }
  },
  computed: {
    position: function () {
      return this.entityState.geo
    }
  }
}
</script>

<style scoped lang="scss">
.RadarMarker {
}
</style>
