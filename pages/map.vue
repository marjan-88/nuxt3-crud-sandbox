<template>
  <div id="my-map" class="map-container">
    <div class="map-holder">
      <aside class="overflow-hidden">
        <h3 class="text-lg mx-4 px-2">Map points:</h3>
        <div class="map-list p-4 h-full  overflow-auto">
          <div v-if="isLoading">
            <LoadingSpinner></LoadingSpinner>
          </div>
          <ul v-else class="grid grid-cols-1 divide-y  bg-white rounded-md shadow-md  " v-auto-animate>
            <li @click="highlightMarker(marker)" v-for="marker in mapPoints" :key="marker._id?.toString()"
              class="flex align-center hover:bg-gray-50 p-2 cursor-pointer">
              {{ marker.name }} ({{ marker.city }})
            </li>
          </ul>
        </div>
      </aside>
      <div class="map">
        <LMap ref="mapRef" :zoom="zoom" :center="mapCenter" @ready="isLoaded">
          <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
            layer-type="base" name="OpenStreetMap" />
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
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
import { useMapPointsStore } from '~/stores/MapPointsStore';
import type { MapPoint } from '~/types/MapPoint';
import "leaflet/dist/leaflet.css";
import type { LMap, LMarker } from '@vue-leaflet/vue-leaflet';


const zoom = ref(6);
const mapCenter = ref<[number, number]>([52.147, 21.028]); // Default center
const mapPointsStore = useMapPointsStore();
const mapRef = ref<InstanceType<typeof LMap> | null>(null);
  const highlightedMarker = ref<MapPoint | null>(null);
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
const showTooltip = (e: any) => {
  console.log(e.latlng.lat + ", " + e.latlng.lng);
}
const highlightMarker = (marker: MapPoint) => {
  const newZoom = 8; // Set the zoom level you desire
  const newCenter = ref<[number, number]>([marker.lat, marker.lng])  // Set the center to the clicked marker

  mapRef.value?.leafletObject?.setView(newCenter.value, newZoom); // Set new zoom level and center

};


const isLoaded=()=> {

}
// When the map is ready
onMounted(() => {
  console.log('onMounted');
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      mapCenter.value = [latitude, longitude]; // Update map center
    });
  }
 
});

</script>

  
<style lang="scss">
body {
  margin: 0;
}

.map-holder {
  display: grid;
  grid-template-columns: 20% 80%;
  height: calc(100dvh - 64px);

  .map-list {
    background-color: $bg-grey;

  }

  .map {
    max-width: 100%;
    width: 100%;
    height: 100%;
  }
}
</style>
  