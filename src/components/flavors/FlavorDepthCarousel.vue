<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '../../stores/theme'
import { useLocalizedFlavors } from '../../composables/useLocalizedContent'
import { getAtmosphere } from '../../data/atmosphere'
import gsap from 'gsap'
import BottleFizzFx from './BottleFizzFx.vue'

const props = defineProps({
  activeIndex: { type: Number, required: true },
  paused: { type: Boolean, default: false },
})

const emit = defineEmits(['select'])

const theme = useThemeStore()
const { activeFlavor } = storeToRefs(theme)
const flavors = useLocalizedFlavors()

const rootRef = ref(null)
const slotRefs = ref([])
const glowRef = ref(null)
const centerBottleRef = ref(null)
const fruitRef = ref(null)

const atmo = computed(() => getAtmosphere(activeFlavor.value.id))
const activeFruit = computed(() => flavors.value[props.activeIndex]?.ingredients?.[0])

function slotIndex(offset) {
  const n = flavors.value.length
  return (props.activeIndex + offset + n) % n
}

function setSlotRef(el, i) {
  if (el) slotRefs.value[i] = el
}

function layoutSlots(animate = true) {
  const slots = slotRefs.value.filter(Boolean)
  if (!slots.length) return

  slots.forEach((el, i) => {
    const offset = i - 1
    const isCenter = offset === 0
    const isSide = Math.abs(offset) === 1

    const vars = isCenter
      ? { xPercent: -50, x: 0, scale: 1, z: 30, opacity: 1, filter: 'blur(0px)', rotationY: 0 }
      : isSide
        ? {
            xPercent: -50,
            x: offset * (window.innerWidth < 768 ? 120 : 200),
            scale: 0.58,
            z: 10,
            opacity: 0.45,
            filter: 'blur(5px)',
            rotationY: offset * -22,
          }
        : { opacity: 0, scale: 0.4, z: 0 }

    if (animate) {
      gsap.to(el, { ...vars, duration: 0.9, ease: 'power3.out', overwrite: 'auto' })
    } else {
      gsap.set(el, vars)
    }
  })
}

function onSelect(idx) {
  emit('select', idx)
}

function setCenterBottleRef(el) {
  centerBottleRef.value = el
}

watch(() => props.activeIndex, async (next, prev) => {
  await nextTick()
  layoutSlots(true)

  if (centerBottleRef.value && next !== prev) {
    const dir = next > prev || (prev === flavors.value.length - 1 && next === 0) ? 1 : -1
    gsap.fromTo(
      centerBottleRef.value,
      { rotationY: dir * -28, opacity: 0.7, scale: 0.94 },
      { rotationY: 0, opacity: 1, scale: 1, duration: 0.95, ease: 'power3.out' },
    )
  }

  if (glowRef.value) {
    gsap.fromTo(glowRef.value, { opacity: 0.4, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' })
  }

  if (fruitRef.value) {
    const dir = next > prev || (prev === flavors.value.length - 1 && next === 0) ? 1 : -1
    gsap.fromTo(
      fruitRef.value,
      { x: dir * 120, y: 40, rotation: dir * 25, scale: 0.5, opacity: 0 },
      { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.85, ease: 'back.out(1.4)' },
    )
  }
})

onMounted(async () => {
  await nextTick()
  layoutSlots(false)
  gsap.from(rootRef.value, { opacity: 0, y: 40, duration: 1.1, ease: 'power3.out' })
})

onUnmounted(() => {
  gsap.killTweensOf(slotRefs.value)
})
</script>

<template>
  <div ref="rootRef" class="flavor-depth relative mx-auto w-full max-w-4xl perspective-[1400px]">
    <div class="flavor-depth__stage relative flex min-h-[min(68vw,480px)] items-end justify-center md:min-h-[520px]">
      <div
        ref="glowRef"
        class="bottle-glow pointer-events-none absolute bottom-[6%] left-1/2 z-0 h-[12%] w-[60%] -translate-x-1/2 rounded-full opacity-60"
        :style="{ background: atmo.glow, filter: 'blur(24px)' }"
        aria-hidden="true"
      />
      <BottleFizzFx class="z-[5]" :tint="atmo.bubbleTint" :count="10" :active="!paused" />

      <img
        v-if="activeFruit?.img"
        :key="activeFruit.img"
        ref="fruitRef"
        :src="activeFruit.img"
        alt=""
        class="flavor-depth__fruit pointer-events-none absolute bottom-[28%] right-[12%] z-[15] h-16 w-16 object-contain drop-shadow-lg md:bottom-[32%] md:right-[18%] md:h-24 md:w-24"
        loading="lazy"
      />

      <div
        v-for="slot in [-1, 0, 1]"
        :key="slot"
        :ref="(el) => setSlotRef(el, slot + 1)"
        class="flavor-depth__slot absolute bottom-0 left-1/2 cursor-pointer"
        :class="slot === 0 ? 'z-20' : 'z-10'"
        :style="{ transformStyle: 'preserve-3d' }"
        @click="slot !== 0 && onSelect(slotIndex(slot))"
      >
        <img
          :ref="slot === 0 ? setCenterBottleRef : undefined"
          :src="flavors[slotIndex(slot)]?.bottle || theme.activeFlavor.bottle"
          :alt="flavors[slotIndex(slot)]?.name"
          class="flavor-depth__bottle h-[min(62vw,400px)] w-auto max-h-[min(58vh,560px)] object-contain md:h-[min(54vh,520px)]"
          :class="slot === 0 ? 'flavor-depth__bottle--hero' : ''"
          loading="lazy"
        />
        <p
          v-if="slot !== 0"
          class="mt-2 text-center font-display text-sm font-semibold opacity-70 md:text-base"
        >
          {{ flavors[slotIndex(slot)]?.name.split(' &')[0] }}
        </p>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-center gap-6 md:mt-8 md:gap-10">
      <button
        type="button"
        class="magnetic-btn flex h-11 w-11 items-center justify-center rounded-full glass-ice text-lg"
        aria-label="Previous"
        @click="onSelect(slotIndex(-1))"
      >
        ←
      </button>
      <p class="font-display text-lg font-bold md:text-2xl">
        {{ flavors[activeIndex]?.name.split(' &')[0] }}
      </p>
      <button
        type="button"
        class="magnetic-btn flex h-11 w-11 items-center justify-center rounded-full glass-ice text-lg"
        aria-label="Next"
        @click="onSelect(slotIndex(1))"
      >
        →
      </button>
    </div>
  </div>
</template>

<style scoped>
.flavor-depth__fruit {
  transform-origin: center center;
  will-change: transform, opacity;
}

.flavor-depth__bottle--hero {
  filter: drop-shadow(0 28px 56px rgba(0, 0, 0, 0.28));
}

.flavor-depth__slot {
  transform-origin: bottom center;
  will-change: transform, opacity, filter;
}
</style>
