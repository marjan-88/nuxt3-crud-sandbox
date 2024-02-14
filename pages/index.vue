<template>
  <section class="flex flex-col flex-1 ">
       <div class="wrapper-primary ">
            <div class="flex flex-col bg-white mt-10 p-4 rounded-md shadow-md">
             <p>Hello. This is an application I made to get to know Nuxt3 better.</p>
             <p>Stack I have used:</p>
             <ul class="list-disc px-4">
              <li>Nuxt3</li>
              <li>Pinia</li>
              <li>Typescript</li>
              <li>MongoDB/Mongoose</li>
              <li>Element Pus</li>
              <li>Tailwind</li>
             </ul>
            </div>

       </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
</script>

<style scoped></style>