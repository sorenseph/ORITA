<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLocalizedFlavors } from '../../composables/useLocalizedContent'
import { gsap, ScrollTrigger } from '../../composables/useLenis'

const props = defineProps({
  /** hero-exit | to-flavors */
  variant: { type: String, default: 'hero-exit' },
})

const bridgeRef = ref(null)
const bubbleLayerRef = ref(null)
const fruitLayerRef = ref(null)
const glowRef = ref(null)

const flavors = useLocalizedFlavors()

const fruitSamples = computed(() =>
  flavors.value.slice(0, 4).map((f) => ({
    id: f.id,
    img: f.ingredients[0]?.img,
    color: f.primary,
  })),
)

const heightClass = computed(() => {
  if (props.variant === 'to-flavors') return 'h-[min(70vh,520px)]'
  if (props.variant === 'to-benefits') return 'h-[min(40vh,300px)]'
  return 'h-[min(50vh,380px)]'
})

let ctx

onMounted(() => {
  if (!bridgeRef.value) return

  ctx = gsap.context(() => {
    if (props.variant === 'hero-exit') {
      gsap.fromTo(
        bubbleLayerRef.value,
        { y: 80, opacity: 0.3 },
        {
          y: -120,
          opacity: 0.85,
          ease: 'none',
          scrollTrigger: {
            trigger: bridgeRef.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        },
      )
      gsap.fromTo(
        glowRef.value,
        { opacity: 0.2, scale: 0.9 },
        {
          opacity: 0.55,
          scale: 1.08,
          ease: 'none',
          scrollTrigger: {
            trigger: bridgeRef.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        },
      )
      return
    }

    if (props.variant === 'to-benefits') {
      gsap.fromTo(
        glowRef.value,
        { opacity: 0.15 },
        {
          opacity: 0.45,
          ease: 'none',
          scrollTrigger: {
            trigger: bridgeRef.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        },
      )
      gsap.fromTo(
        bubbleLayerRef.value,
        { y: 30, opacity: 0.4 },
        {
          y: -40,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: bridgeRef.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        },
      )
      return
    }

    // to-flavors: burbujas → frutas
    gsap.timeline({
      scrollTrigger: {
        trigger: bridgeRef.value,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 0.9,
      },
    })
      .fromTo(bubbleLayerRef.value, { opacity: 1, y: 0 }, { opacity: 0, y: -60, ease: 'power2.in' }, 0)
      .fromTo(fruitLayerRef.value, { opacity: 0, y: 40, scale: 0.85 }, { opacity: 1, y: -20, scale: 1, ease: 'power3.out' }, 0.35)

    bridgeRef.value.querySelectorAll('[data-bridge-fruit]').forEach((el, i) => {
      gsap.fromTo(
        el,
        { x: (i % 2 === 0 ? -1 : 1) * 60, rotation: (i % 2 === 0 ? -1 : 1) * 18, opacity: 0 },
        {
          x: 0,
          rotation: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: bridgeRef.value,
            start: 'top 75%',
            end: 'bottom 25%',
            scrub: 1,
          },
        },
      )
    })
  }, bridgeRef)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <div
    ref="bridgeRef"
    class="narrative-bridge relative w-full overflow-hidden"
    :class="heightClass"
    aria-hidden="true"
  >
    <div
      ref="glowRef"
      class="pointer-events-none absolute left-1/2 top-1/2 h-[60%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[80px]"
      :style="{
        background: variant === 'hero-exit'
          ? 'radial-gradient(circle, #4aab9e88, transparent 70%)'
          : variant === 'to-benefits'
            ? 'radial-gradient(circle, #f7f0e3aa, #4aab9e44, transparent 72%)'
            : 'radial-gradient(circle, #d4734a55, #4aab9e44, transparent 72%)',
      }"
    />

    <div
      ref="bubbleLayerRef"
      class="bridge-bubbles pointer-events-none absolute inset-0"
    >
      <span
        v-for="i in 14"
        :key="`b-${i}`"
        class="bridge-bubble absolute rounded-full border border-white/20"
        :style="{
          left: `${8 + (i * 6.5) % 84}%`,
          bottom: `${(i * 11) % 40}%`,
          width: `${8 + (i % 4) * 5}px`,
          height: `${8 + (i % 4) * 5}px`,
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7), rgba(180,240,230,0.25))',
          animationDelay: `${i * 0.35}s`,
          animationDuration: `${3.5 + (i % 3)}s`,
        }"
      />
    </div>

    <div
      v-if="variant === 'to-flavors'"
      ref="fruitLayerRef"
      class="bridge-fruits pointer-events-none absolute inset-0 flex items-center justify-center gap-6 opacity-0 md:gap-10"
    >
      <img
        v-for="(fruit, i) in fruitSamples"
        :key="fruit.id"
        data-bridge-fruit
        :src="fruit.img"
        alt=""
        class="h-14 w-14 object-contain drop-shadow-lg md:h-20 md:w-20"
        :style="{ filter: `drop-shadow(0 8px 20px ${fruit.color}44)` }"
        loading="lazy"
      />
    </div>
  </div>
</template>

<style scoped>
.bridge-bubble {
  animation: bridgeFloat ease-in-out infinite;
}

@keyframes bridgeFloat {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
  50% { transform: translateY(-18px) scale(1.08); opacity: 0.9; }
}

@media (prefers-reduced-motion: reduce) {
  .bridge-bubble { animation: none; }
}
</style>
