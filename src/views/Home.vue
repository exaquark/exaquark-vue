<template>
<div class="Home">
  <Nav @onSoundClicked="toggleAudio()" @onMicClicked="toggleMic()" @onVideoClicked="toggleVideo()" />
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
        <video src="" autoplay poster="" ref="VideoElement" muted="muted">
          Your browser does not support the video tag.
        </video>
      </div>
      <div class="neighbors">
        <h6 class="heading">Neighbors</h6>
        <NeighborListItem v-for="neighbor in humanNeighbors" :key="neighbor.iid" :neighborState="neighbor.state" />
        <audio src="#" v-for="neighbor in humanNeighbors" autoplay :key="'audio' + neighbor.iid" v-bind:ref="neighbor.iid">
          Your browser does not support the audio tag.
        </audio>
      </div>
    </div>

  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Canvas from '@/components/Canvas.vue'
import ExaQuarkJs from 'exaquark-js/core'
// import ExaQuarkMedia from '@/utils/browserMedia'
import Nav from '@/components/Nav.vue'
import NeighborListItem from '@/components/NeighborListItem.vue'
import Radar from '@/components/Radar.vue'
import World from '@/utils/world'
var world = World.getInstance()
var exaQuark = null
// var media = null

var Home = {
  name: 'Home',
  components: {
    Canvas,
    Nav,
    NeighborListItem,
    Radar
  },
  created: function () {
    const exaQuarkUrl = 'https://enteralpha.exaquark.com'

    var apiKey = 'YOUR_API_KEY' // required
    let options = {
      entityId: 'ENTITY_ID', // required
      universe: 'UNIVERSE_ID', // optional: defaults to sandbox
      transport: 'WebSocket' // optional: WebSocket | UDP
      // logger: (msg, data) => { console.log(msg, data) } // optional: attach your own logger
    }

    exaQuark = new ExaQuarkJs(exaQuarkUrl, apiKey, options)
    exaQuark.on('neighbor:enter', neighborState => {
      if (neighborState.iid === this.iid) console.log('self?', neighborState.iid === this.iid)
      if (neighborState.properties && neighborState.properties.entityType === 'HUMAN') {
        console.log('adding neighbor', neighborState.iid)
        let isPeerAuthority = neighborState.iid > this.iid
        world.insertOrUpdateNeighbor(neighborState.iid, neighborState, this.stream, isPeerAuthority)
      }
    })
    exaQuark.on('neighbor:leave', iid => {
      world.removeNeighbor(iid)
    })
    exaQuark.on('neighbor:updates', neighborState => {
      let self = this
      if (neighborState.properties && neighborState.properties.entityType === 'HUMAN') {
        let isPeerAuthority = neighborState.iid > this.iid
        let neighbor = world.insertOrUpdateNeighbor(neighborState.iid, neighborState, this.stream, isPeerAuthority)
        if (neighbor.hasQueuedSignals()) neighbor.sendQueuedSignals(exaQuark)

        let audioElement = (self.$refs[neighborState.iid]) ? self.$refs[neighborState.iid][0] : false
        let stream = neighbor.getStream()
        if (stream !== null && audioElement && !audioElement.srcObject) {
          audioElement.srcObject = stream
          audioElement.play()
        }
      }
    })

    exaQuark.on('signal', payload => {
      let peer = world.neighborsSet.set[payload.source]
      console.log('receiving signal from ', payload.source)
      if (peer && payload.signal.type === '_webrtc') {
        peer.receiveSignal(payload.signal.data)
      }
    })

    exaQuark.connect(this.entityState).then(({ iid }) => {
      console.log('iid', iid)
      this.$store.commit('SET_IID', iid)
      exaQuark.push('ask:neighbours')
    }).catch('err', err => { console.error(err) })
    exaQuark.bind(this.getState)
  },
  mounted: function () {
    this.addControls()
    world.setOriginLatLng(this.entityState.geo.lat, this.entityState.geo.lng)
    this.startEventLoop()
  },
  computed: {
    ...mapGetters([
      'addressGeo',
      'customAvatar',
      'iid',
      'entityState',
      'mic',
      // 'neighbors',
      'sound',
      'universe',
      'video'
    ]),
    humanNeighbors: function () {
      // console.log('this.neighbors', this.neighbors)
      return this.neighbors.filter(n => n.state.properties && n.state.properties.entityType === 'HUMAN')
    }
  },
  data: () => {
    return {
      stream: null,
      neighbors: [],
      videoDevice: null
    }
  },
  watch: {
    universe: function () {
      world.changeUniverse(this.universe)
    }
  },
  methods: {
    getState: function () {
      this.neighbors = world.neighborsSet.asArray(1) // called every 2 seconds
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
      let self = this
      self.$store.commit('TOGGLE_SOUND')
    },
    toggleMic: async function (device) {
      this.$store.commit('TOGGLE_MIC')
      this.videoDevice = device ? device.deviceId : null
      this.stopAllTracks()
      let self = this
      navigator.getUserMedia({
        video: false,
        audio: {deviceId: this.audioDevice ? {exact: this.audioDevice} : undefined}
      }, stream => {
        console.log('stream.id', stream.id)
        self.videoElement = self.$refs.VideoElement
        self.stream = stream
        self.videoElement.srcObject = stream
        self.$store.commit('SET_STREAM_ID', stream.id)
        this.$store.commit('TOGGLE_MIC')
        world.neighborsSet.doForEach(neighbor => {
          let isInitiator = true
          neighbor.initPeerConnection(self.stream, isInitiator)
        })
      }, err => {
        console.log('err', err)
      })
    },
    stopAllTracks: function () {
      if (!this.stream) return
      this.stream.getTracks().forEach(track => {
        track.enabled = false
        track.stop()
      })
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
