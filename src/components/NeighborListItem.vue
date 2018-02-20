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
          <strong>{{neighborState.iid}}</strong>
          <h4 class="heading is-5">{{distance}}</h4>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDistanceBetweenEntities } from 'exaquark-js/lib/helpers.js'
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
      return getDistanceBetweenEntities(this.entityState, this.neighborState) * 1000
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
