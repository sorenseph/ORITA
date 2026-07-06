<script setup>
import { ref, onMounted } from 'vue'
import LottieIcon from './LottieIcon.vue'

const emit = defineEmits(['done'])

const visible = ref(true)
const hiding = ref(false)

onMounted(() => {
  const minMs = 1200
  const start = Date.now()

  const finish = () => {
    const wait = Math.max(0, minMs - (Date.now() - start))
    window.setTimeout(() => {
      hiding.value = true
      window.setTimeout(() => {
        visible.value = false
        emit('done')
      }, 500)
    }, wait)
  }

  if (document.readyState === 'complete') finish()
  else window.addEventListener('load', finish, { once: true })
})
</script>

<template>
  <Transition name="loader-fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[#4AAB9E]"
      :class="hiding && 'loader-out'"
      aria-live="polite"
      aria-label="Cargando Orita"
    >
      <div class="loader-bottle mb-6 h-40 w-40 md:h-52 md:w-52">
        <LottieIcon src="/littiefile-json/Loading.json" :speed="1.1" />
      </div>
      <img
        src="/images/logo_header.png"
        alt="Orita"
        class="h-8 w-auto brightness-0 invert opacity-90 md:h-10"
      />
    </div>
  </Transition>
</template>

<style scoped>
.loader-bottle {
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.2));
}
.loader-out {
  opacity: 0;
  transition: opacity 0.5s ease;
}
.loader-fade-leave-active {
  transition: opacity 0.5s ease;
}
.loader-fade-leave-to {
  opacity: 0;
}
</style>
