<template>
<div class="Location">

  <div class="modal" v-bind:class="{ 'is-active': locationModalVisible }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box has-text-centered">

        <div class="">
          <h4 class="title is-4">Chatmap by exaQuark</h4>
          <h4 class="heading subtitle">We're building a digital clone of earth. This is v0.0.1</h4>
        </div>

        <div class="location-buttons columns has-text-centered">
          <div class="column" v-for="place in locations.places" :key="place.label">
            <a class="box" href="#" @click="setPosition(place)">{{place.label}}</a>
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
    setPosition: function (place) {
      console.log('place', place)
      this.$store.commit('SET_POSITION', {
        lat: place.lat,
        lng: place.lng,
        altitude: 0
      })
      this.toggleLocationModal()
    }
  }
}
</script>

<style scoped lang="scss">
.Location {
  .location-buttons {
    margin: 30px 0;
  }
}
</style>
