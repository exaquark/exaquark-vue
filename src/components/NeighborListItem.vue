<template>
  <div class="NeighborListItem">
    <div class="box">
    {{entityState.iid}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'NeighborListItem',
  props: {
    entityState: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.NeighborListItem {
  padding-bottom: 10px;
}
</style>
