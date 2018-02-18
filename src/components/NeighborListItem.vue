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
          <strong>{{entityState.iid}}</strong>
          <h4 class="heading is-5">{{entityState.geo.lat}}, {{entityState.geo.lng}}</h4>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import ExaQuarkJs from 'exaquark-js'
const DEFAULT_AVATAR = process.env.AVATARS.NEIGHBORS // /config/prod.env.js
export default {
  name: 'NeighborListItem',
  props: {
    entityState: {
      type: Object,
      required: true
    }
  },
  computed: {
    avatarUrl: function () {
      console.log('ExaQuarkJs', ExaQuarkJs.getNeighborsByMaxDistance)
      let url = (this.entityState.customState && this.entityState.customState.avatarUrl) ? this.entityState.customState.avatarUrl : DEFAULT_AVATAR
      return url
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
