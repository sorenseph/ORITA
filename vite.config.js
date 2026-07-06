import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('gsap')) return 'gsap'
          if (id.includes('lenis')) return 'lenis'
          if (id.includes('three')) return 'three'
          if (id.includes('lottie')) return 'lottie'
          if (id.includes('node_modules/vue') || id.includes('node_modules/pinia') || id.includes('vue-i18n')) return 'vendor'
        },
      },
    },
  },
})
