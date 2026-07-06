<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useCartStore } from '../../stores/cart'
import { useAuthStore } from '../../stores/auth'
import { useThemeStore } from '../../stores/theme'
import { scrollTo, stopScroll, startScroll } from '../../composables/useLenis'
import { useNavSurface } from '../../composables/useNavSurface'
import { setLocale } from '../../i18n'
import gsap from 'gsap'

const NAV_OFFSET = -96

const { t, locale } = useI18n()
const cart = useCartStore()
const auth = useAuthStore()
const { activeFlavor } = storeToRefs(useThemeStore())

const navRef = ref(null)
const menuOpen = ref(false)

function getAutoNavTone() {
  return activeFlavor.value.textOnBg === '#2A2018' ? 'dark-text' : 'light-text'
}

const { navTone, inHero, refresh } = useNavSurface(getAutoNavTone, () => menuOpen.value)

const isLightUi = computed(() => !inHero.value && navTone.value === 'light')

watch(menuOpen, (open) => {
  if (open) {
    stopScroll()
    document.body.style.overflow = 'hidden'
  } else {
    startScroll()
    document.body.style.overflow = ''
    refresh()
  }
})

onUnmounted(() => {
  if (menuOpen.value) {
    startScroll()
    document.body.style.overflow = ''
  }
})

const links = computed(() => [
  { label: t('nav.shop'), href: '#shop' },
  { label: t('nav.flavors'), href: '#flavors' },
  { label: t('nav.story'), href: '#story' },
  { label: t('nav.contact'), href: '#contact' },
])

function navigate(href) {
  menuOpen.value = false
  scrollTo(href, { offset: NAV_OFFSET })
}

function switchLang(lang) {
  setLocale(lang)
}

function handleAccount() {
  if (auth.user) auth.logout()
  else auth.openLogin()
}

onMounted(() => {
  gsap.from(navRef.value, { y: -40, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out' })
})
</script>

<template>
  <header
    ref="navRef"
    class="nav-shell pointer-events-none fixed inset-x-0 top-0 z-50 px-[3vw] pt-5 md:top-0 md:px-6 md:pt-6"
  >
    <div
      class="nav-glass pointer-events-auto mx-auto flex h-[52px] max-w-6xl items-center justify-between gap-3 rounded-full border px-4 md:h-[56px] md:gap-4 md:px-6"
      :class="isLightUi ? 'nav-glass--light' : 'nav-glass--dark'"
    >
      <a
        href="#"
        class="relative z-10 shrink-0"
        :aria-label="t('nav.home')"
        @click.prevent="scrollTo(0)"
      >
        <img
          src="/images/logo_header.png"
          alt="Orita"
          class="nav-logo h-7 w-auto md:h-9"
          :class="isLightUi ? 'nav-logo--light' : 'nav-logo--dark'"
        />
      </a>

      <nav class="hidden items-center gap-5 lg:flex xl:gap-7" aria-label="Principal">
        <button
          v-for="link in links"
          :key="link.href"
          class="nav-link group relative font-body text-[13px] font-medium tracking-wide"
          :class="[
            isLightUi ? 'nav-link--light' : 'nav-link--dark',
            link.href === '#shop' ? 'font-semibold' : '',
          ]"
          @click="navigate(link.href)"
        >
          {{ link.label }}
          <span
            class="absolute -bottom-1 left-0 h-px w-0 transition-[width] duration-300 group-hover:w-full"
            :class="isLightUi ? 'bg-white/80' : 'bg-[#4AAB9E]'"
          />
        </button>
      </nav>

      <div class="flex shrink-0 items-center gap-1 md:gap-2">
        <div
          class="flex items-center rounded-full p-0.5"
          :class="isLightUi ? 'bg-white/15' : 'bg-[#2A2018]/8'"
        >
          <button
            class="rounded-full px-1.5 py-0.5 font-body text-[10px] font-semibold transition-colors duration-300 md:px-2.5 md:py-1 md:text-[11px]"
            :class="locale === 'es'
              ? (isLightUi ? 'bg-white text-[#2A2018]' : 'bg-[#2A2018] text-white')
              : (isLightUi ? 'text-white/60' : 'text-[#2A2018]/45')"
            @click="switchLang('es')"
          >
            ES
          </button>
          <button
            class="rounded-full px-1.5 py-0.5 font-body text-[10px] font-semibold transition-colors duration-300 md:px-2.5 md:py-1 md:text-[11px]"
            :class="locale === 'en'
              ? (isLightUi ? 'bg-white text-[#2A2018]' : 'bg-[#2A2018] text-white')
              : (isLightUi ? 'text-white/60' : 'text-[#2A2018]/45')"
            @click="switchLang('en')"
          >
            EN
          </button>
        </div>

        <button
          class="hidden items-center gap-1.5 rounded-full px-3.5 py-2 font-body text-[12px] font-semibold transition-colors duration-300 md:flex"
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
          class="flex h-9 max-w-[7rem] shrink-0 items-center justify-center gap-1.5 rounded-full px-2.5 sm:max-w-none sm:px-3 md:h-10"
          :class="isLightUi ? 'hover:bg-white/15' : 'hover:bg-[#2A2018]/8'"
          :aria-label="auth.user ? t('nav.logout') : t('nav.login')"
          @click="handleAccount"
        >
          <svg class="h-4 w-4 shrink-0" :class="isLightUi ? 'text-white' : 'text-[#2A2018]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="hidden truncate font-body text-[11px] font-semibold sm:inline" :class="isLightUi ? 'text-white/90' : 'text-[#2A2018]'">
            {{ auth.user ? auth.user.name : t('nav.login') }}
          </span>
        </button>

        <button
          class="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full md:h-10 md:w-10"
          :class="isLightUi ? 'hover:bg-white/15' : 'hover:bg-[#2A2018]/8'"
          :aria-label="t('nav.cart')"
          @click="cart.openCart('drawer')"
        >
          <svg
            class="h-[18px] w-[18px] transition-colors duration-300"
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
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full lg:hidden"
          :class="isLightUi ? 'hover:bg-white/15' : 'hover:bg-[#2A2018]/8'"
          :aria-label="t('nav.menu')"
          @click="menuOpen = !menuOpen"
        >
          <span class="flex flex-col gap-1.5">
            <span
              class="block h-0.5 w-4 transition-transform duration-200"
              :class="[isLightUi ? 'bg-white' : 'bg-[#2A2018]', menuOpen && 'translate-y-2 rotate-45']"
            />
            <span
              class="block h-0.5 w-4 transition-opacity duration-200"
              :class="[isLightUi ? 'bg-white' : 'bg-[#2A2018]', menuOpen && 'opacity-0']"
            />
            <span
              class="block h-0.5 w-4 transition-transform duration-200"
              :class="[isLightUi ? 'bg-white' : 'bg-[#2A2018]', menuOpen && '-translate-y-2 -rotate-45']"
            />
          </span>
        </button>
      </div>
    </div>
  </header>

  <Teleport to="body">
    <Transition name="menu">
      <div
        v-if="menuOpen"
        data-nav-menu
        class="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-[#F7F0E3]/98 backdrop-blur-xl lg:hidden"
        @click.self="menuOpen = false"
      >
        <button
          class="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-[#2A2018]/8 text-[#2A2018]"
          :aria-label="t('nav.close')"
          @click="menuOpen = false"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <img src="/images/logo_footer.png" alt="Orita" class="mb-4 h-12 w-auto" />
        <button
          v-for="link in links"
          :key="link.href"
          class="font-display text-3xl font-bold text-[#2A2018] transition-opacity hover:opacity-70"
          @click="navigate(link.href)"
        >
          {{ link.label }}
        </button>

        <div class="mt-4 flex items-center gap-1 rounded-full bg-[#2A2018]/8 p-1">
          <button
            class="rounded-full px-4 py-2 font-body text-sm font-semibold transition-colors"
            :class="locale === 'es' ? 'bg-white text-[#2A2018] shadow-sm' : 'text-[#2A2018]/50'"
            @click="switchLang('es')"
          >
            ES
          </button>
          <button
            class="rounded-full px-4 py-2 font-body text-sm font-semibold transition-colors"
            :class="locale === 'en' ? 'bg-white text-[#2A2018] shadow-sm' : 'text-[#2A2018]/50'"
            @click="switchLang('en')"
          >
            EN
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.nav-shell {
  transform: translateZ(0);
  will-change: transform;
}

.nav-glass {
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  backdrop-filter: blur(20px) saturate(160%);
  transition: background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
}

.nav-glass--light {
  border-color: rgba(255, 255, 255, 0.25);
  background-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}

.nav-glass--dark {
  border-color: rgba(42, 32, 24, 0.1);
  background-color: rgba(255, 255, 255, 0.92);
  box-shadow: 0 8px 32px rgba(42, 32, 24, 0.1);
}

.nav-logo {
  transition: filter 0.4s ease, opacity 0.4s ease;
}

.nav-logo--light {
  filter: brightness(0) invert(1) drop-shadow(0 1px 4px rgba(0, 0, 0, 0.35));
}

.nav-logo--dark {
  filter: brightness(0);
}

.nav-link {
  transition: color 0.4s ease;
}

.nav-link--light {
  color: rgba(255, 255, 255, 0.9);
}

.nav-link--light:hover {
  color: #fff;
}

.nav-link--dark {
  color: #2a2018;
}

.nav-link--dark:hover {
  color: #000;
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.3s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}
</style>
