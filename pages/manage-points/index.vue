
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
                                   <h2 class="font-semibold ">List of points: <span>{{ count }}</span></h2>
                              </div>
                              <div class="flex gap-4 items-center justify-between  mb-4">
                                   <el-button 
                                        type="primary" 
                                        class="w-max " 
                                        @click="handleAddPointModal"
                                   >                                  
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
     
          <!-- <AddPointModal 
               title="Add Point" 
               :dialogVisible ="isAddPointModalOpened"
               @form-submitted="isAddPointModalOpened = false"
               @closed="isAddPointModalOpened = false"
          /> -->
          <AddPointModal 
               title="Add Point"               
               @form-submitted="isAddPointModalOpened = false"
               @closed="isAddPointModalOpened = false"
          />
     </div>
</template>

<script setup lang="ts">
import { ElButton, ElIcon } from 'element-plus'
import { storeToRefs } from 'pinia';
import { useMapPointsStore } from '~/stores/MapPointsStore';
import { Search } from '@element-plus/icons-vue';
import AddPointModal from '~/components/modals/AddPointModal.vue';
const isAddPointModalOpened = useState('isAddPointModalOpened');

definePageMeta({
     middleware: 'auth'
})

const mapPointsStore = useMapPointsStore();
const {
     count,
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

const handleAddPointModal = ()=> {
     return isAddPointModalOpened.value = true
     console.log('(manage-points.vue) add point btn', isAddPointModalOpened.value );
}


// Watch for changes in mapPoints
watch(mapPoints, (newMapPoints, oldMapPoints) => {
    // Check if the length of mapPoints has increased
    if (newMapPoints.length > oldMapPoints.length) {
        // Update filteredMapPoints with the new mapPoints
        filteredMapPoints.value = newMapPoints;
     //    console.log('new mappoints', newMapPoints);
    } 
});


</script>

<style scoped lang="scss"></style>
