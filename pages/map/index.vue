
<template>
     <div class="h-full">

          <!-- <el-page-header class="mb-4" @back="$router.back()">
               <template #content>
                    <span class="text-s font-600 mr-3 "> Map </span>
               </template>
          </el-page-header> -->
          <div class="flex flex-col p-2 h-full wrapper-primary" v-if="!isLoading">
               <div v-if="mapPoints.length <= 0">
                    <h2>No content found</h2>
               </div>
               <div v-else>
                    <div>
                         <div class="card-header">
                              <h2 class="font-semibold mb-4">List of points: <span>{{ count }}</span></h2>
                         </div>
                         <el-button type="primary" class="w-max mb-4 " @click="dialogVisible = true">
                              Add point
                              <el-icon class="ml-2">
                                   <ElIconPlus />
                              </el-icon>
                         </el-button>
                         <ul class="grid grid-cols-1 divide-y bg-white rounded-md shadow-md" >
                              <li v-for="marker in mapPoints" :key="marker._id?.toString()" class="flex align-center hover:bg-gray-50 p-2">
                                   <NuxtLink class="p-2 w-full" :to="`/map/${marker._id}`">
                                        {{ marker.name }}
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

definePageMeta({
  middleware: 'auth'
})

const mapPointsStore = useMapPointsStore();
const {
     mapPoints,
     count,
     isLoading
} = storeToRefs(mapPointsStore);

const dialogVisible = ref(false);//trigger visibility
const onCancel = () => {
     dialogVisible.value = false;
}

const handleChildDialogOpened = () => {
     console.log('Child component is opened! - parent');
}




</script>

<style scoped lang="scss"></style>
