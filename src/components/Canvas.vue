<template>
<div class="Canvas" ref="Canvas"></div>
</template>

<script>
var THREE = require('three')
var camera
var scene
var renderer
// var controls
// var controlsEnabled
var objects = []
// // var raycaster
// var instructions = document.getElementById('instructions')

export default {
  name: 'Canvas',
  props: {
  },
  mounted: function () {
    this.initializeCanvas()
    this.addObjects()
    // var geometry = new THREE.BoxGeometry(1, 1, 1)
    // var material = new THREE.MeshBasicMaterial({
    //   color: 0x00ff00
    // })
    // var cube = new THREE.Mesh(geometry, material)
    // scene.add(cube)
    //
    // camera.position.z = 5
    //
    var animate = function () {
      requestAnimationFrame(animate)

      renderer.render(scene, camera)
    }

    animate()
  },
  data: () => {
    return {
      scene
    }
  },
  computed: {
    havePointerLock: function () {
      return 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document
    }
  },
  methods: {
    initializeCanvas () {
      let ele = this.$refs.Canvas
      let width = ele.offsetWidth
      let height = window.innerHeight - 50
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
      renderer = new THREE.WebGLRenderer()

      // set a background
      scene.background = new THREE.Color(0xffffff)
      scene.fog = new THREE.Fog(0xffffff, 0, 750)

      // add some light
      let light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75)
      light.position.set(0.5, 1, 0.75)
      scene.add(light)

      // add a floor
      let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100)
      floorGeometry.rotateX(-Math.PI / 2)
      let floorMaterial = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors })
      let floor = new THREE.Mesh(floorGeometry, floorMaterial)
      scene.add(floor)

      renderer.setSize(width, height)
      ele.appendChild(renderer.domElement)
    },
    addObjects () {
      var boxGeometry = new THREE.BoxGeometry(20, 20, 20)
      for (let i = 0, l = boxGeometry.faces.length; i < l; i++) {
        var face = boxGeometry.faces[i]
        face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
        face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
        face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
      }
      for (let i = 0; i < 500; i++) {
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
    }
    // init: function () {
    //   // controls = new THREE.PointerLockControls(camera)
    //   // scene.add(controls.getObject())
    //   // raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10)
    //   // let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100)
    //   renderer.setPixelRatio(window.devicePixelRatio)
    //   renderer.setSize(window.innerWidth, window.innerHeight)
    //   document.body.appendChild(renderer.domElement)
    // },
    // animate: function () {
    //   requestAnimationFrame(this.animate)
    //   if (controlsEnabled === true) {
    //     // raycaster.ray.origin.copy(controls.getObject().position)
    //     // raycaster.ray.origin.y -= 10
    //     // var intersections = raycaster.intersectObjects(objects)
    //     // var onObject = intersections.length > 0
    //     // var time = performance.now()
    //     // var delta = ( time - prevTime ) / 1000
    //     // velocity.x -= velocity.x * 10.0 * delta
    //     // velocity.z -= velocity.z * 10.0 * delta
    //     // velocity.y -= 9.8 * 100.0 * delta // 100.0 = mass
    //     // direction.z = Number( moveForward) - Number(moveBackward)
    //     // direction.x = Number( moveLeft ) - Number( moveRight )
    //     // direction.normalize() // this ensures consistent movements in all directions
    //     // if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta
    //     // if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta
    //     // if ( onObject === true ) {
    //     // velocity.y = Math.max( 0, velocity.y )
    //     // canJump = true
    //     // }
    //     // controls.getObject().translateX( velocity.x * delta )
    //     // controls.getObject().translateY( velocity.y * delta )
    //     // controls.getObject().translateZ( velocity.z * delta )
    //     // if (controls.getObject().position.y < 10) {
    //     //   velocity.y = 0
    //     //   controls.getObject().position.y = 10
    //     //   canJump = true
    //     // }
    //     // prevTime = time
    //   }
    //   renderer.render(scene, camera)
    // },
    // setUpPointerLock () {
    //   var element = document.body
    //   var pointerlockchange = function (event) {
    //     if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
    //       controlsEnabled = true
    //       controls.enabled = true
    //       this.showBlocker = false
    //     } else {
    //       controls.enabled = false
    //       this.showBlocker = true
    //       instructions.style.display = ''
    //     }
    //   }
    //   var pointerlockerror = function (event) {
    //     instructions.style.display = ''
    //   }
    //   // Hook pointer lock state change events
    //   document.addEventListener('pointerlockchange', pointerlockchange, false)
    //   document.addEventListener('mozpointerlockchange', pointerlockchange, false)
    //   document.addEventListener('webkitpointerlockchange', pointerlockchange, false)
    //   document.addEventListener('pointerlockerror', pointerlockerror, false)
    //   document.addEventListener('mozpointerlockerror', pointerlockerror, false)
    //   document.addEventListener('webkitpointerlockerror', pointerlockerror, false)
    //   instructions.addEventListener('click', function (event) {
    //     instructions.style.display = 'none'
    //     // Ask the browser to lock the pointer
    //     element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock
    //     element.requestPointerLock()
    //   }, false)
    // }

  }
}
</script>

<style scoped lang="scss">
.Canvas {
}
</style>
