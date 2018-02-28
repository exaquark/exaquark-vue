<template>
<div class="Canvas" ref="Canvas"></div>
</template>

<script>
import { mapGetters } from 'vuex'
const THREE = require('three')
const PointerLockControls = require('three-pointerlock')
var camera
var scene
var renderer
var controls
var objects = []
var raycaster

const SAVE_FREQUENCY = 250 // every 5 seconds?
var savedCallCounter = SAVE_FREQUENCY

const EARTH_RADIUS = 6378137 // in meters
const LAT_FACTOR = 180 / Math.PI / EARTH_RADIUS

// neighbors
var neighborGeometry = new THREE.SphereGeometry(5, 32, 32)
var neighborMaterial = new THREE.MeshBasicMaterial({color: 0x000000})
var neighbor = new THREE.Mesh(neighborGeometry, neighborMaterial)
neighbor.position.x = Math.floor(Math.random() * 20 - 10) * 20
neighbor.position.y = 10
neighbor.position.z = Math.floor(Math.random() * 20 - 10) * 20

export default {
  name: 'Canvas',
  props: {
  },
  mounted: function () {
    let ele = this.$refs.Canvas
    this.initializeCanvas(ele)
    this.addFloor()
    // this.addObjects()

    this.addControls()
    this.setUpPointerLock(ele)

    scene.add(neighbor)
    objects.push(neighbor)

    let self = this
    var animate = function () {
      requestAnimationFrame(animate)
      if (self.controlsEnabled === true) {
        raycaster.ray.origin.copy(controls.getObject().position)
        // console.log('controls.getObject().position', controls.getObject().position)
        raycaster.ray.origin.y -= 10
        let intersections = raycaster.intersectObjects(objects)
        let onObject = intersections.length > 0
        let time = performance.now()
        let delta = (time - self.prevTime) / 1000

        self.velocity.x -= self.velocity.x * 10.0 * delta
        self.velocity.z -= self.velocity.z * 10.0 * delta
        self.velocity.y -= 9.8 * 100.0 * delta // 100.0 = mass

        self.direction.z = Number(self.moveForward) - Number(self.moveBackward)
        self.direction.x = Number(self.moveLeft) - Number(self.moveRight)
        self.direction.normalize() // this ensures consistent movements in all directions

        if (self.moveForward || self.moveBackward) self.velocity.z -= self.direction.z * 400.0 * delta
        if (self.moveLeft || self.moveRight) self.velocity.x -= self.direction.x * 400.0 * delta
        if (onObject === true) {
          self.velocity.y = Math.max(0, self.velocity.y)
          self.canJump = true
        }
        controls.getObject().translateX(self.velocity.x * delta)
        controls.getObject().translateY(self.velocity.y * delta)
        controls.getObject().translateZ(self.velocity.z * delta)
        if (controls.getObject().position.y < 10) {
          self.velocity.y = 0
          controls.getObject().position.y = 10
          self.canJump = true
        }
        self.prevTime = time

        let pos = controls.getObject().position
        self.move(pos.x, pos.y, pos.z)
        self.saveStateToLocalStorage()
        // console.log('this.ent', self.neighbors[0])

        let firstNeighbor = self.neighbors[0]
        if (firstNeighbor) {
          let nPos = firstNeighbor.geo
          let xyz = self.latLngToVector(nPos.lat, nPos.lng)
          neighbor.position.x = xyz[0]
          neighbor.position.y = 10
          neighbor.position.z = xyz[2]
        }
      }
      renderer.render(scene, camera)
    }

    animate()
  },
  data: () => {
    return {
      controlsEnabled: true,
      moveForward: false,
      moveLeft: false,
      moveBackward: false,
      moveRight: false,
      canJump: true,
      prevTime: performance.now(),
      velocity: new THREE.Vector3(),
      direction: new THREE.Vector3(),
      hasPointerLock: false,
      originLat: 0,
      originLng: 0
    }
  },
  computed: {
    ...mapGetters([
      'entityState',
      'neighbors'
    ]),
    havePointerLock: function () {
      return 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document
    }
  },
  methods: {
    initializeCanvas (ele) {
      let width = ele.offsetWidth
      let height = window.innerHeight - 52
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000)
      raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10)
      renderer = new THREE.WebGLRenderer()

      // set a background
      scene.background = new THREE.Color(0xffffff)
      scene.fog = new THREE.Fog(0xffffff, 0, 750)

      // add some light
      let light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75)
      light.position.set(0.5, 1, 0.75)
      scene.add(light)

      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(width, height)
      ele.appendChild(renderer.domElement)
    },
    addFloor () {
      var floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100)
      floorGeometry.rotateX(-Math.PI / 2)
      for (let i = 0, l = floorGeometry.vertices.length; i < l; i++) {
        var vertex = floorGeometry.vertices[i]
        vertex.x += Math.random() * 20 - 10
        vertex.y += Math.random() * 2
        vertex.z += Math.random() * 20 - 10
      }
      for (let i = 0, l = floorGeometry.faces.length; i < l; i++) {
        var face = floorGeometry.faces[i]
        face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
        face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
        face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
      }
      var floorMaterial = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors
      })
      var floor = new THREE.Mesh(floorGeometry, floorMaterial)
      scene.add(floor)
    },
    addObjects () {
      var boxGeometry = new THREE.BoxGeometry(20, 20, 20)
      for (let i = 0, l = boxGeometry.faces.length; i < l; i++) {
        var face = boxGeometry.faces[i]
        face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
        face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
        face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
      }
      for (let i = 0; i < 20; i++) {
        var boxMaterial = new THREE.MeshPhongMaterial({
          specular: 0xffffff,
          flatShading: true,
          vertexColors: THREE.VertexColors
        })
        boxMaterial.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
        var box = new THREE.Mesh(boxGeometry, boxMaterial)
        box.position.x = Math.floor(Math.random() * 20 - 10) * 20
        box.position.y = Math.floor(Math.random() * 20) * 20 + 10
        box.position.z = Math.floor(Math.random() * 20 - 10) * 20
        scene.add(box)
        objects.push(box)
      }
    },
    addControls () {
      controls = new PointerLockControls(camera)
      this.setOriginLatLng(this.entityState.geo.lat, this.entityState.geo.lng)
      // let pos = {
      //   x: this.entityState.geo.lat,
      //   y: this.entityState.geo.altitude,
      //   z: this.entityState.geo.lng
      // }
      // controls.getObject().position.set(pos.x, pos.y, pos.z)
      // console.log('controls.getObject().position', controls.getObject().position)
      scene.add(controls.getObject())
      var onKeyDown = event => {
        switch (event.keyCode) {
          case 38: // up
          case 87: // w
            this.moveForward = true
            break
          case 37: // left
          case 65: // a
            this.moveLeft = true
            break
          case 40: // down
          case 83: // s
            this.moveBackward = true
            break
          case 39: // right
          case 68: // d
            this.moveRight = true
            break
          case 32: // space
            if (this.canJump === true) this.velocity.y += 350
            this.canJump = false
            break
        }
      }
      var onKeyUp = event => {
        switch (event.keyCode) {
          case 38: // up
          case 87: // w
            this.moveForward = false
            break
          case 37: // left
          case 65: // a
            this.moveLeft = false
            break
          case 40: // down
          case 83: // s
            this.moveBackward = false
            break
          case 39: // right
          case 68: // d
            this.moveRight = false
            break
        }
      }
      document.addEventListener('keydown', onKeyDown, false)
      document.addEventListener('keyup', onKeyUp, false)
    },
    setUpPointerLock (clickListener) {
      let havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document
      if (havePointerLock) {
        var element = document.body
        let self = this
        let pointerlockchange = event => {
          if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
            self.controlsEnabled = true
            controls.enabled = true
            self.hasPointerLock = true
          } else {
            controls.enabled = false
            self.hasPointerLock = false
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
    saveStateToLocalStorage: function () {
      savedCallCounter--
      if (savedCallCounter <= 1) {
        savedCallCounter = SAVE_FREQUENCY
        if (localStorage) localStorage.setItem('chatmapEntityState', JSON.stringify(this.entityState))
      }
    },
    move: function (x, y, z) {
      let latLng = this.positionToLatLng(x, z)
      this.$store.commit('SET_POSITION', {
        lat: latLng.lat,
        lng: latLng.lng,
        altitude: y
      })
    },
    setOriginLatLng: function (lat, lng) {
      this.originLat = lat
      this.lngFactor = LAT_FACTOR / Math.cos(this.originLat * Math.PI / 180)
      this.originLng = lng
    },
    positionToLatLng (x, z) {
      return {
        lat: (this.originLat + z * LAT_FACTOR),
        lng: (this.originLng + this.lngFactor * x + 180) % 360 - 180
      }
    },
    latLngToVector (lat, lng, altitude = 0) {
      let x = (lng - this.originLng) / this.lngFactor
      let z = (lat - this.originLat) / LAT_FACTOR
      return [x, altitude, z]
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
