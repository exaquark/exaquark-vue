class browserMedia {
  constructor () {
    this.audioStream = {}
    this.audioTracks = []
    this.audioElement = null
    this.videoStream = {}
    this.videoTracks = []
    this.videoElement = null
  }

  initAudio (htmlElement, constraints = {audio: true}) {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.enumerateDevices().then(deviceInfos => {
        for (var i = 0; i !== deviceInfos.length; ++i) {
          var deviceInfo = deviceInfos[i]
          if (deviceInfo.kind === 'audioinput') this.audioTracks.push(deviceInfos[i])
        }
        return navigator.mediaDevices.getUserMedia(constraints)
      }).then(stream => {
        this.audioStream = stream
        resolve(stream) // return the default stream
      }).catch(err => reject(err))
    })
  }

  initVideo (htmlElement, constraints = {video: true}) {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.enumerateDevices().then(deviceInfos => {
        for (var i = 0; i !== deviceInfos.length; ++i) {
          var deviceInfo = deviceInfos[i]
          if (deviceInfo.kind === 'videoinput') this.videoTracks.push(deviceInfos[i])
        }
        return navigator.mediaDevices.getUserMedia(constraints)
      }).then(stream => {
        this.videoStream = stream
        this.videoElement = htmlElement
        this.videoElement.srcObject = this.videoStream
        this.videoElement.onloadedmetadata = (e) => { this.videoElement.play() }
        return resolve(this.videoStream) // return the default stream
      }).catch(err => reject(err))
    })
  }

  getAudioTracks () {
    return this.audioTracks
  }

  getVideoTracks () {
    return this.videoTracks
  }

  stopAudio () {
    // this.audioTracks.forEach(track => {
    //   console.log('track', track)
    //   track.pause()
    // })
    // console.log('variable', this.audioStream)
    this.audioStream = {}
    this.audioTracks = []
    console.log('this', this)
  }

  stopVideo () {
    if (this.videoStream) {
      this.videoStream.getVideoTracks().forEach(track => {
        console.log('track', track)
        track.stop()
      })
    }
    this.videoElement.src = '#'
  }
}
export default browserMedia
