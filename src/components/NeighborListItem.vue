<template>
  <div class="NeighborListItem">

    <div class="box">
      <article class="media">
        <figure class="media-left">
          <p class="image is-32x32">
            <img :src="avatarUrl" alt="avatar">
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <strong>{{neighborState.properties.displayName || neighborState.iid}}</strong>
            <h4 class="heading is-5">{{distance}} km</h4>
          </div>
          <div class="level ">
            <div class="level-left">
              <div class="level-item">
                <span class="icon is-small" v-show="neighborState.properties.mic"><i class="fas fa-microphone"></i></span>
                <span class="icon is-small" v-show="!neighborState.properties.mic"><i class="fas fa-microphone-slash"></i></span>
              </div>
              <div class="level-item">
                <span class="icon is-small" v-show="neighborState.properties.sound"><i class="fas fa-volume-up"></i></span>
                <span class="icon is-small" v-show="!neighborState.properties.sound"><i class="fas fa-volume-off"></i></span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDistanceBetweenEntities } from 'exaquark-js/helpers'
const DEFAULT_AVATAR = process.env.AVATARS.NEIGHBORS // /config/prod.env.js
export default {
  name: 'NeighborListItem',
  props: {
    neighborState: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'entityState'
    ]),
    avatarUrl: function () {
      let url = (this.neighborState.customState && this.neighborState.customState.avatarUrl) ? this.neighborState.customState.avatarUrl : DEFAULT_AVATAR
      return url
    },
    distance: function () {
      let distance = getDistanceBetweenEntities(this.entityState, this.neighborState).toFixed(2)
      return distance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>

<style scoped lang="scss">
.NeighborListItem {
  padding-bottom: 10px;
  .box {
    padding: 10px;

    .media-content {
      font-size: 0.8rem;
    }
  }
}
</style>
