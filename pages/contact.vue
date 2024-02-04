<template>
     <div>
          Contact
          <el-button
               class="transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"
               @click="dialogVisible = true">
               click to open the Dialog
          </el-button>
          <ModalPrimary title="Contact Dialog" v-model:isVisible="dialogVisible" :isForm="false"
               @update:isVisible="handleDialogVisibility">
               kaktus
               <p>kapeć</p>
          </ModalPrimary>

     </div>
</template>

<script setup lang="ts">
// Pobierz wszystkie dane



onMounted(() => {
     console.log('Contact mounted');
})
const dialogVisible = ref(false);

const handleDialogVisibility = (value: boolean) => {
     dialogVisible.value = value;
};

</script>

<style scoped></style>~/server/models/point-model