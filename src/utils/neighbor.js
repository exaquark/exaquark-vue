// neighbor.js
// eslint-disable-next-line
'use strict';
import GLTF2Loader from 'three-gltf2-loader'
const THREE = require('three')
const Peer = require('simple-peer')
const ICEconfiguration = {
  iceServers: [
    {urls: 'stun:5.39.93.115', username: 'divereal', credential: 'paris1965'},
    {urls: 'turn:5.39.93.115', username: 'divereal', credential: 'paris1965'}
  ]
}
GLTF2Loader(THREE)
var loader = new THREE.GLTFLoader()

export default class Neighbor {
  constructor (entityState) {
    this.state = entityState
    this.iid = entityState.iid
    this.avatar = null
    this.model = {
      gltf: null,
      mixer: null,
      clock: new THREE.Clock()
    }
    console.log('set this.iid', this.iid)
  }
  update = function (state) {
    this.state = state
  }
  initAvatar = function () {
    let self = this
    self.avatar = true // temporarily make it !null
    let avatarUrl = (this.state.properties && this.state.properties.entityType === 'HUMAN')
      ? '/static/gltf/cesium_man/CesiumMan.gltf'
      // : '/static/gltf/bot/Bot_Skinned.gltf'
      : '/static/gltf/running_man/scene.gltf'
    return new Promise((resolve, reject) => {
      loader.load(avatarUrl, gltf => {
        self.avatar = gltf.scene

        if (this.state.properties && this.state.properties.entityType === 'BOT') {
          self.avatar.scale.set(0.005, 0.005, 0.005)
        } else {
          self.avatar.scale.set(2, 2, 2)
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
  getRelevance = function () {
    let modifier = 0
    if (this.state.properties && this.state.properties.entityType === 'BOT') modifier += 10
    return this.state.neighborLevel + modifier
  }
  updateAnimation = function (delta) {
    if (this.model && this.model.mixer) this.model.mixer.update(delta)
  }
  updatePosition = function (x, y, z, rotation) {
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
  getGeo = function () {
    return this.state.geo
  }
  hasActiveStream = function () {
    return this.peerStream && this.peerStream.active
  }
  getStream = function () {
    return this.peerStream
  }
}

Neighbor.prototype.peerStream = null
Neighbor.prototype.signalsToSend = []
Neighbor.prototype.volume = {
  value: 0.0,
  instant: 0.0,
  scriptProcessor: null
}
Neighbor.prototype.initPeerConnection = function (stream, isInitiator) {
  if (this.peerConnection) this.peerConnection.destroy()
  this.closeStream()
  if (stream) {
    console.log('initializing p2p with stream')
    this.peerConnection = new Peer({
      channelName: this.state.iid,
      initiator: isInitiator, // the person with the highest IID should be the initiator of the P2P connection (or the person who changes stream)
      stream: stream,
      config: ICEconfiguration,
      reconnectTimer: 5000
    })
  } else {
    console.log('initializing p2p without stream')
    this.peerConnection = new Peer({
      channelName: this.state.iid,
      initiator: isInitiator,
      config: ICEconfiguration,
      reconnectTimer: 5000
    })
  }

  var neighbour = this
  // the following are called via their peer, so they have no concept of "this" neighbor
  // instead, "this" refers to the P2P connection
  neighbour.peerConnection.on('signal', data => {
    // queue the data for exaQuark
    this.signalsToSend.push(JSON.stringify(data))
  })
  neighbour.peerConnection.on('stream', remoteStream => {
    console.log(`got remoteStream ${remoteStream.id}`, remoteStream)
    neighbour.setStream(remoteStream)
  })
  neighbour.peerConnection.on('connect', function () {
    console.log('connected', neighbour)
    this.send('hello :)')
  })
  neighbour.peerConnection.on('data', function (data) {
    console.log('got a message: ' + data, this)
  })
  neighbour.peerConnection.on('close', function () {
    console.log('close', neighbour)
    neighbour.peerStream = null
    neighbour.peerConnection = null
    neighbour.signalsToSend = []
  })
  return neighbour.peerConnection
}
Neighbor.prototype.setStream = function (stream) {
  this.peerStream = stream
}
Neighbor.prototype.closeStream = function (stream) {
  this.peerStream = null
  this.peerConnection = null
  this.signalsToSend = []
}
Neighbor.prototype.receiveSignal = function (signal) {
  if (this.peerConnection) this.peerConnection.signal(JSON.parse(signal))
}
Neighbor.prototype.hasQueuedSignals = function () {
  return this.signalsToSend.length > 0
}
Neighbor.prototype.sendQueuedSignals = function (exaQuark) {
  let len = this.signalsToSend.length
  console.log('sending from', exaQuark.iid, 'to', this.iid)
  for (let i = 0; i < len; i++) {
    let type = this.signalsToSend[i].type
    if (type) console.log(`sending ${type} to neighbor ${this.iid}`, this.signalsToSend[i])
    exaQuark.push('signal:private', {
      entities: [this.iid],
      signal: {
        type: '_webrtc',
        data: this.signalsToSend[i]
      }
    })
  }
  this.signalsToSend.splice(0, len)
}
Neighbor.prototype.getVolume = function () {
  let AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext || !this.peerConnection || !this.peerStream) {
    // return console.log('Cannot get volume for ' + this.iid)
    return null
  }

  if (!this.volume.scriptProcessor) {
    try {
      let self = this
      let audioContext = new AudioContext()
      self.volume.scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1)
      self.volume.scriptProcessor.onaudioprocess = event => {
        let input = event.inputBuffer.getChannelData(0)
        let sum = 0.0
        let clipcount = 0 // eslint-disable-line
        for (let i = 0; i < input.length; ++i) {
          sum += input[i] * input[i]
          if (Math.abs(input[i]) > 0.99) {
            clipcount += 1
          }
        }
        self.volume.instant = Math.sqrt(sum / input.length)
        self.volume.value = 0.2 * self.volume.value + 0.8 * self.volume.instant // "smooth" the volume
      }
      self.volume.mic = audioContext.createMediaStreamSource(this.peerStream)
      self.volume.mic.connect(self.volume.scriptProcessor)
      self.volume.scriptProcessor.connect(audioContext.destination)
      return self.volume.value // will be 0.0 while the processor starts up
    } catch (e) {
      return console.log('Audio not supported', e)
    }
  } else return this.volume.value
}
