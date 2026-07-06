<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '../../stores/cart'
import { useThemeStore } from '../../stores/theme'
import { scrollTo } from '../../composables/useLenis'
import { useNavSurface } from '../../composables/useNavSurface'
import { setLocale } from '../../i18n'
import gsap from 'gsap'

const NAV_OFFSET = -96

const { t, locale } = useI18n()
const cart = useCartStore()
const theme = useThemeStore()

const navRef = ref(null)
const menuOpen = ref(false)

const { navTone, refresh } = useNavSurface(() =>
  theme.activeFlavor.textOnBg === '#2A2018' ? 'dark-text' : 'light-text',
)

const isLightUi = computed(() => navTone.value === 'light')

watch(() => theme.activeFlavor.id, () => refresh())

const links = computed(() => [
  { label: t('nav.story'), href: '#story' },
  { label: t('nav.flavors'), href: '#flavors' },
  { label: t('nav.contact'), href: '#contact' },
  { label: t('nav.shop'), href: '#shop' },
])

function navigate(href) {
  menuOpen.value = false
  scrollTo(href, { offset: NAV_OFFSET })
}

function switchLang(lang) {
  setLocale(lang)
}

onMounted(() => {
  gsap.from(navRef.value, { y: -40, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out' })
})
</script>

<template>
  <header
    ref="navRef"
    class="pointer-events-none fixed left-1/2 top-5 z-50 w-[94%] max-w-6xl -translate-x-1/2 md:top-6"
  >
    <div
      class="nav-glass pointer-events-auto flex items-center justify-between gap-3 rounded-full border px-4 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-500 md:gap-4 md:px-6 md:py-3"
      :class="isLightUi
        ? 'border-white/25 bg-white/10'
        : 'border-[#2A2018]/10 bg-white/40'"
    >
      <a
        href="#"
        class="relative z-10 shrink-0 transition-opacity hover:opacity-90"
        :aria-label="t('nav.home')"
        @click.prevent="scrollTo(0)"
      >
        <img
          src="/images/logo_header.png"
          alt="Orita"
          class="h-7 w-auto transition-all md:h-9"
          :class="isLightUi
            ? 'brightness-0 invert drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]'
            : 'drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]'"
        />
      </a>

      <nav class="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Principal">
        <button
          v-for="link in links"
          :key="link.href"
          class="group relative font-body text-[13px] font-medium tracking-wide transition-colors"
          :class="isLightUi ? 'text-white/85 hover:text-white' : 'text-[#2A2018]/70 hover:text-[#2A2018]'"
          @click="navigate(link.href)"
        >
          {{ link.label }}
          <span
            class="absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
            :class="isLightUi ? 'bg-white/80' : 'bg-[#4AAB9E]'"
          />
        </button>
      </nav>

      <div class="flex items-center gap-1.5 md:gap-2">
        <div
          class="hidden items-center rounded-full p-0.5 sm:flex"
          :class="isLightUi ? 'bg-white/15' : 'bg-[#2A2018]/8'"
        >
          <button
            class="rounded-full px-2.5 py-1 font-body text-[11px] font-semibold transition-all"
            :class="locale === 'es'
              ? (isLightUi ? 'bg-white text-[#2A2018]' : 'bg-[#2A2018] text-white')
              : (isLightUi ? 'text-white/60' : 'text-[#2A2018]/45')"
            @click="switchLang('es')"
          >
            ES
          </button>
          <button
            class="rounded-full px-2.5 py-1 font-body text-[11px] font-semibold transition-all"
            :class="locale === 'en'
              ? (isLightUi ? 'bg-white text-[#2A2018]' : 'bg-[#2A2018] text-white')
              : (isLightUi ? 'text-white/60' : 'text-[#2A2018]/45')"
            @click="switchLang('en')"
          >
            EN
          </button>
        </div>

        <a
          href="https://www.instagram.com/drinkorita/"
          target="_blank"
          rel="noopener"
          :aria-label="t('nav.instagram')"
          class="hidden sm:block"
        >
          <img
            src="/images/instagram.png"
            alt=""
            class="h-4 w-4 transition-opacity hover:opacity-100"
            :class="isLightUi ? 'brightness-0 invert opacity-85' : 'opacity-65'"
          />
        </a>

        <button
          class="hidden items-center gap-1.5 rounded-full px-3.5 py-2 font-body text-[12px] font-semibold transition-all md:flex"
          :class="isLightUi
            ? 'bg-white/90 text-[#2A2018] hover:bg-white'
            : 'bg-[#4AAB9E] text-white hover:bg-[#3d9a8e]'"
          @click="navigate('#shop')"
        >
          <img
            src="/images/store_icon.png"
            alt=""
            class="h-3.5 w-3.5"
            :class="isLightUi ? '' : 'brightness-0 invert'"
          />
          {{ t('nav.shop') }}
        </button>

        <button
          class="relative flex h-9 w-9 items-center justify-center rounded-full transition-all md:h-10 md:w-10"
          :class="isLightUi ? 'hover:bg-white/15' : 'hover:bg-[#2A2018]/8'"
          :aria-label="t('nav.cart')"
          @click="cart.openCart('drawer')"
        >
          <svg
            class="h-[18px] w-[18px]"
            :class="isLightUi ? 'text-white' : 'text-[#2A2018]'"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span
            v-if="cart.itemCount"
            class="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#4AAB9E] text-[9px] font-bold text-white"
          >
            {{ cart.itemCount }}
          </span>
        </button>

        <button
          class="flex h-9 w-9 items-center justify-center rounded-full lg:hidden"
          :class="isLightUi ? 'hover:bg-white/15' : 'hover:bg-[#2A2018]/8'"
          :aria-label="t('nav.menu')"
          @click="menuOpen = !menuOpen"
        >
          <span class="flex flex-col gap-1.5">
            <span
              class="block h-0.5 w-4 transition-transform"
              :class="[isLightUi ? 'bg-white' : 'bg-[#2A2018]', menuOpen && 'translate-y-2 rotate-45']"
            />
            <span
              class="block h-0.5 w-4 transition-opacity"
              :class="[isLightUi ? 'bg-white' : 'bg-[#2A2018]', menuOpen && 'opacity-0']"
            />
            <span
              class="block h-0.5 w-4 transition-transform"
              :class="[isLightUi ? 'bg-white' : 'bg-[#2A2018]', menuOpen && '-translate-y-2 -rotate-45']"
            />
          </span>
        </button>
      </div>
    </div>

    <Transition name="menu">
      <div v-if="menuOpen" class="pointer-events-auto fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-[#F7F0E3]/95 backdrop-blur-xl lg:hidden">
        <img src="/images/logo_footer.png" alt="Orita" class="mb-4 h-12 w-auto" />
        <button
          v-for="link in links"
          :key="link.href"
          class="font-display text-3xl font-bold text-[#2A2018]"
          @click="navigate(link.href)"
        >
          {{ link.label }}
        </button>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.nav-glass {
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  backdrop-filter: blur(20px) saturate(160%);
}

.menu-enter-active, .menu-leave-active { transition: opacity 0.3s ease; }
.menu-enter-from, .menu-leave-to { opacity: 0; }
</style>
