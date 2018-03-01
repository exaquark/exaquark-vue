const THREE = require('three')

// neighbors
var avatarGeometry = new THREE.SphereGeometry(5, 32, 32)
var avatarMaterial = new THREE.MeshBasicMaterial({color: 0x000000})

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
      let n = NeighborsSet.set[iid]
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
    if (!newNeighbor.state.customState.webrtc) {
      return newNeighbor
    }
    return newNeighbor
  }
}
export default NeighborsSet

function Neighbor (entityState) {
  this.state = entityState
  this.iid = entityState.iid
  this.avatar = new THREE.Mesh(avatarGeometry, avatarMaterial)
  this.avatar.position.x = 10
  this.avatar.position.y = 10
  this.avatar.position.z = 10

  this.updatePosition = function (x, y, z) {
    this.avatar.position.x = x
    this.avatar.position.y = y
    this.avatar.position.z = z
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
