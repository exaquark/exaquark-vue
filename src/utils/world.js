// SingletonInstance
// var justOneInstance = World.getInstance()

import NeighborsSet from './neighborsSet'
import GLTF2Loader from 'three-gltf2-loader'
const THREE = require('three')
const PointerLockControls = require('three-pointerlock')

const EARTH_RADIUS = 6378137 // in meters
const LAT_FACTOR = 180 / Math.PI / EARTH_RADIUS
const CAMERA_HEIGHT = 1.5
const RELEVANCE_TOLERANCE = 3
// temp hardcode an object
GLTF2Loader(THREE)
var gltfLoader = new THREE.GLTFLoader()
var fixedObjects = [
  {
    url: '/static/gltf/eiffel_tower/scene.gltf',
    lat: 48.8584,
    lng: 2.2945,
    altitude: -5,
    gltf: null,
    object: null,
    scale: 0.001,
    type: 'GLTF'
  },
  {
    video: null,
    videoImage: null,
    videoImageContext: null,
    videoTexture: null,
    url: '/static/videos/sintel.ogv',
    // url: 'https://www.youtube.com/3acbf16a-bded-4f98-b00f-bc76687720d7',
    lat: 1.29,
    lng: 103.848,
    altitude: 60,
    type: 'SCREEN'
  }
]

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

    // for resizing the canvas
    this.resize = function (pixelRatio, width, height) {
      // this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.aspect = width / height
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
        altitude: pos.y - CAMERA_HEIGHT
      }
    }
    this.insertOrUpdateNeighbor = function (iid, state, stream, isPeerAuthority) {
      let n = this.neighborsSet.insertOrUpdateNeighbor(iid, state, stream, isPeerAuthority)
      if (!n.avatar && !this.scene.getObjectByName(iid)) {
        n.initAvatar().then(result => {
          result.name = iid
          if (!this.scene.getObjectByName(iid)) {
            this.scene.add(result)
          } else {
            console.log('already has this object', iid)
          }
        })
      }
      return n
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
        self.raycaster.ray.origin.y -= 1000
        let intersections = self.raycaster.intersectObjects(self.objects)
        let onObject = intersections.length > 0
        let time = performance.now()
        let delta = (time - self.prevTime) / 1000

        self.velocity.x -= self.velocity.x * 50.0 * delta
        self.velocity.z -= self.velocity.z * 50.0 * delta
        self.velocity.y -= 9.8 * 500.0 * delta // 100.0 = mass

        self.direction.z = Number(self.moveBackward) - Number(self.moveForward)
        self.direction.x = Number(self.moveLeft) - Number(self.moveRight)
        self.direction.normalize() // this ensures consistent movements in all directions

        if (self.moveForward || self.moveBackward) self.velocity.z += self.direction.z * 400.0 * delta
        if (self.moveLeft || self.moveRight) self.velocity.x -= self.direction.x * 400.0 * delta
        if (onObject === true) {
          self.velocity.y = Math.max(0, self.velocity.y)
          self.canJump = true
        }
        self.controls.getObject().translateX(self.velocity.x * delta)
        self.controls.getObject().translateY(self.velocity.y * delta)
        self.controls.getObject().translateZ(self.velocity.z * delta)
        if (self.controls.getObject().position.y < CAMERA_HEIGHT) {
          self.velocity.y = 0
          self.controls.getObject().position.y = CAMERA_HEIGHT
          self.canJump = true
        }
        self.prevTime = time

        // update neighbor positions
        self.neighborsSet.doForEach(n => {
          let nGeo = n.getGeo()
          if (nGeo.lat && nGeo.lng) {
            let nPos = self.latLngToVector(nGeo.lat, nGeo.lng, nGeo.altitude)
            n.updatePosition(nPos[0], nPos[1], nPos[2], nGeo.rotation)
            if (n.getRelevance() <= RELEVANCE_TOLERANCE) n.updateAnimation(delta)
          }
        })
        fixedObjects.forEach(fo => {
          if (fo.object && fo.type === 'GLTF') {
            let pos = self.latLngToVector(fo.lat, fo.lng, fo.altitude)
            fo.object.position.set(pos[0], pos[1], pos[2])
          } else if (fo.type === 'SCREEN') {
            if (fo.video.readyState === fo.video.HAVE_ENOUGH_DATA) {
              let pos = self.latLngToVector(fo.lat, fo.lng, fo.altitude)
              fo.object.position.set(pos[0], pos[1], pos[2])
              fo.videoImageContext.drawImage(fo.video, 0, 0)
              if (fo.videoTexture) fo.videoTexture.needsUpdate = true
            }
          }
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
        instance.renderer = new THREE.WebGLRenderer({antialias: true})

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

        // gltf
        fixedObjects.forEach(fo => {
          if (fo.type === 'GLTF') {
            gltfLoader.load(fo.url, gltf => {
              fo.object = gltf.scene
              fo.object.position.set(-2000, fo.altitude, -2000) // hide it for now
              fo.object.scale.set(fo.scale, fo.scale, fo.scale)
              instance.scene.add(fo.object)
              // console.log('gltf', gltf)
            })
          } else if (fo.type === 'SCREEN') {
            fo.video = document.createElement('video')
            fo.video.src = fo.url
            // fo.video.crossOrigin = 'anonymous'
            fo.video.loop = true
            fo.video.muted = true
            // fo.video.load() // must call after setting/changing source
            fo.video.play()
            fo.videoImage = document.createElement('canvas')
            fo.videoImage.width = 480
            fo.videoImage.height = 204
            fo.videoImageContext = fo.videoImage.getContext('2d')
            // background color if no video present
            fo.videoImageContext.fillStyle = '#000000'
            fo.videoImageContext.fillRect(0, 0, fo.videoImage.width, fo.videoImage.height)
            fo.videoTexture = new THREE.Texture(fo.videoImage)
            fo.videoTexture.minFilter = THREE.LinearFilter
            fo.videoTexture.magFilter = THREE.LinearFilter

            let movieMaterial = new THREE.MeshBasicMaterial({ map: fo.videoTexture, overdraw: true, side: THREE.DoubleSide })
            // the geometry on which the movie will be displayed;
            // movie image will be scaled to fit these dimensions.
            let movieGeometry = new THREE.PlaneGeometry(240, 100, 10, 10)
            let movieScreen = new THREE.Mesh(movieGeometry, movieMaterial)
            fo.object = movieScreen
            fo.object.position.set(0, fo.altitude, 0) // hide it for now
            instance.scene.add(fo.object)
          }
        })

        // start the animation
        instance.animate()
        instance.constructor = null
      }
      return instance
    }
  }
})()
export default World
