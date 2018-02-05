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
          <AddressLookup  />
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="toggleLocationModal()"></button>
    </div>
    <div class="modal" v-bind:class="{ 'is-active': showSettingsModal }">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box">
          Settings: consider moving to new route
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="toggleSettingsModal()"></button>
    </div>

  </div>
</template>

<script>
import AddressLookup from '@/components/AddressLookup.vue'
export default {
  name: 'Nav',
  components: {
    AddressLookup
  },
  data: function () {
    return {
      showMobileMenu: false,
      showLocationModal: false,
      showSettingsModal: false
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
      this.showSettingsModal = !this.showSettingsModal
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
