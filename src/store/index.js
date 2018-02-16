import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  iid: '',
  entityState: {
    entityId: 'MOCK_ENTITY_ID', // {string} required: their entityId
    universe: 'MOCK_UNIVERSE_ID', // {string} required:  which universe is the entitiy in
    delaunay: 1, // {number} 1 - 5 - delaunay is the "distance" of your neighbor. It isn't required when sending to exaQuark, however you will receive it in notifications about your neighbors
    geo: {
      lat: 1.2883, // {double} required: latitude
      lng: 103.8475, // {double} required: longitude
      altitude: 0, // {double} optional: altitude in meters - can be negative
      rotation: [ 2, 5, 19 ] // {Array of doubles} optional: all in degrees. Default facing north
    },
    properties: {
      displayName: 'A_USER_NAME', // {string} required: a human readable name to be displayed
      sound: true, // {boolean} optional: defaults to true. false === mute
      mic: true, // {boolean} optional: defaults to true. false === muted microphone
      virtualPosition: false, // {boolean} optional: defaults to false. Is this person physically in the position that they are in the digital universe. (true === they are not physically present there)
      entityType: 'HUMAN' // {string} optional: defaults to 'human'. Options: 'HUMAN' | 'BOT' | 'DRONE'
    },
    customState: {
      // developer defined state for their universe
      // you can use this to pass arbitrary data to other entities in your neighborhood
      avatarUrl: ''
    }
  },
  neighbors: [],
  settings: {
    customAvatar: '',
    modalVisible: false
  }
}
const mutations = {
  SET_CUSTOM_AVATAR (state, payload) {
    state.settings.customAvatar = payload
    state.entityState.customState.avatarUrl = payload
  },
  SET_IID (state, payload) {
    state.iid = payload
  },
  SET_NEIGHBOUR_LIST (state, payload) {
    state.neighbors = payload
  },
  SET_POSITION (state, payload) {
    state.entityState.geo.lat = payload.lat
    state.entityState.geo.lng = payload.lng
  },
  TOGGLE_SETTINGS_MODAL (state) {
    state.settings.modalVisible = !state.settings.modalVisible
  }
}
const actions = {

}
const getters = {
  customAvatar: state => state.settings.customAvatar,
  iid: state => state.iid,
  entityState: state => state.entityState,
  neighbors: state => state.neighbors,
  settings: state => state.settings,
  settingsModalVisible: state => state.settings.modalVisible
}
export default new Vuex.Store({
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
})
