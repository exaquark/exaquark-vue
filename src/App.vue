<template>
  <div id="App">
    <router-view/>
  </div>
</template>

<script>
import Nav from '@/components/Nav.vue'
export default {
  name: 'App',
  components: {
    Nav
  }
}
</script>

<style lang="scss">
@import "~bulma";

html, body {
  min-height: 100%;
}
#App {

}
</style>
