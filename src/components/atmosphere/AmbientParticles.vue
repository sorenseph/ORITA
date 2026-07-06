<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useWindowSize, usePreferredReducedMotion } from '@vueuse/core'
import { useThemeStore } from '../../stores/theme'
import { getAtmosphere } from '../../data/atmosphere'
import gsap from 'gsap'

const props = defineProps({
  density: { type: Number, default: 1 },
  hues: { type: Array, default: null },
  wind: { type: Number, default: null },
})

const canvasRef = ref(null)
const theme = useThemeStore()
const { activeFlavor } = storeToRefs(theme)
const { width } = useWindowSize()
const reduced = usePreferredReducedMotion()

const isMobile = computed(() => width.value < 768)
const atmo = computed(() => getAtmosphere(activeFlavor.value.id))
const particleHues = computed(() => props.hues || atmo.value.particleHues)
const particleWind = computed(() => props.wind ?? atmo.value.wind)

let ctx = null
let particles = []
let animationId = null

function count() {
  const base = isMobile.value ? 18 : 40
  return Math.round(base * props.density)
}

function spawn(w, h) {
  const hues = particleHues.value
  particles = Array.from({ length: count() }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: Math.random() * 4 + 1.5,
    speedX: (Math.random() - 0.5) * 0.2 * particleWind.value,
    speedY: -(Math.random() * 0.25 + 0.06),
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.3 + Math.random() * 0.4,
    opacity: Math.random() * 0.22 + 0.06,
    hue: hues[Math.floor(Math.random() * hues.length)],
    phase: Math.random() * Math.PI * 2,
  }))
}

function draw(t) {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return
  const w = canvas.offsetWidth
  const h = canvas.offsetHeight
  ctx.clearRect(0, 0, w, h)

  const time = t * 0.001
  particles.forEach((p) => {
    p.wobble += 0.008 * p.wobbleSpeed
    p.x += p.speedX + Math.sin(time * p.wobbleSpeed + p.phase) * 0.15
    p.y += p.speedY
  if (p.y < -12) {
      p.y = h + 12
      p.x = Math.random() * w
    }
    if (p.x < -12) p.x = w + 12
    if (p.x > w + 12) p.x = -12

    const alpha = p.opacity * (0.7 + Math.sin(time * 2 + p.phase) * 0.3)
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${p.hue}, 72%, 68%, ${alpha})`
    ctx.fill()
  })

  animationId = requestAnimationFrame(draw)
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  const dpr = Math.min(devicePixelRatio, isMobile.value ? 1 : 1.5)
  canvas.width = canvas.offsetWidth * dpr
  canvas.height = canvas.offsetHeight * dpr
  ctx = canvas.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  spawn(canvas.offsetWidth, canvas.offsetHeight)
}

watch(particleHues, (hues) => {
  particles.forEach((p) => {
    p.hue = hues[Math.floor(Math.random() * hues.length)]
  })
})

onMounted(() => {
  if (reduced.value) return
  resize()
  window.addEventListener('resize', resize)
  animationId = requestAnimationFrame(draw)
  gsap.from(canvasRef.value, { opacity: 0, duration: 2, ease: 'power2.out' })
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <canvas
    v-if="!reduced"
    ref="canvasRef"
    class="atmosphere-particles pointer-events-none absolute inset-0 h-full w-full"
    aria-hidden="true"
  />
</template>
