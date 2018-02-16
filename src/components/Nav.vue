<template>
  <div class="Nav">

    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <img src="../assets/logo-menu.svg" alt="exaQuark" width="112" >
        </a>

        <button class="navbar-burger" @click="toggleMobileMenu()">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div class="navbar-menu" v-bind:class="{ 'is-active': showMobileMenu }">
        <div class="navbar-end">
          <a class="navbar-item" @click="toggleLocationModal()">
            <span class="icon is-small is-hidden-mobile">
              <i class="far fa-map"></i>
            </span>
            <span class=" is-hidden-tablet">Teleport</span>
          </a>
          <a class="navbar-item" @click="toggleSettingsModal()">
            <span class="icon is-small is-hidden-mobile">
              <i class="fas fa-cog"></i>
            </span>
            <span class=" is-hidden-tablet">Settings</span>
          </a>
        </div>
      </div>
    </nav>
    <div class="modal" v-bind:class="{ 'is-active': showLocationModal }">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box">
          Navigation
          <AddressLookup @onChange="setAddressGeo" />
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="toggleLocationModal()"></button>
    </div>

    <Settings />
  </div>
</template>

<script>
import AddressLookup from '@/components/AddressLookup.vue'
import Settings from '@/components/Settings.vue'
export default {
  name: 'Nav',
  components: {
    AddressLookup,
    Settings
  },
  data: function () {
    return {
      showMobileMenu: false,
      showLocationModal: false
    }
  },
  methods: {
    toggleMobileMenu: function () {
      this.showMobileMenu = !this.showMobileMenu
    },
    toggleLocationModal: function () {
      this.showLocationModal = !this.showLocationModal
    },
    toggleSettingsModal: function () {
      this.$store.commit('TOGGLE_SETTINGS_MODAL')
    },
    setAddressGeo: function (payload) {
      this.$store.commit('SET_ADDRESS_GEO', payload)
      this.toggleLocationModal()
    }
  }
}
</script>
<style scoped lang="scss">
.Nav {
  .navbar {
    border-bottom: 1px solid #ededed;
  }
}
</style>
