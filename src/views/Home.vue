<template>
<div class="Home">
  <Nav @onAudioClicked="toggleAudio()" @onMicClicked="toggleMic()" @onVideoClicked="toggleVideo()" />
  <audio src="" max="1" high="0.25" ref="AudioElement"></audio>
  <div class="columns is-gapless">

    <div class="column is-9">
      <Canvas />
    </div>

    <div class="column is-3 sidebar">
      <div class="radarContainer">
        <Radar v-if="entityState.geo.lat && entityState.geo.lng"
          :lat="entityState.geo.lat"
          :lng="entityState.geo.lng"
          :customAvatar="customAvatar"
          :markers="neighbors"
        />
      </div>
      <div class="video" v-show="video">
        <video src="" autoplay poster="" ref="VideoElement"></video>
      </div>
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
import Canvas from '@/components/Canvas.vue'
import ExaQuarkJs from 'exaquark-js/core'
import ExaQuarkMedia from '@/utils/browserMedia'
import Nav from '@/components/Nav.vue'
import NeighborListItem from '@/components/NeighborListItem.vue'
import Radar from '@/components/Radar.vue'
import World from '@/utils/world'
var world = World.getInstance()
var exaQuark = null
var media = null

var Home = {
  name: 'Home',
  components: {
    Canvas,
    Nav,
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
      world.insertOrUpdateNeighbor(entityState.iid, entityState)
      this.$store.commit('SET_NEIGHBOUR_LIST', exaQuark.neighbors())
    })
    exaQuark.on('neighbor:leave', iid => {
      world.removeNeighbor(iid)
      this.$store.commit('SET_NEIGHBOUR_LIST', exaQuark.neighbors())
    })
    exaQuark.on('neighbor:updates', entityState => {
      world.insertOrUpdateNeighbor(entityState.iid, entityState)
      this.$store.commit('SET_NEIGHBOUR_LIST', exaQuark.neighbors())
      console.log('exaQuark', exaQuark.sendBroadcastSignal({test: 'hello'}))
    })

    exaQuark.connect(this.entityState).then(({ iid }) => {
      this.$store.commit('SET_IID', iid)
      exaQuark.push('ask:neighbours')
    }).catch('err', err => { console.error(err) })
    exaQuark.bind(this.getState)
  },
  mounted: function () {
    this.addControls()
    world.setOriginLatLng(this.entityState.geo.lat, this.entityState.geo.lng)
    this.startEventLoop()
    media = new ExaQuarkMedia()
  },
  computed: {
    ...mapGetters([
      'addressGeo',
      'customAvatar',
      'entityState',
      'mic',
      'neighbors',
      'universe',
      'video'
    ])
  },
  data: () => {
    return {}
  },
  watch: {
    universe: function () {
      world.changeUniverse(this.universe)
    }
  },
  methods: {
    getState: function () {
      return this.entityState
    },
    startEventLoop: function () {
      setInterval(() => {
        this.$store.commit('SET_POSITION', world.getPositionAsGeo())
        this.saveStateToLocalStorage()
      }, 50)
    },
    addControls () {
      var onKeyDown = event => {
        switch (event.keyCode) {
          case 38: // up
          case 87: // w
            world.moveForward = true
            break
          case 37: // left
          case 65: // a
            world.moveLeft = true
            break
          case 40: // down
          case 83: // s
            world.moveBackward = true
            break
          case 39: // right
          case 68: // d
            world.moveRight = true
            break
          case 32: // space
            if (world.canJump === true) world.velocity.y += 350
            world.canJump = false
            break
        }
      }
      var onKeyUp = event => {
        switch (event.keyCode) {
          case 38: // up
          case 87: // w
            world.moveForward = false
            break
          case 37: // left
          case 65: // a
            world.moveLeft = false
            break
          case 40: // down
          case 83: // s
            world.moveBackward = false
            break
          case 39: // right
          case 68: // d
            world.moveRight = false
            break
        }
      }
      document.addEventListener('keydown', onKeyDown, false)
      document.addEventListener('keyup', onKeyUp, false)
    },
    saveStateToLocalStorage: function () {
      if (localStorage) localStorage.setItem('chatmapEntityState', JSON.stringify(this.entityState))
    },
    toggleAudio: function () {
      this.$store.commit('TOGGLE_SOUND')
    },
    toggleMic: async function () {
      if (!this.mic) {
        if (!this.media) {
          media.initAudio(this.$refs.AudioElement).then((response, reject) => {
            console.log('response', response)
            console.log('response', response)
            console.log('this.media', media)
          })
        }
      } else {
        media.stopAudio()
      }
      this.$store.commit('TOGGLE_MIC')
    },
    toggleVideo: async function () {
      if (!this.video) {
        if (!this.media) {
          media.initVideo(this.$refs.VideoElement)
        }
      } else {
        console.log('stopping')
        media.stopVideo()
      }
      this.$store.commit('TOGGLE_VIDEO')
    }
  }
}
export default Home
</script>
<style lang="scss" scoped>
$screenHeightWithoutMenu: calc(100vh - 3.25rem - 2px); // height of Navbar and border
.Home {
  .column {
    position: relative;
    min-height: $screenHeightWithoutMenu;
    overflow: hidden;
  }
  .radarContainer {
    height: 200px;
  }
  .neighbors {
    padding: 10px;
    height: calc($screenHeightWithoutMenu - 200px);
    overflow: scroll;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 0px;  /* remove scrollbar space */
      background: transparent;  /* optional: just make scrollbar invisible */
    }
  }
}
</style>
