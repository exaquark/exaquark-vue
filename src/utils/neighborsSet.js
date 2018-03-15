import GLTF2Loader from 'three-gltf2-loader'
const THREE = require('three')
GLTF2Loader(THREE)
var loader = new THREE.GLTFLoader()

// neighbors
// var avatarGeometry = new THREE.SphereGeometry(5, 32, 32)
// var avatarMaterial = new THREE.MeshBasicMaterial({color: 0x000000})

var avatarGeometry = new THREE.BoxGeometry(20, 20, 20)
for (let i = 0, l = avatarGeometry.faces.length; i < l; i++) {
  var face = avatarGeometry.faces[i]
  face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
  face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
  face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
}
var avatarMaterial = new THREE.MeshPhongMaterial({
  specular: 0xffffff,
  flatShading: true,
  vertexColors: THREE.VertexColors
})
avatarMaterial.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
// var box = new THREE.Mesh(avatarGeometry, avatarMaterial)

var NeighborsSet = {
  set: {},
  nbNbors: function () {
    let nb = 0
    let uid = null
    for (uid in NeighborsSet.set) {
      if (NeighborsSet.set.hasOwnProperty(uid)) {
        nb++
      }
    }
    return nb - 1
  },
  doForEach: function (f) {
    for (var iid in NeighborsSet.set) {
      if (NeighborsSet.set.hasOwnProperty(iid)) {
        var neighbor = NeighborsSet.set[iid]
        f(neighbor)
      }
    }
  },
  removeNeighbor: function (iid) {
    if (NeighborsSet.set.hasOwnProperty(iid)) {
      let n = Object.assign(NeighborsSet.set[iid])
      delete NeighborsSet.set[iid]
      return n
    }
  },
  removeAllBut: function (keepList) {
    var iid
    for (iid in NeighborsSet.set) {
      if (NeighborsSet.set.hasOwnProperty(iid)) {
        NeighborsSet.set[iid].keepIt = false
      }
    }
    for (var i, len = keepList.length; i < len; i++) {
      iid = keepList[i]
      if (NeighborsSet.set.hasOwnProperty(iid)) {
        NeighborsSet.set[iid].keepIt = true
      }
    }
    var toBeRemoved = []
    for (iid in NeighborsSet.set) {
      if (NeighborsSet.set.hasOwnProperty(iid)) {
        if (!NeighborsSet.set[iid].keepIt) {
          toBeRemoved.push(iid)
        }
      }
    }
    for (i, len = toBeRemoved.length; i < len; i++) {
      iid = toBeRemoved[i]
      NeighborsSet.removeNeighbor(iid)
    }
  },
  insertOrUpdateNeighbor: function (iid, entityState) {
    if (NeighborsSet.set.hasOwnProperty(iid)) {
      var neighbor = NeighborsSet.set[iid]
      neighbor.update(entityState)
      return neighbor
    }
    var newNeighbor = new Neighbor(entityState)
    return newNeighbor
  }
}
export default NeighborsSet

function Neighbor (entityState) {
  this.state = entityState
  this.iid = entityState.iid
  this.avatar = null
  this.model = {
    gltf: null,
    mixer: null,
    clock: new THREE.Clock()
  }

  this.initAvatar = function () {
    let self = this
    self.avatar = true // temporarily make it !null
    let avatarUrl = (this.state.properties && this.state.properties.entityType === 'HUMAN')
      ? '/static/gltf/cesium_man/CesiumMan.gltf'
      // : '/static/gltf/bot/Bot_Skinned.gltf'
      : '/static/gltf/running_man/scene.gltf'
    return new Promise((resolve, reject) => {
      loader.load(avatarUrl, gltf => {
        self.avatar = gltf.scene
        self.avatar.scale.set(5, 5, 5)

        if (this.state.properties && this.state.properties.entityType === 'BOT') {
          self.avatar.scale.set(0.03, 0.03, 0.03)
        }
        self.model.gltf = gltf

        // self.avatar.traverse(node => {
        //   if (node.isMesh) node.castShadow = true
        // })

        // animations
        let animations = self.model.gltf.animations
        if (animations && animations.length) {
          self.model.mixer = new THREE.AnimationMixer(self.avatar)
          for (let i = 0; i < animations.length; i++) {
            let animation = animations[i]
            self.model.mixer.clipAction(animation).play()
          }
        }
        return resolve(self.avatar)
      })
    })
  }
  this.updateAnimation = function (delta) {
    if (this.model && this.model.mixer) this.model.mixer.update(delta)
  }
  this.updatePosition = function (x, y, z, rotation) {
    if (this.avatar && this.avatar.position) {
      this.avatar.position.x = x
      this.avatar.position.y = y
      this.avatar.position.z = z
      if (rotation) {
        this.avatar.rotation.x = rotation[0]
        this.avatar.rotation.y = rotation[1]
        this.avatar.rotation.z = rotation[2]
      }
    }
  }
  this.getGeo = function () {
    return this.state.geo
  }

  NeighborsSet.set[this.iid] = this
}

Neighbor.prototype = {
  update: function (state) {
    this.state = state
  }
}
