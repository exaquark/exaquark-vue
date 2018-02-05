import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

var createMockBots = function () {
  let mockBots = []
  for (var i = 0; i < 12; i++) {
    mockBots.push({
      entityId: 'MOCK_ENTITY_ID', // {string} required: their entityId
      iid: Math.floor(Math.random() * 10000000).toString(), // {string} required: instance ID - each user can have multiple "instances". For example they can be logged in to their browser and their phone at the same time
      universe: 'MOCK_UNIVERSE_ID', // {string} required:  which universe is the entitiy in
      delaunay: 1, // {number} 1 - 5 - delaunay is the "distance" of your neighbor. It isn't required when sending to exaQuark, however you will receive it in notifications about your neighbors
      geo: {
        lat: 3.11, // {double} required: latitude
        lng: 5.33, // {double} required: longitude
        altitude: 32.1, // {double} optional: altitude in meters - can be negative
        rotation: [ 2, 5, 19 ] // {Array of doubles} optional: all in degrees. Default facing north
      },
      properties: {
        avatarId: 'MOCK_AVATAR_ID', // {string} required: the avatar your user has selected
        sound: true, // {boolean} optional: defaults to true. false === mute
        mic: true, // {boolean} optional: defaults to true. false === muted microphone
        virtualPosition: false, // {boolean} optional: defaults to false. Is this person physically in the position that they are in the digital universe. (true === they are not physically present there)
        entityType: 'BOT' // {string} optional: defaults to 'human'. Options: 'HUMAN' | 'BOT' | 'DRONE'
      },
      universeState: {
        // developer defined state for their universe
        // you can use this to pass arbitrary data to other entities in your neighborhood
      }
    })
  }
  return mockBots
}

const state = {
  neighbors: createMockBots()
}
const mutations = {

}
const actions = {

}
const getters = {
  neighbors: state => state.neighbors
}

export default new Vuex.Store({
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
})
