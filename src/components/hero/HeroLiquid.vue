<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '../../stores/theme'

const props = defineProps({
  scrollProgress: { type: Number, default: 0 },
})

const containerRef = ref(null)
const theme = useThemeStore()
const { activeFlavor } = storeToRefs(theme)

let renderer = null
let scene = null
let camera = null
let blobs = []
let animationId = null
let THREE = null

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16)
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 }
}

async function initThree() {
  THREE = await import('three')
  const el = containerRef.value
  if (!el) return

  const w = el.clientWidth
  const h = el.clientHeight

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
  camera.position.z = 5

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  el.appendChild(renderer.domElement)

  const rgb = hexToRgb(activeFlavor.value.liquid || activeFlavor.value.primary)

  blobs = Array.from({ length: 4 }, (_, i) => {
    const geo = new THREE.SphereGeometry(0.8 + i * 0.15, 32, 32)
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(rgb.r, rgb.g, rgb.b),
      transparent: true,
      opacity: 0.12 + i * 0.04,
      roughness: 0.2,
      metalness: 0,
      transmission: 0.6,
      thickness: 1.5,
      clearcoat: 0.3,
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(
      (Math.random() - 0.5) * 2.5,
      (Math.random() - 0.5) * 1.5,
      -1 - i * 0.5
    )
    mesh.userData = {
      phase: Math.random() * Math.PI * 2,
      speed: 0.15 + i * 0.05,
      baseX: mesh.position.x,
      baseY: mesh.position.y,
    }
    scene.add(mesh)
    return mesh
  })

  animate()
}

function updateColors(hex) {
  if (!THREE || !blobs.length) return
  const rgb = hexToRgb(hex)
  blobs.forEach((mesh, i) => {
    mesh.material.color.setRGB(rgb.r, rgb.g, rgb.b)
    mesh.material.opacity = 0.12 + i * 0.04
  })
}

function animate() {
  animationId = requestAnimationFrame(animate)
  const t = performance.now() * 0.001
  const scroll = props.scrollProgress

  blobs.forEach((mesh) => {
    const { phase, speed, baseX, baseY } = mesh.userData
    mesh.position.x = baseX + Math.sin(t * speed + phase) * 0.4
    mesh.position.y = baseY + Math.cos(t * speed * 0.8 + phase) * 0.3 + scroll * 0.5
    mesh.scale.setScalar(1 + Math.sin(t * 0.5 + phase) * 0.08)
    mesh.rotation.y = t * 0.1
  })

  if (renderer && scene && camera) renderer.render(scene, camera)
}

function onResize() {
  const el = containerRef.value
  if (!el || !renderer || !camera) return
  const w = el.clientWidth
  const h = el.clientHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
}

watch(activeFlavor, (f) => updateColors(f.liquid || f.primary))

watch(() => props.scrollProgress, () => {})

onMounted(() => {
  initThree()
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResize)
  if (renderer) {
    renderer.dispose()
    renderer.domElement?.remove()
  }
})
</script>

<template>
  <div
    ref="containerRef"
    class="pointer-events-none absolute inset-0 z-[1] opacity-70 mix-blend-soft-light"
    aria-hidden="true"
  />
</template>
