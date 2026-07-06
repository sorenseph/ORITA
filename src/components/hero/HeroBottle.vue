<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useMouse } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '../../stores/theme'
import { useLocalizedFlavors } from '../../composables/useLocalizedContent'
import HeroBottle3D from './HeroBottle3D.vue'
import gsap from 'gsap'

const props = defineProps({
  scrollProgress: { type: Number, default: 0 },
})

const theme = useThemeStore()
const { activeFlavorIndex, activeFlavor } = storeToRefs(theme)
const localizedFlavors = useLocalizedFlavors()

const parallaxRef = ref(null)
const floatRef = ref(null)
const backRef = ref(null)
const frontRef = ref(null)
const backMirrorRef = ref(null)
const frontMirrorRef = ref(null)
const show3d = ref(false)
const { x: mouseX, y: mouseY } = useMouse()

const current = computed(() => localizedFlavors.value[activeFlavorIndex.value])

const parallaxStyle = computed(() => {
  const cx = typeof window !== 'undefined' ? window.innerWidth / 2 : 0
  const cy = typeof window !== 'undefined' ? window.innerHeight / 2 : 0
  const dx = (mouseX.value - cx) / cx
  const dy = (mouseY.value - cy) / cy
  return {
    transform: `translate3d(0, ${-props.scrollProgress * 20}px, 0) rotateY(${dx * 3}deg) rotateX(${-dy * 2.5}deg)`,
  }
})

let floatTween = null
let transitionTween = null
let ready = false

function setBottleRest() {
  if (!backRef.value || !frontRef.value) return
  gsap.set(backRef.value, { x: -16, rotation: -7, opacity: 0.5 })
  gsap.set(frontRef.value, { x: 8, rotation: 4, opacity: 1 })
  if (backMirrorRef.value) gsap.set(backMirrorRef.value, { x: -16, rotation: -7, opacity: 0.2 })
  if (frontMirrorRef.value) gsap.set(frontMirrorRef.value, { x: 8, rotation: 4, opacity: 0.35 })
}

function playFlavorTransition() {
  if (!ready || !backRef.value || !frontRef.value) return

  transitionTween?.kill()
  const targets = [backRef.value, frontRef.value, backMirrorRef.value, frontMirrorRef.value].filter(Boolean)
  gsap.killTweensOf(targets)

  transitionTween = gsap.timeline()
  transitionTween
    .fromTo(backRef.value, { x: -80, rotation: -14, opacity: 0 }, { x: -16, rotation: -7, opacity: 0.5, duration: 0.55, ease: 'power3.out' })
    .fromTo(frontRef.value, { x: 80, rotation: 10, opacity: 0 }, { x: 8, rotation: 4, opacity: 1, duration: 0.55, ease: 'power3.out' }, '<0.06')

  if (backMirrorRef.value) {
    transitionTween.fromTo(backMirrorRef.value, { x: -80, rotation: -14, opacity: 0 }, { x: -16, rotation: -7, opacity: 0.2, duration: 0.55, ease: 'power3.out' }, '<')
  }
  if (frontMirrorRef.value) {
    transitionTween.fromTo(frontMirrorRef.value, { x: 80, rotation: 10, opacity: 0 }, { x: 8, rotation: 4, opacity: 0.35, duration: 0.55, ease: 'power3.out' }, '<0.06')
  }
}

onMounted(() => {
  setBottleRest()
  floatTween = gsap.to(floatRef.value, { y: -8, duration: 3.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  ready = true
})

onUnmounted(() => {
  floatTween?.kill()
  transitionTween?.kill()
})

watch(activeFlavorIndex, (n, o) => {
  if (o === n || !ready) return
  playFlavorTransition()
})
</script>

<template>
  <div class="hero-bottle relative flex h-full w-full items-end justify-center perspective-[1200px] md:items-center">
    <div
      class="pointer-events-none absolute inset-0 z-0 opacity-50"
      aria-hidden="true"
      :style="{ background: `radial-gradient(ellipse 70% 60% at 50% 58%, ${activeFlavor.primary}35, transparent 72%)` }"
    />

    <div
      class="relative z-10 h-full w-full max-w-md transition-opacity duration-700 md:max-w-lg"
      :class="show3d ? 'opacity-100' : 'pointer-events-none absolute opacity-0'"
    >
      <HeroBottle3D :scroll-progress="scrollProgress" @ready="show3d = true" @error="show3d = false" />
    </div>

    <div
      v-show="!show3d"
      ref="parallaxRef"
      class="relative z-10 h-full w-full will-change-transform"
      :style="parallaxStyle"
    >
      <div ref="floatRef" class="flex h-full w-full flex-col items-center justify-end pb-0 md:justify-center">
        <div class="bottle-stage">
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
</template>

<style scoped>
.hero-bottle {
  --bottle-front: min(52dvh, 480px);
  --bottle-back: min(44dvh, 400px);
  --bottle-reflect: min(9dvh, 88px);
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
}

.bottle-front {
  position: relative;
  z-index: 10;
  display: block;
  height: var(--bottle-front);
  width: auto;
  max-width: none;
  object-fit: contain;
  filter: drop-shadow(0 32px 64px rgba(0, 0, 0, 0.3));
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
