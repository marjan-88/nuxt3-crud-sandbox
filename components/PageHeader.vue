<template>
     <div class="wrapper-primary">
          <header class="p-2 mb-8">
               <nav>
                    <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="mr-2"
                         :class="{ 'active': isActive(link.to) }">
                         {{ link.label }}
                    </NuxtLink>
               </nav>
          </header>
     </div>
</template>
   
<script setup lang="ts">
const route = useRoute();
const isActive = (path: string) => {
     return path === '/' ? route.path === path : route.path.startsWith(path);
};

const links = [
     { to: '/', label: 'Home' },
     { to: '/map', label: 'Map' },
     { to: '/contact', label: 'Contact' },
];
</script>
   
<style scoped lang="scss">
.active {
     color: $orange;
}
</style>
   