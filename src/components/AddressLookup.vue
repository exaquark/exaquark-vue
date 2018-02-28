<template>
  <div class="AddressLookup">
    <gmap-autocomplete @place_changed="emitPlace" class="input is-expanded" placeholder="Go to address" > </gmap-autocomplete>
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
      if (place) {
        let lat = place.geometry.location.lat()
        let lng = place.geometry.location.lng()
        if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
          console.log('emitting', place.geometry.location)
          this.$emit('onChange', {
            lat: lat,
            lng: lng
          })
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.AddressLookup {
}
</style>
