<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useMouse } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '../../stores/theme'

const props = defineProps({
  modelUrl: { type: String, default: '/models/orita-bottle.glb' },
  scrollProgress: { type: Number, default: 0 },
})

const emit = defineEmits(['ready', 'error'])

const containerRef = ref(null)
const { activeFlavor } = storeToRefs(useThemeStore())
const { x: mouseX, y: mouseY } = useMouse()

let renderer = null
let scene = null
let camera = null
let model = null
let animationId = null
let THREE = null
let resizeObserver = null

function getMouseOffset() {
  const cx = typeof window !== 'undefined' ? window.innerWidth / 2 : 0
  const cy = typeof window !== 'undefined' ? window.innerHeight / 2 : 0
  return {
    dx: (mouseX.value - cx) / cx,
    dy: (mouseY.value - cy) / cy,
  }
}

async function init() {
  const el = containerRef.value
  if (!el) return

  THREE = await import('three')
  const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js')

  const w = el.clientWidth || 400
  const h = el.clientHeight || 500

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(32, w / h, 0.1, 100)
  camera.position.set(0, 0.2, 4.2)

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1
  el.appendChild(renderer.domElement)

  const ambient = new THREE.AmbientLight(0xffffff, 0.85)
  const key = new THREE.DirectionalLight(0xfff8ee, 1.4)
  key.position.set(3, 5, 4)
  const fill = new THREE.DirectionalLight(0x88c4ff, 0.45)
  fill.position.set(-4, 1, 2)
  const rim = new THREE.DirectionalLight(0xffffff, 0.6)
  rim.position.set(0, 2, -3)
  scene.add(ambient, key, fill, rim)

  const loader = new GLTFLoader()
  loader.load(
    props.modelUrl,
    (gltf) => {
      model = gltf.scene
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 2.4 / maxDim
      model.scale.setScalar(scale)
      model.position.sub(center.multiplyScalar(scale))
      model.position.y -= 0.15
      scene.add(model)
      emit('ready')
      animate()
    },
    undefined,
    (err) => {
      console.warn('[HeroBottle3D] No se pudo cargar el modelo:', props.modelUrl, err)
      emit('error')
    },
  )

  resizeObserver = new ResizeObserver(onResize)
  resizeObserver.observe(el)
}

function animate() {
  animationId = requestAnimationFrame(animate)
  if (!model || !renderer) return

  const t = performance.now() * 0.001
  const { dx, dy } = getMouseOffset()

  model.rotation.y = dx * 0.55 + t * 0.18
  model.rotation.x = -dy * 0.18 + Math.sin(t * 0.9) * 0.04
  model.position.y = Math.sin(t * 1.1) * 0.06 - props.scrollProgress * 0.15

  renderer.render(scene, camera)
}

function onResize() {
  const el = containerRef.value
  if (!el || !renderer || !camera) return
  const w = el.clientWidth
  const h = el.clientHeight
  if (!w || !h) return
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
}

watch(() => props.scrollProgress, () => {})

onMounted(init)

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  resizeObserver?.disconnect()
  if (model) {
    model.traverse((child) => {
      if (child.isMesh) {
        child.geometry?.dispose()
        const mats = Array.isArray(child.material) ? child.material : [child.material]
        mats.forEach((m) => m?.dispose())
      }
    })
  }
  renderer?.dispose()
  renderer?.domElement?.remove()
})
</script>

<template>
  <div ref="containerRef" class="h-full w-full max-h-full min-h-0" />
</template>
