<template>
<main>
     <NuxtLayout >            
          <PageHeader v-if="isAuthenticated" />   
          <NuxtPage ></NuxtPage>
     </NuxtLayout>
</main>
     
</template>
<script setup lang="ts">
import { useMapPointsStore } from '~/stores/MapPointsStore';
const mapPointsStore = useMapPointsStore();
const { status } = useAuth();
const isAuthenticated = computed(() => status.value === 'authenticated' ? true : false);
console.log('is authenticated ?',isAuthenticated.value);


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
     filter: blur(3px);

}

.page-enter-from,
.page-leave-to {
     opacity: 0;
     filter: blur(0);
}
</style>