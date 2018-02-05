<template>
<div class="Home">
  <div class="columns is-gapless">

    <div class="column is-9">
      <Radar :lat="geo.lat" :lng="geo.lng" />
    </div>

    <div class="column is-3">
      <div class="section">
        <div class="" v-for="(neighbor) in neighbors" :key="neighbor.iid">
          {{neighbor.iid}}
        </div>
      </div>
    </div>

  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Radar from '@/components/Radar.vue'
export default {
  name: 'Home',
  components: {
    Radar
  },
  computed: {
    ...mapGetters([
      'neighbors'
    ])
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
