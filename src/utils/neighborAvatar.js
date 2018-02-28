const THREE = require('three')

// neighbors
var neighborGeometry = new THREE.SphereGeometry(5, 32, 32)
var neighborMaterial = new THREE.MeshBasicMaterial({color: 0x000000})
var neighbor = new THREE.Mesh(neighborGeometry, neighborMaterial)
neighbor.position.x = Math.floor(Math.random() * 20 - 10) * 20
neighbor.position.y = 10
neighbor.position.z = Math.floor(Math.random() * 20 - 10) * 20

class neighborObject {
  constructor (iid, x, y, z) {
    this.iid = iid
    this.avatar = new THREE.Mesh(neighborGeometry, neighborMaterial)
    this.avatar.position.x = x
    this.avatar.position.y = y
    this.avatar.position.z = z
  }
}
export default neighborObject
