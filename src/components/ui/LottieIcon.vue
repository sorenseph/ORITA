<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import lottie from 'lottie-web'

const props = defineProps({
  src: { type: String, required: true },
  loop: { type: Boolean, default: true },
  autoplay: { type: Boolean, default: true },
  speed: { type: Number, default: 1 },
})

const containerRef = ref(null)
let anim = null

function load() {
  if (!containerRef.value || !props.src) return
  anim?.destroy()
  anim = lottie.loadAnimation({
    container: containerRef.value,
    renderer: 'svg',
    loop: props.loop,
    autoplay: props.autoplay,
    path: props.src,
  })
  anim.setSpeed(props.speed)
}

onMounted(load)
watch(() => props.src, load)
onUnmounted(() => anim?.destroy())
</script>

<template>
  <div ref="containerRef" class="lottie-host" aria-hidden="true" />
</template>

<style scoped>
.lottie-host :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
