<template>
  <div class="AddressLookup">
    <gmap-autocomplete @place_changed="emitPlace" class="input" placeholder="Go to address"> </gmap-autocomplete>
  </div>
</template>

<script>
export default {
  name: 'AddressLookup',
  data: () => {
    return {
      place: null
    }
  },
  methods: {
    emitPlace: function (place) {
      console.log('place', place)
    }
  }
}
</script>

<style scoped lang="scss">
.AddressLookup {
}
</style>
