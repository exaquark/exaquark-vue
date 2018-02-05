<template>
<div class="Home">
  <div class="columns is-gapless">

    <div class="column is-9">
      <Radar :lat="geo.lat" :lng="geo.lng" />
    </div>

    <div class="column is-3">
      <div class="section">
        <div class="control is-expanded">
        
        </div>
      </div>
    </div>

  </div>
</div>
</template>

<script>
import Radar from '@/components/Radar.vue'
export default {
  name: 'Home',
  components: {
    Radar
  },
  data: () => {
    return {
      geo: {
        lat: 1.288118,
        lng: 103.847543
      }
    }
  }
}
</script>

<style lang="scss">
.Home {
  .column {
    position: relative;
    min-height: calc(100vh - 3.25rem - 2px); // height of Navbar and border
    overflow: hidden;
  }
}
</style>
