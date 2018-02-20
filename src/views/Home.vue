<template>
<div class="Home">
  <div class="columns is-gapless">

    <div class="column is-9">
      <Radar v-if="entityState.geo.lat && entityState.geo.lng"
        :lat="entityState.geo.lat"
        :lng="entityState.geo.lng"
        :customAvatar="customAvatar"
        :markers="neighbors"
      />
    </div>

    <div class="column is-3 sidebar">
      <div class="neighbors">
        <h6 class="heading">Neighbors</h6>
        <NeighborListItem v-for="neighbor in neighbors" :key="neighbor.iid" :neighborState="neighbor" />
      </div>
    </div>

  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import ExaQuarkJs from 'exaquark-js/core'
import NeighborListItem from '@/components/NeighborListItem.vue'
import Radar from '@/components/Radar.vue'
import key from 'keymaster'
import { getFinalLatLon } from '@/utils/geometry'
var exaQuark = null

const MOVE_DISTANCE = 0.5
const ANGLES = {
  right: 0,
  up: 90,
  left: 180,
  down: 270,
  upRight: 45
}

var Home = {
  name: 'Home',
  components: {
    NeighborListItem,
    Radar
  },
  created: function () {
    const exaQuarkUrl = 'https://enter.exaquark.com'

    var apiKey = 'YOUR_API_KEY' // required
    let options = {
      entityId: 'ENTITY_ID', // required
      universe: 'UNIVERSE_ID', // optional: defaults to sandbox
      transport: 'WebSocket' // optional: WebSocket | UDP
      // logger: (msg, data) => { console.log(msg, data) } // optional: attach your own logger
    }

    exaQuark = new ExaQuarkJs(exaQuarkUrl, apiKey, options)
    exaQuark.on('neighbor:enter', entityState => {
      this.$store.commit('SET_NEIGHBOUR_LIST', exaQuark.neighbors('Array'))
    })
    exaQuark.on('neighbor:leave', entityState => {
      this.$store.commit('SET_NEIGHBOUR_LIST', exaQuark.neighbors('Array'))
    })
    exaQuark.on('neighbor:updates', entityState => {
      // if (entityState.properties.displayName) console.log('entityState.properties.displayName', entityState.properties.displayName)
      this.$store.commit('SET_NEIGHBOUR_LIST', exaQuark.neighbors('Array'))
    })

    exaQuark.connect(this.entityState).then(({ iid }) => {
      this.$store.commit('SET_IID', iid)
      exaQuark.push('ask:neighbours')
    }).catch('err', err => { console.error(err) })
    exaQuark.bind(this.getState)

    this.startEventLoop()
  },
  computed: {
    ...mapGetters([
      'addressGeo',
      'customAvatar',
      'entityState',
      'neighbors'
    ])
  },
  data: () => {
    return {}
  },
  methods: {
    getState: function () {
      if (this.entityState.properties.displayName) console.log('this.displayName', this.entityState.properties.displayName)
      return this.entityState
    },
    startEventLoop: function () {
      setInterval(() => {
        if (key.isPressed('up') || key.isPressed('w')) {
          let latLng = getFinalLatLon(this.entityState.geo.lat, this.entityState.geo.lng, MOVE_DISTANCE, ANGLES.up)
          this.move(latLng[0], latLng[1])
        }
        if (key.isPressed('down') || key.isPressed('s')) {
          let latLng = getFinalLatLon(this.entityState.geo.lat, this.entityState.geo.lng, MOVE_DISTANCE, ANGLES.down)
          this.move(latLng[0], latLng[1])
        }
        if (key.isPressed('left') || key.isPressed('a')) {
          let latLng = getFinalLatLon(this.entityState.geo.lat, this.entityState.geo.lng, MOVE_DISTANCE, ANGLES.left)
          this.move(latLng[0], latLng[1])
        }
        if (key.isPressed('right') || key.isPressed('d')) {
          let latLng = getFinalLatLon(this.entityState.geo.lat, this.entityState.geo.lng, MOVE_DISTANCE, ANGLES.right)
          this.move(latLng[0], latLng[1])
        }
      }, 50)
    },
    move: function (lat, lng) {
      this.$store.commit('SET_POSITION', {
        lat: lat,
        lng: lng
      })
    }
  }
}
export default Home
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
