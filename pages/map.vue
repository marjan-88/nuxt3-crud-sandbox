<template>
  <div id="my-map">
    <LMap ref="map" :zoom="zoom" :center="[52.147, 21.028]">
      <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
        layer-type="base" name="OpenStreetMap" />
         <!-- Add markers for each point -->
      <LMarker v-for="point in mapPoints" :key="point._id?.toString()" :lat-lng="[point.lat, point.lng]">
        <LPopup>{{ point.name }} <br> {{ point.city }}</LPopup>
      </LMarker>
    </LMap>
  </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
import { useMapPointsStore } from '~/stores/MapPointsStore';
const zoom = ref(6);

const mapPointsStore = useMapPointsStore();
const {
  mapPoints,
  isLoading
} = storeToRefs(mapPointsStore);


</script>
  
<style>
body {
  margin: 0;
}

#my-map {
  max-width: 100%;
  width: 100dvw;
  height: calc(100dvh - 64px);
}
</style>
  