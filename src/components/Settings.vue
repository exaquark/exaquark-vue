<template>
<div class="Settings">

  <div class="modal" v-bind:class="{ 'is-active': settingsModalVisible }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <p>Your IID: {{iid}} <br> <br> </p>

        <label class="label">Your display name</label>
        <div class="field">
          <div class="control is-expanded">
            <input class="input is-fullwidth" type="text" v-model="displayName">
          </div>
        </div>

        <label class="label">Your avatar</label>
        <div class="field">
          <div class="control is-expanded">
            <input class="input is-fullwidth" type="text" :placeholder="avatarPlaceholder" v-model="customAvatar">
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
      avatarPlaceholder: DEFAULT_AVATAR
    }
  },
  computed: {
    ...mapGetters([
      'iid',
      'entityState',
      'settingsModalVisible'
    ]),
    customAvatar: {
      get () {
        return this.entityState.customState.avatarUrl
      },
      set (value) {
        this.$store.commit('SET_CUSTOM_AVATAR', value)
      }
    },
    displayName: {
      get () {
        return this.entityState.properties.displayName
      },
      set (value) {
        console.log('value', value)
        this.$store.commit('SET_DISPLAY_NAME', value)
      }
    }
  },
  methods: {
    toggleSettingsModal: function () {
      this.$store.commit('TOGGLE_SETTINGS_MODAL')
    }
  }
}
</script>

<style scoped lang="scss">
.Settings {
}
</style>
