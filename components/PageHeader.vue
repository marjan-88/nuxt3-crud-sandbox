<template>
     <div class="wrapper-primary">
          <header  class="flex justify-between py-6 text-lg">
               <nav class="px-2">
                    <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="mr-4"
                         :class="{ 'active': isActive(link.to) }">
                         {{ link.label }}
                    </NuxtLink>
               </nav>
               <div class="flex content-center">
                    <span class="mr-4 flex items-center">
                         <el-icon class="mx-2">
                              <ElIconUser />
                         </el-icon>
                         <span>
                              { {{ (data?.user as any).name }} }               
                         </span>
                    </span>
                    
                    <el-button class="ml-auto text-lg" type="primary"  @click="logOut">Log out</el-button>
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
     color: $blue;
}
</style>
   