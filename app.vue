<template>
<main>

     <NuxtLayout >
          <PageHeader />          
          <NuxtPage class="wrapper-primary p-2" />
     </NuxtLayout>
</main>
     
</template>
<script setup lang="ts">
import { useMapPointsStore } from '~/stores/MapPointsStore';
const mapPointsStore = useMapPointsStore();

onMounted(() => {
     mapPointsStore.fetchPoints();
})

useHead({
  title: 'Simple crud app',
  meta: [
    { name: 'description', content: 'My amazing site.' }
  ],
  bodyAttrs: {
    class: 'c-app'
  },
})

</script>
<style lang="scss">
.page-enter-active,
.page-leave-active {
     transition: all 0.2s linear;
}

.page-enter-from,
.page-leave-to {
     opacity: 0;
     filter: grayscale(1);
}
</style>