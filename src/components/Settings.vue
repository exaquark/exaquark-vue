<template>
<div class="Settings">

  <div class="modal" v-bind:class="{ 'is-active': settingsModalVisible }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <p>Your IID: {{iid}} <br> <br> </p>

        <label class="label">Your display name</label>
        <div class="field has-addons">
          <div class="control is-expanded">
            <input class="input is-fullwidth" type="text" v-model="displayName">
          </div>
          <div class="control">
            <a class="button is-info" @click="updateDisplayName()">Update</a>
          </div>
        </div>

        <label class="label">Your avatar</label>
        <div class="field has-addons">
          <div class="control is-expanded">
            <input class="input is-fullwidth" type="text" :placeholder="avatarPlaceholder" v-model="avatar">
          </div>
          <div class="control">
            <a class="button is-info" @click="updateAvatar()">Update</a>
          </div>
        </div>

      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="toggleSettingsModal()"></button>
  </div>

</div>
</template>

<script>
import { mapGetters } from 'vuex'
const DEFAULT_AVATAR = process.env.AVATARS.ME // /config/prod.env.js
export default {
  name: 'Settings',
  props: {
  },
  data: () => {
    return {
      avatar: '',
      avatarPlaceholder: DEFAULT_AVATAR,
      displayName: ''
    }
  },
  computed: {
    ...mapGetters([
      'iid',
      'entityState',
      'settingsModalVisible'
    ])
  },
  methods: {
    toggleSettingsModal: function () {
      this.$store.commit('TOGGLE_SETTINGS_MODAL')
    },
    updateAvatar: function () {
      this.$store.commit('SET_CUSTOM_AVATAR', this.avatar)
      this.$store.commit('TOGGLE_SETTINGS_MODAL')
    },
    updateDisplayName: function () {
      this.$store.commit('SET_DISPLAY_NAME', this.displayName)
      console.log('this.entityState.properties.displayName', this.entityState.properties.displayName)
      this.$store.commit('TOGGLE_SETTINGS_MODAL')
    }
  }
}
</script>

<style scoped lang="scss">
.Settings {
}
</style>
