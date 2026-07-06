<script setup>
defineProps({
  color: { type: String, default: '#F7F0E3' },
  flip: { type: Boolean, default: false },
  animated: { type: Boolean, default: true },
  ocean: { type: Boolean, default: false },
  /** Una sola ola sólida — ideal transición hero → sand */
  simple: { type: Boolean, default: false },
})
</script>

<template>
  <div
    class="pointer-events-none absolute left-0 right-0 z-[6] overflow-hidden"
    :class="[
      simple ? 'h-14 md:h-20' : 'h-16 md:h-24',
      flip ? 'top-0 rotate-180' : 'bottom-0',
    ]"
    aria-hidden="true"
  >
    <svg
      v-if="simple"
      class="absolute bottom-0 left-0 h-full w-full"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      :style="{ color }"
    >
      <path
        fill="currentColor"
        d="M0,68 C280,108 520,32 720,62 C920,92 1160,38 1440,64 L1440,120 L0,120 Z"
      />
    </svg>

    <template v-else>
    <!-- Capa oceánica profunda -->
    <div
      v-if="ocean"
      class="absolute inset-x-0 bottom-0 h-full opacity-90"
      :style="{ background: 'linear-gradient(180deg, transparent 0%, rgba(26,95,110,0.55) 35%, rgba(15,70,82,0.85) 100%)' }"
    />

    <svg
      class="wave-layer absolute bottom-0 h-[130%] w-[200%] min-w-[1440px]"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      :class="animated ? 'wave-drift-slow' : ''"
    >
      <defs>
        <linearGradient id="wave-deep" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(74,171,158,0.15)" />
          <stop offset="100%" stop-color="rgba(42,122,114,0.65)" />
        </linearGradient>
      </defs>
      <path
        fill="url(#wave-deep)"
        d="M0,78 C240,108 420,42 720,68 C1020,94 1200,36 1440,62 L1440,120 L0,120 Z"
      />
    </svg>

    <svg
      class="wave-layer absolute bottom-0 h-[120%] w-[200%] min-w-[1440px]"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      :class="animated ? 'wave-drift-mid' : ''"
      :style="{ color: ocean ? '#6EC4B8' : color }"
    >
      <path
        fill="currentColor"
        fill-opacity="0.75"
        d="M0,72 C320,118 480,28 720,58 C960,88 1120,32 1440,68 L1440,120 L0,120 Z"
      />
    </svg>

    <svg
      class="wave-layer absolute bottom-0 h-full w-[200%] min-w-[1440px]"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      :class="animated ? 'wave-drift-fast' : ''"
      :style="{ color }"
    >
      <path
        fill="currentColor"
        d="M0,82 C280,52 520,102 720,76 C920,50 1160,96 1440,60 L1440,120 L0,120 Z"
      />
      <path
        fill="currentColor"
        fill-opacity="0.45"
        d="M0,92 C200,72 480,108 720,88 C960,68 1180,104 1440,78 L1440,120 L0,120 Z"
      />
    </svg>

    <!-- Espuma -->
    <div
      class="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-white/25 to-transparent md:h-4"
      :class="animated ? 'foam-shimmer' : ''"
    />
    </template>
  </div>
</template>

<style scoped>
.wave-layer { will-change: transform; }

.wave-drift-slow { animation: waveDrift 14s ease-in-out infinite; }
.wave-drift-mid { animation: waveDrift 9s ease-in-out infinite reverse; }
.wave-drift-fast { animation: waveDrift 6s ease-in-out infinite; }

.foam-shimmer { animation: foamPulse 4s ease-in-out infinite; }

@keyframes waveDrift {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-12%); }
}

@keyframes foamPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
</style>
