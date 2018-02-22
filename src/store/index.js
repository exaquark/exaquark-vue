import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  iid: '',
  entityState: {
    entityId: 'MOCK_ENTITY_ID', // {string} required: their entityId
    universe: 'MOCK_UNIVERSE_ID', // {string} required:  which universe is the entitiy in
    geo: {
      lat: Math.random() * 180 - 90, // {double} required: latitude
      lng: Math.random() * 360 - 180, // {double} required: longitude
      altitude: 0, // {double} optional: altitude in meters - can be negative
      rotation: [ 2, 5, 19 ] // {Array of doubles} optional: all in degrees. Default facing north
    },
    properties: {
      displayName: '', // {string} required: a human readable name to be displayed
      sound: false, // {boolean} optional: defaults to true. false === mute
      mic: false, // {boolean} optional: defaults to true. false === muted microphone
      virtualPosition: true, // {boolean} optional: defaults to false. Is this person physically in the position that they are in the digital universe. (true === they are not physically present there)
      entityType: 'HUMAN' // {string} optional: defaults to 'human'. Options: 'HUMAN' | 'BOT' | 'DRONE'
    },
    customState: {
      // developer defined state for their universe
      // you can use this to pass arbitrary data to other entities in your neighborhood
      avatarUrl: ''
    }
  },
  locations: {
    places: [
      {
        label: 'Paris',
        lat: 48.8556,
        lng: 2.2986
      },
      {
        label: 'Singapore',
        lat: 1.2883,
        lng: 103.8475
      }
    ],
    modalVisible: true
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
  SET_DISPLAY_NAME (state, payload) {
    state.entityState.properties.displayName = payload
  },
  SET_ENTITY_STATE (state, payload) {
    state.entityState = payload
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
  TOGGLE_LOCATION_MODAL (state) {
    state.locations.modalVisible = !state.locations.modalVisible
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
  locations: state => state.locations,
  locationModalVisible: state => state.locations.modalVisible,
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
