<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '../../stores/theme'
import { useLocalizedFlavors } from '../../composables/useLocalizedContent'
import { useOrganicMotion } from '../../composables/useOrganicMotion'
import { useMouseDepth } from '../../composables/useMouseDepth'
import { useBottlePresence } from '../../composables/useBottlePresence'
import HeroBottle3D from './HeroBottle3D.vue'
import HeroCondensation from './HeroCondensation.vue'
import BottleWaterSheen from './BottleWaterSheen.vue'
import gsap from 'gsap'

const props = defineProps({
  scrollProgress: { type: Number, default: 0 },
})

const theme = useThemeStore()
const { activeFlavorIndex, activeFlavor } = storeToRefs(theme)
const localizedFlavors = useLocalizedFlavors()
const { width } = useWindowSize()
const { parallax, mx, my } = useMouseDepth()
const { killAll } = useOrganicMotion()

const parallaxRef = ref(null)
const tiltRef = ref(null)
const floatRef = ref(null)
const backRef = ref(null)
const frontRef = ref(null)
const backMirrorRef = ref(null)
const frontMirrorRef = ref(null)
const show3d = ref(false)

const isMobile = computed(() => width.value < 768)
const current = computed(() => localizedFlavors.value[activeFlavorIndex.value])

const parallaxStyle = computed(() => {
  const scrollY = isMobile.value ? 0 : -props.scrollProgress * 24
  const depth = parallax(1.2)
  const transform = depth.transform === 'none'
    ? `translate3d(0, ${scrollY}px, 0)`
    : `${depth.transform} translate3d(0, ${scrollY}px, 0)`
  return { transform }
})

const glowStyle = computed(() => ({
  background: `radial-gradient(ellipse 75% 65% at ${50 + mx.value * 8}% ${58 + my.value * 5}%, ${activeFlavor.value.primary}45, transparent 72%)`,
  transform: parallax(0.4).transform,
}))

let transitionTween = null
let ready = false

function bottleRest() {
  return isMobile.value
    ? { back: { x: -10, rotation: -6, opacity: 0.45 }, front: { x: 6, rotation: 3, opacity: 1 } }
    : { back: { x: -16, rotation: -7, opacity: 0.5 }, front: { x: 8, rotation: 4, opacity: 1 } }
}

function setBottleRest() {
  if (!backRef.value || !frontRef.value) return
  const rest = bottleRest()
  gsap.set(backRef.value, rest.back)
  gsap.set(frontRef.value, rest.front)
  if (backMirrorRef.value) gsap.set(backMirrorRef.value, { ...rest.back, opacity: rest.back.opacity * 0.4 })
  if (frontMirrorRef.value) gsap.set(frontMirrorRef.value, { ...rest.front, opacity: rest.front.opacity * 0.35 })
}

function playFlavorTransition() {
  if (!ready || !backRef.value || !frontRef.value) return

  transitionTween?.kill()
  const targets = [backRef.value, frontRef.value, backMirrorRef.value, frontMirrorRef.value].filter(Boolean)
  gsap.killTweensOf(targets)

  const rest = bottleRest()
  const fromX = isMobile.value ? 36 : 80

  transitionTween = gsap.timeline()
  transitionTween
    .fromTo(backRef.value, { x: -fromX, rotation: rest.back.rotation - 8, opacity: 0 }, { ...rest.back, duration: 0.85, ease: 'power3.out' })
    .fromTo(frontRef.value, { x: fromX, rotation: rest.front.rotation + 8, opacity: 0 }, { ...rest.front, duration: 0.85, ease: 'power3.out' }, '<0.06')

  if (backMirrorRef.value) {
    transitionTween.fromTo(backMirrorRef.value, { x: -fromX, opacity: 0 }, { ...rest.back, opacity: rest.back.opacity * 0.4, duration: 0.85, ease: 'power3.out' }, '<')
  }
  if (frontMirrorRef.value) {
    transitionTween.fromTo(frontMirrorRef.value, { x: fromX, opacity: 0 }, { ...rest.front, opacity: rest.front.opacity * 0.35, duration: 0.85, ease: 'power3.out' }, '<0.06')
  }
}

function startOrganicMotion() {
  killAll()
}

useBottlePresence(floatRef, tiltRef, { idleDuration: 12 })

onMounted(() => {
  setBottleRest()
  startOrganicMotion()
  ready = true
})

onUnmounted(() => {
  transitionTween?.kill()
  killAll()
})

watch(activeFlavorIndex, (n, o) => {
  if (o === n || !ready) return
  playFlavorTransition()
})

watch(isMobile, () => {
  setBottleRest()
  startOrganicMotion()
})
</script>

<template>
  <div
    class="hero-bottle relative flex h-full w-full items-end justify-center md:perspective-[1200px] md:items-center"
    :class="isMobile ? 'hero-bottle--mobile' : ''"
  >
    <div
      class="pointer-events-none absolute inset-0 z-0 opacity-30 md:opacity-55"
      aria-hidden="true"
      :style="glowStyle"
    />

    <div
      v-if="!isMobile"
      class="relative z-10 h-full w-full max-w-md transition-opacity duration-700 md:max-w-lg"
      :class="show3d ? 'opacity-100' : 'pointer-events-none absolute opacity-0'"
    >
      <HeroBottle3D :scroll-progress="scrollProgress" @ready="show3d = true" @error="show3d = false" />
    </div>

    <div
      v-show="isMobile || !show3d"
      ref="parallaxRef"
      class="relative z-10 h-full w-full md:will-change-transform"
      :style="parallaxStyle"
    >
      <div ref="floatRef" class="flex h-full w-full flex-col items-center justify-end pb-0 md:justify-center">
        <div ref="tiltRef" class="bottle-tilt flex w-full flex-col items-center" style="transform-style: preserve-3d">
          <div class="bottle-stage bottle-stage--lit">
            <HeroCondensation :tint="`${activeFlavor.primary}55`" />
            <BottleWaterSheen />
            <img ref="backRef" :src="activeFlavor.bottle" alt="" aria-hidden="true" class="bottle-back" loading="lazy" />
            <img
              ref="frontRef"
              :src="activeFlavor.bottle"
              :alt="`Orita ${current?.name || ''}`"
              class="bottle-front"
              width="260"
              height="760"
              fetchpriority="high"
            />
            <div class="bottle-bloom pointer-events-none absolute inset-0" aria-hidden="true" />
          </div>
          <div class="bottle-reflection">
            <div class="bottle-stage bottle-stage--mirror">
              <img ref="backMirrorRef" :src="activeFlavor.bottle" alt="" class="bottle-back" loading="lazy" />
              <img ref="frontMirrorRef" :src="activeFlavor.bottle" alt="" class="bottle-front" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-bottle {
  --bottle-front: min(52dvh, 480px);
  --bottle-back: min(44dvh, 400px);
  --bottle-reflect: min(9dvh, 88px);
}

.hero-bottle--mobile {
  --bottle-front: min(46svh, 300px);
  --bottle-back: min(38svh, 250px);
  --bottle-reflect: 0px;
}

@media (max-width: 767px) {
  .bottle-reflection {
    display: none;
  }
}

@media (min-width: 768px) {
  .hero-bottle {
    --bottle-front: min(calc(100dvh - 12rem), 620px);
    --bottle-back: min(calc(100dvh - 14rem), 520px);
    --bottle-reflect: min(10dvh, 96px);
  }
}

@media (min-width: 1024px) {
  .hero-bottle {
    --bottle-front: min(calc(100dvh - 11rem), 660px);
    --bottle-back: min(calc(100dvh - 13rem), 560px);
  }
}

.bottle-stage {
  position: relative;
  display: flex;
  width: 100%;
  align-items: flex-end;
  justify-content: center;
}

.bottle-back {
  position: absolute;
  bottom: 0;
  left: 6%;
  display: block;
  height: var(--bottle-back);
  width: auto;
  max-width: none;
  object-fit: contain;
  will-change: transform, opacity;
}

.bottle-stage--lit {
  position: relative;
}

.bottle-bloom {
  background: radial-gradient(ellipse 55% 70% at 50% 45%, rgba(255, 255, 255, 0.22), transparent 68%);
  mix-blend-mode: soft-light;
  z-index: 12;
}

.bottle-front {
  position: relative;
  z-index: 10;
  display: block;
  height: var(--bottle-front);
  width: auto;
  max-width: none;
  object-fit: contain;
  filter: drop-shadow(0 24px 48px rgba(0, 0, 0, 0.28)) brightness(1.04) contrast(1.02);
  will-change: transform, opacity;
}

.bottle-reflection {
  width: 100%;
  height: var(--bottle-reflect);
  overflow: hidden;
  pointer-events: none;
  flex-shrink: 0;
}

.bottle-stage--mirror {
  transform: scaleY(-1);
  filter: blur(0.4px);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, transparent 90%);
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, transparent 90%);
}

.bottle-stage--mirror .bottle-front,
.bottle-stage--mirror .bottle-back {
  filter: none;
  opacity: 0.85;
}
</style>
