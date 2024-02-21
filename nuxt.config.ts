// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: {
		enabled: true,
	},
	app: {
		  pageTransition: { name: 'page', mode: 'out-in' },
	},
	runtimeConfig: {
		authSecret: process.env.AUTH_SECRET,
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
		"@pinia/nuxt",
		"@element-plus/nuxt",
		"@nuxtjs/tailwindcss",
		"nuxt-mongoose",
		"@sidebase/nuxt-auth",
		'nuxt3-leaflet',
		'@formkit/auto-animate/nuxt',
		'@vueuse/nuxt'
	],
	mongoose: {
		uri: process.env.MONGODB_URI,
		modelsDir: "models",
	},
	auth: {
		baseURL: process.env.AUTH_ORIGIN,
		provider: {
			type: "authjs",
		},
	},
	pinia: {
		storesDirs: ["~/stores/**"],
	},
});
