<template>
  <div class="RadarMarker">

    <gmap-marker
      :key="entityState.iid"
      :position="position"
      :clickable="true"
      :draggable="false"
      :icon="defaultIconOptions"
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
  data: () => {
    return {
      defaultIconOptions: {
        url: 'https://media.giphy.com/media/r8AKGSaw7qRRS/giphy.gif',
        scaledSize: {width: 50, height: 50, f: 'px', b: 'px'},
        rotation: 45
      }
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
