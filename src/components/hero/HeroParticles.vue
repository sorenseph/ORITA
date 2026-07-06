<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const canvasRef = ref(null)
let animationId = null
let particles = []
let resizeHandler = null

function initParticles(width, height) {
  particles = Array.from({ length: 35 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 5 + 2,
    speedX: (Math.random() - 0.5) * 0.25,
    speedY: Math.random() * 0.35 + 0.08,
    opacity: Math.random() * 0.25 + 0.08,
    hue: [28, 38, 350, 15][Math.floor(Math.random() * 4)],
  }))
}

function draw(ctx, width, height) {
  ctx.clearRect(0, 0, width, height)
  particles.forEach((p) => {
    p.x += p.speedX
    p.y -= p.speedY
    if (p.y < -10) {
      p.y = height + 10
      p.x = Math.random() * width
    }
    if (p.x < -10) p.x = width + 10
    if (p.x > width + 10) p.x = -10

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${p.hue}, 75%, 72%, ${p.opacity})`
    ctx.fill()

    ctx.beginPath()
    ctx.arc(p.x - p.size * 0.2, p.y - p.size * 0.2, p.size * 0.35, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${p.hue}, 40%, 95%, ${p.opacity * 0.6})`
    ctx.fill()
  })
  animationId = requestAnimationFrame(() => draw(ctx, width, height))
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  const resize = () => {
    canvas.width = canvas.offsetWidth * devicePixelRatio
    canvas.height = canvas.offsetHeight * devicePixelRatio
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    initParticles(canvas.offsetWidth, canvas.offsetHeight)
  }

  resizeHandler = resize
  resize()
  window.addEventListener('resize', resize)
  draw(ctx, canvas.offsetWidth, canvas.offsetHeight)
  gsap.from(canvas, { opacity: 0, duration: 2.5, delay: 0.5, ease: 'power2.out' })
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
})
</script>

<template>
  <canvas ref="canvasRef" class="pointer-events-none absolute inset-0 z-[3] h-full w-full" aria-hidden="true" />
</template>
