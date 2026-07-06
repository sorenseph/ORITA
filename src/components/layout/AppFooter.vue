<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { scrollTo } from '../../composables/useLenis'
import { gsap } from '../../composables/useLenis'
import { useSectionLife } from '../../composables/useSectionLife'
import { useCartStore } from '../../stores/cart'
import { useLegalStore } from '../../stores/legal'
import { AGAVE_IMG, AGAVE_WALLPAPER } from '../../data/agaveAssets'
import { socialLinks } from '../../data/socials'

const { t } = useI18n()
const cart = useCartStore()
const legal = useLegalStore()
const footerRef = ref(null)
const ctaRef = ref(null)

const shopLinks = [
  { key: 'shop', href: '#shop' },
  { key: 'track', href: '#tracking' },
  { key: 'cart', action: 'cart' },
]

const exploreLinks = [
  { key: 'story', href: '#story' },
  { key: 'flavors', href: '#flavors' },
  { key: 'map', href: '#map' },
  { key: 'contact', href: '#contact' },
]

const legalLinks = [
  { key: 'privacy', doc: 'privacy' },
  { key: 'terms', doc: 'terms' },
  { key: 'shipping', href: '#tracking' },
]

useSectionLife(footerRef)

onMounted(() => {
  gsap.from(ctaRef.value, {
    y: 40, opacity: 0, duration: 1.2, ease: 'power3.out',
    scrollTrigger: { trigger: footerRef.value, start: 'top 85%' },
  })
})

function onLinkClick(link) {
  if (link.action === 'cart') {
    cart.openCart('drawer')
    return
  }
  if (link.doc) {
    legal.open(link.doc)
    return
  }
  scrollTo(link.href, { offset: -96 })
}
</script>

<template>
  <footer ref="footerRef" data-nav-contrast="dark" class="section-green relative overflow-hidden text-white">
    <div class="pointer-events-none absolute inset-x-0 bottom-0 z-0 overflow-hidden" aria-hidden="true">
      <img
        :src="AGAVE_WALLPAPER"
        alt=""
        class="absolute bottom-0 left-1/2 h-40 w-[140%] max-w-none -translate-x-1/2 object-cover object-bottom opacity-[0.14] md:h-56"
        loading="lazy"
      />
      <img
        :src="AGAVE_IMG"
        alt=""
        class="absolute bottom-0 left-[-10%] h-44 object-bottom opacity-[0.22] md:left-[-6%] md:h-60"
        loading="lazy"
      />
      <img
        :src="AGAVE_IMG"
        alt=""
        class="absolute bottom-0 right-[-10%] h-40 -scale-x-100 object-bottom opacity-[0.22] md:right-[-6%] md:h-56"
        loading="lazy"
      />
    </div>

    <div ref="ctaRef" class="content-layer relative border-t border-white/10 px-5 pb-14 pt-20 text-center md:px-8 md:pb-16 md:pt-24">
      <img src="/images/logo_footer.png" alt="Orita" class="mx-auto mb-8 h-14 w-auto md:h-16" loading="lazy" />
      <button
        type="button"
        class="magnetic-btn font-editorial text-[clamp(2rem,8vw,5rem)] leading-tight text-white transition-transform"
        @click="scrollTo('#shop', { offset: -96 })"
      >
        {{ t('footer.cta') }}
      </button>
      <p class="mx-auto mt-5 max-w-md font-body text-base text-white/80 md:text-lg">{{ t('footer.tagline') }}</p>
      <p class="mx-auto mt-2 font-body text-sm text-white/60">{{ t('footer.subtagline') }}</p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          class="magnetic-btn inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-display text-base font-bold text-[#2A7A72] shadow-lg transition-all"
          @click="scrollTo('#shop', { offset: -96 })"
        >
          {{ t('footer.buy') }}
          <img src="/images/arrow_forward.png" alt="" class="h-4 w-4" />
        </button>
      </div>
    </div>

    <div class="content-layer relative border-t border-white/10 px-5 py-12 md:px-8 md:py-14">
      <div class="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
        <div class="lg:col-span-2">
          <img src="/images/logo_header.png" alt="Orita" class="mb-4 h-8 w-auto brightness-0 invert opacity-90" loading="lazy" />
          <p class="max-w-xs font-body text-sm leading-relaxed text-white/60">{{ t('footer.about') }}</p>
          <div class="mt-5 flex gap-2">
            <a
              v-for="s in socialLinks"
              :key="s.label"
              :href="s.href"
              target="_blank"
              rel="noopener"
              class="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              :aria-label="s.label"
            >
              <img :src="s.icon" alt="" class="h-3.5 w-3.5 brightness-0 invert opacity-80" />
            </a>
          </div>
        </div>

        <div>
          <h3 class="mb-4 font-display text-sm font-bold tracking-wide text-white/90 uppercase">{{ t('footer.columns.shop') }}</h3>
          <ul class="space-y-2.5">
            <li v-for="link in shopLinks" :key="link.key">
              <button type="button" class="font-body text-sm text-white/55 transition-colors hover:text-white" @click="onLinkClick(link)">
                {{ t(`footer.links.${link.key}`) }}
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="mb-4 font-display text-sm font-bold tracking-wide text-white/90 uppercase">{{ t('footer.columns.explore') }}</h3>
          <ul class="space-y-2.5">
            <li v-for="link in exploreLinks" :key="link.key">
              <button type="button" class="font-body text-sm text-white/55 transition-colors hover:text-white" @click="onLinkClick(link)">
                {{ t(`footer.links.${link.key}`) }}
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="mb-4 font-display text-sm font-bold tracking-wide text-white/90 uppercase">{{ t('footer.columns.legal') }}</h3>
          <ul class="space-y-2.5">
            <li v-for="link in legalLinks" :key="link.key">
              <button type="button" class="font-body text-sm text-white/55 transition-colors hover:text-white" @click="onLinkClick(link)">
                {{ t(`footer.links.${link.key}`) }}
              </button>
            </li>
          </ul>
          <p class="mt-6 font-body text-xs leading-relaxed text-white/40">{{ t('footer.paymentNote') }}</p>
        </div>
      </div>

      <div class="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
        <p class="font-body text-xs text-white/45">{{ t('footer.rights', { year: new Date().getFullYear() }) }}</p>
        <p class="font-body text-xs text-white/35">{{ t('footer.madeIn') }}</p>
        <button type="button" class="font-body text-xs text-white/45 underline-offset-2 hover:text-white/70 hover:underline" @click="scrollTo('#tracking', { offset: -96 })">
          {{ t('footer.trackDiscrete') }}
        </button>
      </div>
    </div>
  </footer>
</template>
