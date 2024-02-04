// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
     pageTransition: { name: 'page', mode: 'out-in' }, 
   },
  vite: {
     css: {
         preprocessorOptions: {
             scss: {
                 additionalData: '@import "@/assets/scss/main.scss";',
             },
         },
     },
 },
  modules: [
     '@pinia/nuxt',
     '@element-plus/nuxt',
     '@nuxtjs/tailwindcss',
     "nuxt-mongoose",
  ],
  mongoose: {
     uri: process.env.MONGODB_URI,
     modelsDir: 'models',
  },
  pinia: {
     storesDirs: ['~/stores/**'],
   },
   
})
