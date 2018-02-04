<template>
<div class="Home">
  <Map />
</div>
</template>

<script>
import Map from '@/components/Map.vue'
export default {
  name: 'home',
  components: {
    Map
  }
}
</script>

<style lang="scss">

.Home {
  position: relative;
  min-height: calc(100vh - 3.25rem - 2px); // height of Navbar and border
  overflow: hidden;
}
</style>
