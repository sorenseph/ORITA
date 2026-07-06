<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { scrollTo } from '../../composables/useLenis'
import { gsap } from '../../composables/useLenis'
import TropicalSplash from '../tropical/TropicalSplash.vue'

const { t } = useI18n()
const footerRef = ref(null)
const ctaRef = ref(null)

const socials = [
  { href: 'https://www.facebook.com/drinkorita/', icon: '/images/facebook.png', label: 'Facebook' },
  { href: 'https://www.instagram.com/drinkorita/', icon: '/images/instagram.png', label: 'Instagram' },
  { href: 'https://www.linkedin.com/company/drinkorita', icon: '/images/linkedin.png', label: 'LinkedIn' },
]

onMounted(() => {
  gsap.from(ctaRef.value, {
    y: 40, opacity: 0, duration: 1.2, ease: 'power3.out',
    scrollTrigger: { trigger: footerRef.value, start: 'top 85%' },
  })
})
</script>

<template>
  <footer ref="footerRef" data-nav-contrast="dark" class="relative overflow-hidden bg-[#2A7A72] text-white">
    <TropicalSplash color="#3BBFA3" flip animated />

    <div ref="ctaRef" class="relative px-5 pb-16 pt-24 text-center md:px-8 md:pb-20 md:pt-28">
      <div class="tropical-grain pointer-events-none absolute inset-0 opacity-[0.08]" aria-hidden="true" />
      <img src="/images/logo_footer.png" alt="Orita" class="mx-auto mb-8 h-14 w-auto md:h-16" loading="lazy" />
      <button
        class="font-editorial text-[clamp(2rem,8vw,5rem)] leading-tight text-white transition-transform hover:scale-[1.02]"
        @click="scrollTo('#shop', { offset: -80 })"
      >
        {{ t('footer.cta') }}
      </button>
      <p class="mx-auto mt-5 max-w-md font-body text-base text-white/80 md:text-lg">{{ t('footer.tagline') }}</p>
      <p class="mx-auto mt-2 font-body text-sm text-white/60">{{ t('footer.subtagline') }}</p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          class="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-display text-base font-bold text-[#2A7A72] shadow-lg transition-all hover:scale-105"
          @click="scrollTo('#shop', { offset: -80 })"
        >
          {{ t('footer.buy') }}
          <img src="/images/arrow_forward.png" alt="" class="h-4 w-4" />
        </button>
      </div>
    </div>

    <div class="relative overflow-hidden bg-[#1f5c56] pb-10 pt-20 md:pb-12 md:pt-24">
      <TropicalSplash color="#2A7A72" flip animated />
      <div class="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-5 md:flex-row md:px-8">
        <img src="/images/logo_header.png" alt="Orita" class="h-8 w-auto brightness-0 invert opacity-90" loading="lazy" />
        <div class="flex gap-3">
          <a
            v-for="s in socials"
            :key="s.label"
            :href="s.href"
            target="_blank"
            rel="noopener"
            class="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-all hover:scale-110 hover:bg-white/20"
            :aria-label="s.label"
          >
            <img :src="s.icon" alt="" class="h-4 w-4 brightness-0 invert" />
          </a>
        </div>
        <p class="font-body text-xs text-white/50">{{ t('footer.rights', { year: new Date().getFullYear() }) }}</p>
      </div>
    </div>
  </footer>
</template>
