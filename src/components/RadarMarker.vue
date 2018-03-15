<template>
  <div class="RadarMarker">

    <gmap-marker
      :key="neighborState.iid"
      :position="position"
      :clickable="true"
      :draggable="false"
      :icon="defaultIconOptions"
    />

  </div>
</template>

<script>
const DEFAULT_AVATAR = process.env.AVATARS.NEIGHBORS // /config/prod.env.js
const DEFAULT_BOT_AVATAR = '/static/images/051ab4711df54275e98341d84ac68ed6.gif'
export default {
  name: 'RadarMarker',
  props: {
    neighborState: {
      type: Object,
      required: true
    }
  },
  data: () => {
    return {
    }
  },
  computed: {
    position: function () {
      return this.neighborState.geo
    },
    avatarUrl: function () {
      let url = (this.neighborState.customState && this.neighborState.customState.avatarUrl) ? this.neighborState.customState.avatarUrl : DEFAULT_AVATAR
      return url
    },
    defaultIconOptions: function () {
      let url = (this.neighborState.customState && this.neighborState.customState.avatarUrl) ? this.neighborState.customState.avatarUrl : DEFAULT_AVATAR
      if (this.neighborState.properties && this.neighborState.properties.entityType === 'BOT') url = DEFAULT_BOT_AVATAR
      return {
        url: url,
        scaledSize: {width: 30, height: 30, f: 'px', b: 'px'}
      }
    }
  }
}
</script>

<style scoped lang="scss">
.RadarMarker {
}
</style>
