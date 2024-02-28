<template>
     <div class="wrapper-primary">
          <header  class="flex justify-between p-4 ">
               <nav>
                    <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="mr-2"
                         :class="{ 'active': isActive(link.to) }">
                         {{ link.label }}
                    </NuxtLink>
               </nav>
               <div>
                    Hello, {{ (data?.user as any).name || (data?.user as any).name }}
                    <el-button class=" ml-auto" type="warning" @click="logOut">Log out</el-button>
               </div>
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
     { to: '/manage-points', label: 'Manage points' },
     // { to: '/contact', label: 'Contact' },
];

const { data, signOut } = useAuth();

console.log('Data', data.value?.user);


const logOut = async() => {
  await signOut();
}
</script>
   
<style scoped lang="scss">
.active {
     color: $orange;
}
</style>
   