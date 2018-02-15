<template>
<div class="Home">
  <div class="columns is-gapless">

    <div class="column is-9">
      <Radar :lat="entityState.geo.lat" :lng="entityState.geo.lng" :markers="neighbors" @onMove="onMapMove" />
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
import { mapGetters, mapActions } from 'vuex'
import ExaQuarkJs from 'exaquark-js'
import NeighborListItem from '@/components/NeighborListItem.vue'
import Radar from '@/components/Radar.vue'
import key from 'keymaster'
var exaQuark = null

const MOVE_DISTANCE = 100
const ANGLES = {
  right: 0,
  up: 90,
  left: 180,
  down: 270
}

var Home = {
  name: 'Home',
  components: {
    NeighborListItem,
    Radar
  },
  created: function () {
    const exaquarkUrl = 'http://163.172.171.14:9999' // https://enter.exaquark.net

    var apiKey = 'YOUR_API_KEY' // required
    let options = {
      entityId: 'ENTITY_ID', // required
      universe: 'UNIVERSE_ID', // optional: defaults to sandbox
      transport: 'WebSocket' // optional: WebSocket | UDP
      // logger: (msg, data) => { console.log(msg, data) } // optional: attach your own logger
    }

    exaQuark = new ExaQuarkJs(exaquarkUrl, apiKey, options)
    exaQuark.on('neighbor:enter', entityState => {
      // console.log('neighbor:enter', entityState)
      this.$store.commit('SET_NEIGHBOUR_LIST', exaQuark.neighbors('Array'))
    })
    exaQuark.on('neighbor:leave', entityState => {
      // console.log('neighbor:leave', entityState)
      this.$store.commit('SET_NEIGHBOUR_LIST', exaQuark.neighbors('Array'))
    })
    exaQuark.on('neighbor:updates', entityState => {
      // console.log('neighbor:updates', exaQuark.neighbors())
      this.$store.commit('SET_NEIGHBOUR_LIST', exaQuark.neighbors('Array'))
    })

    exaQuark.connect(this.entityState).then(({ iid }) => {
      this.iid = iid
      exaQuark.push('ask:neighbours')
    }).catch('err', err => { console.error(err) })
    exaQuark.bind(this.getState)

    key('up, w', () => {
      let latLng = this.getFinalLatLon(this.entityState.geo.lat, this.entityState.geo.lng, MOVE_DISTANCE, ANGLES.up)
      this.move(latLng[0], latLng[1])
    })
    key('down, s', () => {
      let latLng = this.getFinalLatLon(this.entityState.geo.lat, this.entityState.geo.lng, MOVE_DISTANCE, ANGLES.down)
      this.move(latLng[0], latLng[1])
    })
    key('left, a', () => {
      let latLng = this.getFinalLatLon(this.entityState.geo.lat, this.entityState.geo.lng, MOVE_DISTANCE, ANGLES.left)
      this.move(latLng[0], latLng[1])
    })
    key('right, d', () => {
      let latLng = this.getFinalLatLon(this.entityState.geo.lat, this.entityState.geo.lng, MOVE_DISTANCE, ANGLES.right)
      this.move(latLng[0], latLng[1])
    })
  },
  computed: {
    ...mapGetters([
      'neighbors',
      'addressGeo'
    ])
  },
  data: () => {
    return {
      iid: null,
      entityState: {
        entityId: 'MOCK_ENTITY_ID', // {string} required: their entityId
        universe: 'MOCK_UNIVERSE_ID', // {string} required:  which universe is the entitiy in
        delaunay: 1, // {number} 1 - 5 - delaunay is the "distance" of your neighbor. It isn't required when sending to exaQuark, however you will receive it in notifications about your neighbors
        geo: {
          lat: 1.2883, // {double} required: latitude
          lng: 103.8475, // {double} required: longitude
          altitude: 0, // {double} optional: altitude in meters - can be negative
          rotation: [ 2, 5, 19 ] // {Array of doubles} optional: all in degrees. Default facing north
        },
        properties: {
          avatarId: 'MOCK_AVATAR_ID', // {string} required: the avatar your user has selected
          sound: true, // {boolean} optional: defaults to true. false === mute
          mic: true, // {boolean} optional: defaults to true. false === muted microphone
          virtualPosition: false, // {boolean} optional: defaults to false. Is this person physically in the position that they are in the digital universe. (true === they are not physically present there)
          entityType: 'HUMAN' // {string} optional: defaults to 'human'. Options: 'HUMAN' | 'BOT' | 'DRONE'
        },
        universeState: {
          // developer defined state for their universe
          // you can use this to pass arbitrary data to other entities in your neighborhood
        }
      }
    }
  },
  watch: {
    addressGeo: function () {
      this.entityState.geo.lat = this.addressGeo.lat
      this.entityState.geo.lng = this.addressGeo.lng
    }
  },
  methods: {
    ...mapActions([
      'updateNeighbors'
    ]),
    getState: function () {
      return this.entityState
    },
    onMapMove: function (newCenter) {
      this.entityState.geo.lat = newCenter.lat()
      this.entityState.geo.lng = newCenter.lng()
    },
    move: function (lat, lng) {
      this.entityState.geo.lat = lat
      this.entityState.geo.lng = lng
    },
    getFinalLatLon: function (lat1, lon1, distance, angle) {
      let deg2rad = (deg) => {
        return deg * (Math.PI / 180)
      }
      // dy = R*sin(theta)
      let dy = distance * Math.sin(deg2rad(angle))
      let deltaLatitude = dy / 110574
      // One degree of latitude on the Earth's surface equals (110574 meters
      deltaLatitude = parseFloat(deltaLatitude.toFixed(6))

      // final latitude = start_latitude + delta_latitude
      let lat2 = lat1 + deltaLatitude

      // dx = R*cos(theta)
      let dx = distance * Math.cos(deg2rad(angle))
      // One degree of longitude equals 111321 meters (at the equator)
      let deltaLongitude = dx / (111321 * Math.cos(deg2rad(lat1)))
      deltaLongitude = parseFloat(deltaLongitude.toFixed(6))

      // final longitude = start_longitude + deltaLongitude
      let lon2 = lon1 + deltaLongitude

      return [lat2, lon2]
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
