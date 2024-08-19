<template>
  <section class="flex-1">
    <div v-if="!errorCode" class="wrapper-medium">
      <h2 class="text-lg font-medium mt-12 mb-8">Hello.</h2>
      <div class="flex flex-col bg-white p-6 rounded-md shadow-md">
        <p>This is an application I made to get to know Nuxt3 better.</p>
        <p>Stack I have used:</p>
        <ul class="list-disc flex flex-col gap-y-2 px-4 mt-2">
          <li>Nuxt3</li>
          <li>Pinia</li>
          <li>Typescript</li>
          <li>MongoDB/Mongoose</li>
          <li>Element Pus</li>
          <li>Tailwind</li>
        </ul>
      </div>
    </div>
    <div v-else>
      Coś się odjaniepawliło
    </div>
  </section>
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: "auth",
  });
  const route = useRoute();
  const errorCode = computed(() => route.params.error);
</script>

<style scoped></style>