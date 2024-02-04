
<template>
     <div class="h-full">
          <el-page-header class="mb-4" @back="$router.back()">
               <template #content>
                    <span class="text-large font-600 mr-3 "> Map </span>
               </template>

          </el-page-header>
          <div class="flex flex-col p-2 h-full" v-if="!isLoading">
               <div v-if="mapPoints.length <= 0">
                    <h2>No content found</h2>
               </div>
               <div v-else>
                    <el-card class="box-card">
                         <template #header>
                              <div class="card-header">
                                   <h2 class="text-lg mb-4">List of points:</h2>

                              </div>
                         </template>
                         <ul v-for="marker in mapPoints" :key="marker._id?.toString()" class="text item">
                              <li>
                                   <NuxtLink class="p-2 mb-2" :to="`/map/${marker._id}`">
                                        {{ marker.name }}
                                   </NuxtLink>
                              </li>
                         </ul>
                         <template #footer>
                              <el-button class="w-max" @click="dialogVisible = true">
                                   Add point
                                   <el-icon class="ml-2">
                                        <ElIconPlus />
                                   </el-icon>
                              </el-button>
                         </template>
                    </el-card>

               </div>
              
               <code style="display: block;" class="mt-auto">
                count: {{ count }}
                <br>                                              
                points:{{ mapPoints }}
               </code>
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
     // Do something when the child component emits the 'opened' event
}




</script>

<style scoped lang="scss"></style>
