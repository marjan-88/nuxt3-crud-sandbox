<template>
    <div class="h-screen flex justify-center items-center">
        <div class="text-center">
            <h1 class="text-3xl font-bold mb-4">
                You have been succesfully logged out.
            </h1>
            <button class="bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                @click="$router.push('/register')">Back to login page</button>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' }
})
// Remember to disable the middleware protection from your page!
</script>