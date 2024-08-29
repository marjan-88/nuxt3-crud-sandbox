<template>
     <div class="wrapper-medium">
          <el-page-header class="my-8" @back="$router.back()">
               <template #content>
                    <span class="text-large font-600 "> Map - point details </span>
               </template>
          </el-page-header>
          <div class="p-2 bg-white rounded-md shadow-md" v-if="!isLoading">
               <!-- <h2 class="p-2" v-if="mapPoint === undefined || null">No content found</h2> -->
               <h2 class="p-2" v-if="!mapPoint">No content found</h2>
               <div v-else>
                    <div class="flex flex-col gap-y-4 p-6">
                         <p>Name: {{ mapPoint?.name }}</p>
                         <p>Name: {{ mapPoint?.city }}</p>
                         <p>Latitude: {{ mapPoint?.lat }}</p>
                         <p>Longtitude: {{ mapPoint?.lng }}</p>
                         <p>Content: {{ mapPoint?.content }}</p>
                         <p>Category: {{ mapPoint?.category?.toString() }}</p>
                         <p>Rating: {{ mapPoint?.rating }}</p>
                         <p>Created At: {{ mapPoint?.createdAt }}</p>
                         <p>Updated At: {{ mapPoint?.updatedAt }}</p>
                         <p>Point created by: {{ mapPoint?.createdBy }}</p>
                    </div>
                    <div class="p-6">
                         <el-button class="w-max" type="danger" @click="onDelete">
                              Delete point
                              <el-icon class="ml-2">
                                   <ElIconDelete />
                              </el-icon>
                         </el-button>
                         <!-- <el-button class="w-max" type="success" @click="onEdit"> -->
                         <el-button class="w-max" type="success" @click="isOpened = true">
                              Edit point
                              <el-icon class="ml-2">
                                   <ElIconEdit />
                              </el-icon>
                         </el-button>
                    </div>

               </div>
          </div>
          <div v-else>
               <LoadingSpinner />
          </div>
      
          <EditPointModal 
               :editedPoint="mapPoint!" 
               v-model:dialogVisible="isOpened" 
               @form-submitted="onCancel" 
               @modal-closed="onCancel" 
          />
     </div>
</template>

<script setup lang="ts">
// import type { MapPoint } from '~/types/MapPoint';
import { computed } from 'vue';
import { useMapPointsStore } from '~/stores/MapPointsStore';
import EditPointModal from '~/components/modals/EditPointModal.vue';
const route = useRoute();
const router = useRouter();
const mapPointsStore = useMapPointsStore();
const { mapPoints, isLoading } = storeToRefs(mapPointsStore);
const point_ID = route.params._id;
// const isEditing = ref<boolean>(false);
let isOpened = ref(false);//trigger visibility

const mapPoint = computed(() => {
     return mapPoints.value.find(point => point?._id?.toString() === point_ID);
});
// console.log('Parent mapPoint', mapPoint);
// const pointInfo = mapPoint.value ?? null;
// console.log('mapPoint !!!', pointInfo);

const onDelete = () => {
     const pointToDelete = mapPoints.value.find(point => point?._id?.toString() === point_ID);
     if (pointToDelete) {
          ElMessageBox.confirm('Are you sure to delete this point permanently?')
               .then(() => {
                    const idToDelete = pointToDelete._id!.toString();
                    if (idToDelete) {
                         mapPointsStore.removePoint(idToDelete);
                         router.push('/manage-points');
                    }
               })
               .catch((e) => {
                    console.error('coś nie działa z usuwaniem:', e);
                    // catch error
               });
     }
};
const onEdit = () => {
     const pointToEdit = mapPoints.value.find(point => point?._id?.toString() === point_ID);
     if (pointToEdit) {
          isOpened.value = true;      
     }
}
const onCancel = () => {
     isOpened.value = false;
}

//TODO: add date formatter
</script>

<style scoped></style>
