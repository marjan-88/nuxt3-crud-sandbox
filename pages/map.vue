<template>
  <div id="my-map">
    <LMap ref="map" :zoom="zoom" :center="[52.147, 21.028]" @click="showTooltip">
      <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
        layer-type="base" name="OpenStreetMap" />
         <!-- Add markers for each point -->
         <LMarker v-for="(points, key) in groupedMapPoints" :key="key" :lat-lng="points[0]">
          <LPopup>
            <div v-for="point in points" :key="point._id?.toString()">
              <NuxtLink :to="`/manage-points/${point._id}`">
                <p>{{ point.name }} - {{ point.city }}</p>
              </NuxtLink>
            </div>
          </LPopup>
      </LMarker>
    </LMap>
  </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
import { useMapPointsStore } from '~/stores/MapPointsStore';
import type { MapPoint } from '~/types/MapPoint';
const zoom = ref(6);
const mapPointsStore = useMapPointsStore();
const {
  mapPoints,
  isLoading
} = storeToRefs(mapPointsStore);


const groupedMapPoints = computed(() => {
  const grouped: { [key: string]: MapPoint[] } = {};
  mapPoints.value.forEach(point => {
    const key = `${point.lat},${point.lng}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(point);
  });
  return grouped;
});
const showTooltip = (e:any)=> {
  console.log(e.latlng.lat + ", " + e.latlng.lng);
}

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
  