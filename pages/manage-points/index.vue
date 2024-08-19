
<template>
     <div class="h-full wrapper-medium ">
          <div class="flex flex-col p-2 h-full mb-8 " v-if="!isLoading">
               <div v-if="mapPoints.length <= 0">
                    <h2>No content found</h2>
               </div>
               <div v-else>
                    <div>
                         <div class="mb-8">                              
                              <div class="card-header mb-4">
                                   <h2 class="font-semibold ">List of points: <span>{{ originalMapPointsLength }}</span></h2>
                              </div>
                              <div class="flex gap-4 items-center justify-between  mb-4">
                                   <el-button type="primary" class="w-max " @click="dialogVisible = true">
                                        Add point
                                        <el-icon class="ml-2">
                                             <ElIconPlus />
                                        </el-icon>
                                   </el-button>
                                   <el-input v-model="searchInput" class="" placeholder="Search" clearable @input="handlePointsFilter"
                                        :prefix-icon="Search" />
     
                              </div>
                         </div>
                         <ul class="grid grid-cols-1 divide-y bg-white rounded-md shadow-md" v-auto-animate>
                              <li v-for="marker in filteredMapPoints" :key="marker._id?.toString()"
                                   class="flex align-center hover:bg-gray-50 p-2">
                                   <NuxtLink class="p-2 w-full" :to="`/manage-points/${marker._id}`">
                                        {{ marker.name }} ({{ marker.city }})
                                   </NuxtLink>
                              </li>
                         </ul>
                    </div>
               </div>


          </div>
          <div v-else>
               <LoadingSpinner />
          </div>

          <ModalPrimary title="Add Point" :isForm="true" v-model:isVisible="dialogVisible" @opened="handleChildDialogOpened">
               <AddPointForm :dialogVisible="dialogVisible" @form-submitted="onCancel" />
          </ModalPrimary>


     </div>
</template>

<script setup lang="ts">
import { ElButton, ElIcon } from 'element-plus'
import { storeToRefs } from 'pinia';
import { useMapPointsStore } from '~/stores/MapPointsStore';
import { Search } from '@element-plus/icons-vue';

definePageMeta({
     middleware: 'auth'
})

const mapPointsStore = useMapPointsStore();
const {
     mapPoints,
     isLoading
} = storeToRefs(mapPointsStore);
const searchInput = ref('');
const filteredMapPoints = ref(mapPoints.value);
const handlePointsFilter = useDebounceFn(() => {
    filteredMapPoints.value = mapPoints.value.filter(marker => {
        const name = marker.name.toLowerCase();
        const city = marker.city.toLowerCase();
        const searchTerm = searchInput.value.toLowerCase();
        return name.includes(searchTerm) || city.includes(searchTerm);
    });
}, 500);

console.log(mapPointsStore.mapPoints);

const dialogVisible = ref(false);//trigger visibility
const onCancel = () => {
     dialogVisible.value = false;
}

const handleChildDialogOpened = () => {
     console.log('Child component is opened! - parent');
}

const originalMapPointsLength = ref(mapPoints.value.length);

// Watch for changes in mapPoints
watch(mapPoints, (newMapPoints, oldMapPoints) => {
    // Check if the length of mapPoints has increased
    if (newMapPoints.length > oldMapPoints.length) {
        // Update filteredMapPoints with the new mapPoints
        filteredMapPoints.value = newMapPoints;
        console.log('new mappoints', newMapPoints);
    } 
});


</script>

<style scoped lang="scss"></style>
