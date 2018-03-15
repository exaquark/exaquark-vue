// SingletonInstance
// var justOneInstance = World.getInstance()

import NeighborsSet from './neighborsSet'
const THREE = require('three')
const PointerLockControls = require('three-pointerlock')

const EARTH_RADIUS = 6378137 // in meters
const LAT_FACTOR = 180 / Math.PI / EARTH_RADIUS

var World = (function () {
  function World () {
    this.objects = []
    this.controlsEnabled = true
    this.moveForward = false
    this.moveLeft = false
    this.moveBackward = false
    this.moveRight = false
    this.canJump = true
    this.prevTime = performance.now()
    this.velocity = new THREE.Vector3()
    this.direction = new THREE.Vector3()
    this.hasPointerLock = false
    this.originLat = null
    this.neighborsSet = NeighborsSet

    this.resize = function (pixelRatio, width, height) {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setPixelRatio(pixelRatio)
      this.renderer.setSize(width, height)
    }
    this.setOriginLatLng = function (lat, lng) {
      this.originLat = lat
      this.lngFactor = LAT_FACTOR / Math.cos(this.originLat * Math.PI / 180)
      this.originLng = lng
    }
    this.positionToLatLng = function (x, z) {
      return {
        lat: (this.originLat + z * LAT_FACTOR),
        lng: (this.originLng + this.lngFactor * x + 180) % 360 - 180
      }
    }
    this.latLngToVector = function (lat, lng, altitude = 0) {
      let x = (lng - this.originLng) / this.lngFactor
      let z = (lat - this.originLat) / LAT_FACTOR
      return [x, altitude, z]
    }
    // converts the current vector position into Lat/Lng
    this.getPositionAsGeo = function () {
      let pos = this.controls.getObject().position
      let latLng = this.positionToLatLng(pos.x, pos.z)
      return {
        lat: latLng.lat,
        lng: latLng.lng,
        altitude: pos.y
      }
    }
    this.insertOrUpdateNeighbor = function (iid, state) {
      let n = this.neighborsSet.insertOrUpdateNeighbor(iid, state)
      if (!n.avatar) {
        n.initAvatar().then(result => {
          this.scene.add(result)
        })
      }
    }
    this.removeNeighbor = function (iid) {
      let n = this.neighborsSet.removeNeighbor(iid)
      if (n && n.avatar) {
        this.scene.remove(n.avatar)
      }
    }
    this.changeUniverse = function (universe) {
      if (universe === 'SANDBOX_BLACK') {
        this.scene.background = new THREE.Color(0x000000)
        this.scene.fog = new THREE.Fog(0x000000, 0, 750)
      } else {
        this.scene.background = new THREE.Color(0xffffff)
        this.scene.fog = new THREE.Fog(0xffffff, 0, 750)
      }
    }

    let self = this
    this.animate = function () {
      requestAnimationFrame(self.animate)
      if (self.controlsEnabled === true) {
        self.raycaster.ray.origin.copy(self.controls.getObject().position)
        self.raycaster.ray.origin.y -= 10
        let intersections = self.raycaster.intersectObjects(self.objects)
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
        self.controls.getObject().translateX(self.velocity.x * delta)
        self.controls.getObject().translateY(self.velocity.y * delta)
        self.controls.getObject().translateZ(self.velocity.z * delta)
        if (self.controls.getObject().position.y < 10) {
          self.velocity.y = 0
          self.controls.getObject().position.y = 10
          self.canJump = true
        }
        self.prevTime = time

        // update neighbor positions
        self.neighborsSet.doForEach(n => {
          let nGeo = n.getGeo()
          // console.log('nGeo', nGeo)
          if (nGeo.lat && nGeo.lng) {
            let nPos = self.latLngToVector(nGeo.lat, nGeo.lng, nGeo.altitude)
            n.updatePosition(nPos[0], nPos[1], nPos[2], nGeo.rotation)
            n.updateAnimation(delta)
          }

          // console.log('geo', nGeo)
          // n.updatePosition()
        })
      }
      self.renderer.render(self.scene, self.camera)
    }
  }

  // create or return a singleton instance
  var instance = null
  return {
    getInstance: () => {
      if (instance === null) {
        instance = new World()

        instance.scene = new THREE.Scene()
        instance.camera = new THREE.PerspectiveCamera(75, 1, 1, 1000)
        instance.raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10)
        instance.renderer = new THREE.WebGLRenderer()

        // set a background
        instance.scene.background = new THREE.Color(0xffffff)
        instance.scene.fog = new THREE.Fog(0xffffff, 0, 750)

        // add some light
        let light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75)
        light.position.set(0.5, 1, 0.75)
        instance.scene.add(light)

        // create a floor
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
        instance.scene.add(floor)
        // add controls
        instance.controls = new PointerLockControls(instance.camera)
        instance.scene.add(instance.controls.getObject())

        // start the animation
        instance.animate()
        instance.constructor = null
      }
      return instance
    }
  }
})()
export default World
