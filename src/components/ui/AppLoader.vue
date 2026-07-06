<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['done'])

const visible = ref(true)
const hiding = ref(false)
const fill = ref(0)

onMounted(() => {
  const minMs = 1400
  const start = Date.now()

  const fillTween = () => {
    if (fill.value < 100) {
      fill.value = Math.min(100, fill.value + 1.8)
      requestAnimationFrame(fillTween)
    }
  }
  requestAnimationFrame(fillTween)

  const finish = () => {
    const wait = Math.max(0, minMs - (Date.now() - start))
    window.setTimeout(() => {
      fill.value = 100
      hiding.value = true
      window.setTimeout(() => {
        visible.value = false
        emit('done')
      }, 550)
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
      class="loader-screen fixed inset-0 z-[300] flex flex-col items-center justify-center"
      :class="hiding && 'loader-out'"
      aria-live="polite"
      aria-label="Cargando Orita"
    >
      <div class="loader-bottle relative mb-8 h-44 w-24 md:h-52 md:w-28">
        <svg viewBox="0 0 80 200" class="h-full w-full" aria-hidden="true">
          <defs>
            <clipPath id="loader-liquid-clip">
              <rect :x="0" :y="200 - fill * 1.6" width="80" :height="fill * 1.6" />
            </clipPath>
          </defs>
          <path
            d="M28 8h24l4 28h12l-8 36v108c0 8-6 14-14 14H34c-8 0-14-6-14-14V72L12 36h12L28 8z"
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            stroke-width="2"
          />
          <path
            d="M28 8h24l4 28h12l-8 36v108c0 8-6 14-14 14H34c-8 0-14-6-14-14V72L12 36h12L28 8z"
            fill="rgba(255,255,255,0.85)"
            clip-path="url(#loader-liquid-clip)"
          />
        </svg>
      </div>
      <img
        src="/images/logo_header.png"
        alt="Orita"
        class="h-8 w-auto brightness-0 invert opacity-90 md:h-10"
      />
      <p class="mt-3 font-body text-xs tracking-[0.35em] text-white/70 uppercase">
        {{ Math.round(fill) }}%
      </p>
    </div>
  </Transition>
</template>

<style scoped>
.loader-screen {
  background: linear-gradient(165deg, #1a5c54 0%, #4aab9e 45%, #2a7a72 100%);
}

.loader-bottle {
  filter: drop-shadow(0 24px 48px rgba(0, 0, 0, 0.25));
}

.loader-out {
  opacity: 0;
  transition: opacity 0.55s ease;
}

.loader-fade-leave-active {
  transition: opacity 0.55s ease;
}

.loader-fade-leave-to {
  opacity: 0;
}
</style>
