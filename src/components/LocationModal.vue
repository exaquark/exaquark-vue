<template>
<div class="Location">

  <div class="modal" v-bind:class="{ 'is-active': locationModalVisible }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">

        <div class="heading-div has-text-centered">
          <h4 class="title is-4">Chatmap by exaQuark</h4>
          <h4 class="heading subtitle">We're building a digital clone of earth. This is v0.0.1</h4>
        </div>

        <h5 class="title is-5">Universe</h5>
        <div class="location-buttons columns has-text-centered">
          <div class="column">
            <a class="box" href="#" @click="changeUniverse('SANDBOX_WHITE')">Sandbox (white)</a>
          </div>
          <div class="column">
            <a class="box" href="#" @click="changeUniverse('SANDBOX_BLACK')">Sandbox (black)</a>
          </div>
        </div>

        <h5 class="title is-5">Location</h5>
        <div class="location-buttons columns has-text-centered">
          <div class="column" v-for="place in locations.places" :key="place.label">
            <a class="box" href="#" @click="handleTeleport(place)">{{place.label}}</a>
          </div>
        </div>

        <div class="field is-grouped">
          <p class="control">
            <a href="#" class="button is-primary" @click="goToMe()" v-if="geolocationEnabled">My Real Location</a>
          </p>
          <p class="control is-expanded">
            <AddressLookup @onChange="setAddressGeo" />
          </p>
        </div>

      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="toggleLocationModal()"></button>
  </div>

</div>
</template>

<script>
import { mapGetters } from 'vuex'
import AddressLookup from '@/components/AddressLookup.vue'
import World from '@/utils/world'
var world = World.getInstance()
export default {
  name: 'Location',
  props: {
  },
  components: {
    AddressLookup
  },
  data: () => {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'locations',
      'locationModalVisible'
    ]),
    geolocationEnabled: function () {
      return navigator && navigator.geolocation
    }
  },
  methods: {
    toggleLocationModal: function () {
      this.$store.commit('TOGGLE_LOCATION_MODAL')
    },
    setAddressGeo: function (payload) {
      this.$store.commit('SET_ADDRESS_GEO', payload)
      this.toggleLocationModal()
    },
    goToMe: function () {
      navigator.geolocation.getCurrentPosition(this.handleGeolocation, err => {
        alert(err.message)
      })
    },
    handleGeolocation: function (position) {
      let place = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      this.setPosition(place)
    },
    handleTeleport: function (position) {
      let place = {
        lat: position.lat + (Math.random() - 0.5) / 2000,
        lng: position.lng + (Math.random() - 0.5) / 2000
      }
      this.setPosition(place)
    },
    setPosition: function (place) {
      console.log('place', place)
      world.setOriginLatLng(place.lat, place.lng)
      this.$store.commit('SET_POSITION', {
        lat: place.lat,
        lng: place.lng,
        altitude: 0
      })
      this.toggleLocationModal()
    },
    changeUniverse: function (universe) {
      this.$store.commit('SET_UNIVERSE', universe)
      this.toggleLocationModal()
    }
  }
}
</script>

<style scoped lang="scss">
.Location {
  .heading-div {
    margin-bottom: 30px;
  }
  .location-buttons {
    margin: 30px 0;
  }
}
</style>
