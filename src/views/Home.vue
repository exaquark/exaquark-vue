<template>
<div class="Home">
  <div class="columns is-gapless">

    <div class="column is-9">
      <Radar :lat="geo.lat" :lng="geo.lng" :markers="neighbors" @onMove="onMapMove" />
    </div>

    <div class="column is-3 sidebar">
      <div class="neighbors">
        <h6 class="heading">Neighbors</h6>
        <NeighborListItem v-for="neighbor in neighbors" :key="neighbor.iid" :entityState="neighbor" />
      </div>
    </div>

  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import NeighborListItem from '@/components/NeighborListItem.vue'
import Radar from '@/components/Radar.vue'
export default {
  name: 'Home',
  components: {
    NeighborListItem,
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
  },
  methods: {
    onMapMove: function (newCenter) {
      this.geo.lat = newCenter.lat()
      this.geo.lng = newCenter.lng()
    }
  }
}
</script>

<style lang="scss">
$screenHeightWithoutMenu: calc(100vh - 3.25rem - 2px); // height of Navbar and border
.Home {
  .column {
    position: relative;
    min-height: $screenHeightWithoutMenu;
    overflow: hidden;
  }
  .neighbors {
    padding: 10px;
      height: $screenHeightWithoutMenu;
      overflow: scroll;
      overflow-y: scroll;
  }
}
</style>
