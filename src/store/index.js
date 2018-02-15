import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  neighbors: [],
  addressGeo: {}
}
const mutations = {
  SET_NEIGHBOUR_LIST (state, payload) {
    state.neighbors = payload
  },
  SET_ADDRESS_GEO (state, payload) {
    state.addressGeo = payload
  }
}
const actions = {

}
const getters = {
  neighbors: state => state.neighbors,
  addressGeo: state => state.addressGeo
}

export default new Vuex.Store({
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
})
