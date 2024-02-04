<template>
     <div>
          <el-page-header class="mb-4" @back="$router.back()">
               <template #content>
                    <span class="text-large font-600 mr-3"> Map - point details </span>
               </template>
          </el-page-header>
          <div class="p-2 border-dashed border-2 border-sky-500" v-if="!isLoading">
               <h2 v-if="mapPoint === undefined || null">No content found</h2>
               <div v-else>
                    <div class="flex flex-col gap-y-4 " >
                         <p>Name: {{ mapPoint?.name }}</p>
                         <p>Latitude: {{ mapPoint?.lat }}</p>
                         <p>Longtitude: {{ mapPoint?.lng }}</p>
                         <p>Content: {{ mapPoint?.content }}</p>
                         <p>Category: {{ mapPoint?.category?.toString() }}</p>
                         <p>Rating: {{ mapPoint?.rating }}</p>
                         <p>Created At: {{ mapPoint?.createdAt }}</p>
                         <p>Updated At: {{ mapPoint?.updatedAt }}</p>
                    </div>
                    <el-button class="w-max mt-4" @click="onDelete">
                         Delete point
                         <el-icon class="ml-2">
                              <ElIconDelete />
                         </el-icon>                    </el-button>

               </div>
          </div>
          <div v-else>
               <LoadingSpinner />
          </div>
     </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMapPointsStore } from '~/stores/MapPointsStore';
const route = useRoute();
const mapPointsStore = useMapPointsStore();
const { mapPoints, isLoading } = storeToRefs(mapPointsStore);
const point_ID = route.params._id;

const mapPoint = computed(() => {
  return mapPoints.value.find(point => point?._id?.toString() === point_ID);
});

const onDelete = () => {
  const pointToDelete = mapPoints.value.find(point => point?._id?.toString() === point_ID);

  if (pointToDelete && pointToDelete._id) {
    mapPointsStore.removePoint(pointToDelete._id.toString());
  } else {
    console.error('Point or point._id is undefined or null');
  }
};



</script>

<style scoped>
/* Add your component-specific styles here */
</style>
