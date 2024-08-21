<template>
     <div id="my-map" class="map-container relative z-50">
          <el-button id="quick-add" @click="handleAddPointModal()" class="absolute" type="info" :icon="Plus" circle />
          <div class="map-holder ">
               <aside class="flex flex-col overflow-hidden">
                    <h3 class="text-lg mx-4 px-2">Map points:</h3>
                    <div class="map-list p-4 h-full  overflow-auto">
                         <div v-if="isLoading">
                              <LoadingSpinner></LoadingSpinner>
                         </div>
                         <ul v-else class="grid grid-cols-1 divide-y  bg-white rounded-md shadow-md  " v-auto-animate>
                              <!-- :class="{ 'highlight': marker.lat }" -->
                              <li @click="highlightMarker(marker)" v-for="marker in mapPoints"
                                   :key="marker._id?.toString()"
                                   :class="{ 'highlight': marker === highlightedListItem }"
                                   class="flex align-center  p-2 cursor-pointer">
                                   {{ marker.name }} ({{ marker.city }})
                              </li>
                         </ul>
                    </div>
               </aside>
               <div class="map">
             
                    <LMap ref="mapRef" @mouseup.middle="showTooltip" :zoom="zoom" :center="mapCenter" >
                         <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
                              layer-type="base" name="OpenStreetMap" />
                         <LMarker 
                              @click="handleListHighlight" 
                              ref="markerRef" 
                              v-for="(points, key) in groupedMapPoints" 
                              :key="key"
                              :lat-lng="points[0]"
                              >
                              <LPopup ref="popupRef">
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
import type { LMap, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import { useClipboard } from '@vueuse/core'; 
import {  
  Plus
} from '@element-plus/icons-vue';
definePageMeta({
     middleware: 'auth'
})
const triggerModal = useState('isAddPointModalOpened');

const handleAddPointModal = () => {
     navigateTo('/manage-points');
     triggerModal.value = true;
}


const zoom = ref(6);
const mapCenter = ref<[number, number]>([52.147, 21.028]); // Default center
const mapPointsStore = useMapPointsStore();
const mapRef = ref<InstanceType<typeof LMap> | null>(null);
const markerRef = ref<InstanceType<typeof LMarker>[] | null>(null);
const popupRef = ref<InstanceType<typeof LPopup>[] | null>(null);

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

const { copy } = useClipboard();

const showTooltip = (e:any) => {
  if (e.originalEvent && e.originalEvent.button === 1) {
    const coordinates = `${e.latlng.lat} ${e.latlng.lng}`;
    copy(coordinates); // Copy coordinates to clipboard

    ElMessageBox.confirm(
    `${coordinates}`,
    'Coordinates',
    {
      confirmButtonText: 'Copy to clipboard',
      cancelButtonText: 'Cancel',
      center: true,
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'Copy to clipboard completed',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Aborted',
      })
    })  }
};

let highlightedListItem = ref<MapPoint | null>(null);

const highlightMarker = (marker: MapPoint) => {
    const newZoom = 8;
    const newCenter = ref<[number, number]>([marker.lat, marker.lng]);
    nextTick(() => {
        mapRef.value?.leafletObject?.setView(newCenter.value, newZoom); // Set new zoom level and center
    })

    const foundMarker = markerRef.value?.find((item) => {
        return item.leafletObject?.getLatLng().equals([marker.lat, marker.lng]);
    });
    const foundMarkerCoords = foundMarker?.leafletObject?.getLatLng();
    const popup = foundMarker?.leafletObject?.getPopup();

    if (popup && foundMarker && foundMarkerCoords) {
        popup?.setLatLng(foundMarkerCoords);
        mapRef.value?.leafletObject?.openPopup(popup);
    }
    highlightedListItem.value = marker; // Set the highlighted marker
};

const handleListHighlight = (mapMarker: typeof LMarker) => {
     const mapMarkerLat = mapMarker.latlng.lat;
     const mapMarkerLng = mapMarker.latlng.lng;
     const matchedListElement = mapPoints.value.find(listItem => 
         listItem.lat === mapMarkerLat && listItem.lng === mapMarkerLng
     );  

     if (matchedListElement) {
        highlightedListItem.value = matchedListElement;    
    }  
    
};


onMounted(() => {

     if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(position => {
               const { latitude, longitude } = position.coords;
               mapCenter.value = [latitude, longitude]; // Update map center
          });
     } else {
          ElNotification.warning({
               title: "Info",
               message: "Please allow geolocalization.",
               showClose: false,
               type: "warning",
          });
     }

});

</script>


<style lang="scss">

.map-holder {
     display: grid;
     grid-template-columns: 20% 80%;
     height: calc(100dvh - 64px);
}

.map-list {
     background-color: $bg-grey;
}

.map {
     max-width: 100%;
     width: 100%;
     height: 100%;
}
.highlight {
  background-color: $blue; /* Define your highlight color */
  color: #fff;
  font-weight: 500;
}
#quick-add {
     bottom: 50%;
     right:  15px;
     z-index: 9999999999;
}
</style>