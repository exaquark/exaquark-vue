<template>
<div class="Canvas" ref="Canvas"></div>
</template>

<script>
import { mapGetters } from 'vuex'
import World from '@/utils/World'
var world = World.getInstance()

export default {
  name: 'Canvas',
  props: {
  },
  mounted: function () {
    let ele = this.$refs.Canvas
    let width = ele.offsetWidth
    let height = window.innerHeight - 52
    world.resize(window.devicePixelRatio, width, height)
    ele.appendChild(world.renderer.domElement)
    this.setUpPointerLock(ele)
  },
  data: () => {
    return {
      originLat: 0,
      originLng: 0
    }
  },
  computed: {
    ...mapGetters([
      'entityState'
    ]),
    havePointerLock: function () {
      return 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document
    }
  },
  methods: {
    setUpPointerLock (clickListener) {
      let havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document
      if (havePointerLock) {
        var element = document.body
        let pointerlockchange = event => {
          if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
            world.controlsEnabled = true
            world.controls.enabled = true
            world.hasPointerLock = true
          } else {
            world.controls.enabled = false
            world.hasPointerLock = false
          }
        }
        let pointerlockerror = event => {
          console.error(event)
        }
        // Hook pointer lock state change events
        document.addEventListener('pointerlockchange', pointerlockchange, false)
        document.addEventListener('mozpointerlockchange', pointerlockchange, false)
        document.addEventListener('webkitpointerlockchange', pointerlockchange, false)
        document.addEventListener('pointerlockerror', pointerlockerror, false)
        document.addEventListener('mozpointerlockerror', pointerlockerror, false)
        document.addEventListener('webkitpointerlockerror', pointerlockerror, false)
        clickListener.addEventListener('click', event => {
          // Ask the browser to lock the pointer
          element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock
          element.requestPointerLock()
        }, false)
      } else {
        console.log('Your browser doesn\'t seem to support Pointer Lock API')
      }
    },
    move: function (x, y, z) {
      let latLng = this.positionToLatLng(x, z)
      this.$store.commit('SET_POSITION', {
        lat: latLng.lat,
        lng: latLng.lng,
        altitude: y
      })
    }
  }
}
</script>

<style scoped lang="scss">
$screenHeightWithoutMenu: calc(100vh - 3.25rem - 2px); // height of Navbar and border
.Canvas {
  max-height: $screenHeightWithoutMenu;
  overflow: hidden;
  overflow-y: hidden;
  &::-webkit-scrollbar {
    width: 0px;  /* remove scrollbar space */
    background: transparent;  /* optional: just make scrollbar invisible */
  }
}
</style>
