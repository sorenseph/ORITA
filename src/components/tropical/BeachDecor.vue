<script setup>
defineProps({
  variant: { type: String, default: 'hero' },
  light: { type: Boolean, default: false },
})
</script>

<template>
  <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <!-- Sol cálido -->
    <div
      class="absolute -right-12 -top-12 h-40 w-40 rounded-full md:h-56 md:w-56"
      :style="{
        background: light
          ? 'radial-gradient(circle, rgba(255,200,100,0.25) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(255,248,224,0.35) 0%, transparent 70%)',
      }"
    />

    <!-- Palmeras -->
    <img
      src="/svg/palm.svg"
      alt=""
      class="absolute -left-4 bottom-[12%] h-28 w-auto opacity-[0.14] md:h-40"
      :class="light ? 'opacity-[0.08]' : ''"
    />
    <img
      src="/svg/palm.svg"
      alt=""
      class="absolute -right-2 bottom-[18%] h-24 w-auto rotate-12 opacity-[0.1] md:h-32"
      :class="light ? 'opacity-[0.06]' : ''"
    />

    <!-- Conchas decorativas -->
    <img
      src="/svg/shell.svg"
      alt=""
      class="absolute bottom-[8%] left-[12%] h-10 w-10 opacity-[0.18] md:h-14 md:w-14"
      :class="light ? 'text-[#2A2018]' : 'text-white'"
      style="color: inherit"
    />
    <img
      src="/svg/shell.svg"
      alt=""
      class="absolute right-[10%] top-[22%] h-8 w-8 rotate-45 opacity-[0.12] md:h-11 md:w-11"
    />

    <!-- Gotas splash -->
    <span
      v-for="n in 8"
      :key="n"
      class="splash-drop absolute rounded-full"
      :class="light ? 'bg-[#4AAB9E]/15' : 'bg-white/20'"
      :style="{
        width: `${5 + n * 2}px`,
        height: `${5 + n * 2}px`,
        top: `${12 + (n * 9) % 55}%`,
        left: `${6 + (n * 11) % 80}%`,
        animationDelay: `${n * 0.55}s`,
      }"
    />
  </div>
</template>

<style scoped>
.splash-drop {
  animation: splashDrop 4.5s ease-in-out infinite;
}

@keyframes splashDrop {
  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.2;
  }
  50% {
    transform: translateY(-14px) scale(1.15);
    opacity: 0.45;
  }
}
</style>
