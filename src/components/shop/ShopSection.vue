<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '../../stores/cart'
import { useLocalizedProducts } from '../../composables/useLocalizedContent'
import { gsap, ScrollTrigger, scrollTo } from '../../composables/useLenis'
import { useSectionLife } from '../../composables/useSectionLife'
import TropicalSplash from '../tropical/TropicalSplash.vue'

const { t } = useI18n()
const cart = useCartStore()
const products = useLocalizedProducts()
const sectionRef = ref(null)
const filter = ref('all')
const expandedId = ref(null)

const filters = computed(() => [
  { id: 'all', label: t('shop.filters.all') },
  { id: 'tamarind', label: t('shop.filters.tamarind') },
  { id: 'guava', label: t('shop.filters.guava') },
  { id: 'lime', label: t('shop.filters.lime') },
  { id: 'hibiscus', label: t('shop.filters.hibiscus') },
  { id: 'discovery', label: t('shop.filters.discovery') },
])

const filtered = computed(() => {
  if (filter.value === 'all') return products.value
  if (filter.value === 'discovery') return products.value.filter((p) => p.id === 'pack-12-discovery')
  return products.value.filter((p) => p.flavorId === filter.value)
})

function addToCart(product) {
  cart.addItem(product.id, 1, true)
}

function toggleDetails(id) {
  expandedId.value = expandedId.value === id ? null : id
}

useSectionLife(sectionRef)

onMounted(async () => {
  await nextTick()
  ScrollTrigger.refresh()

  gsap.from('.shop-heading', {
    y: 60,
    opacity: 0,
    duration: 1,
    scrollTrigger: { trigger: sectionRef.value, start: 'top 85%', once: true },
    clearProps: 'opacity,transform',
  })

  gsap.from('.product-card', {
    y: 36,
    opacity: 0,
    duration: 0.6,
    stagger: 0.08,
    scrollTrigger: { trigger: sectionRef.value, start: 'top 80%', once: true },
    clearProps: 'opacity,transform',
  })
})
</script>

<template>
  <section id="shop" ref="sectionRef" data-nav-contrast="dark" class="section-green relative overflow-hidden py-24 md:py-40">
    <TropicalSplash color="#F7F0E3" flip simple />
    <div class="content-layer relative z-10 mx-auto max-w-7xl px-5 md:px-8">
      <div class="shop-heading mb-10 md:mb-14">
        <p class="mb-3 font-body text-sm tracking-[0.3em] text-white/70 uppercase">{{ t('shop.eyebrow') }}</p>
        <h2 class="font-display text-4xl font-bold md:text-6xl lg:text-7xl">
          {{ t('shop.title') }} <span class="text-[#E8C84A]">{{ t('shop.titleHighlight') }}</span>
        </h2>
        <p class="mt-4 max-w-2xl font-body text-base text-white/80 md:text-lg">{{ t('shop.intro') }}</p>
      </div>

      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="f in filters"
            :key="f.id"
            class="rounded-full px-4 py-2 font-body text-sm transition-all md:px-5"
            :class="filter === f.id ? 'bg-white font-semibold text-[#2A2018]' : 'bg-white/15 text-white/80 hover:bg-white/25 hover:text-white'"
            @click="filter = f.id"
          >
            {{ f.label }}
          </button>
        </div>
        <button
          type="button"
          class="magnetic-btn hidden items-center gap-2 rounded-full border border-white/25 px-4 py-2 font-body text-sm text-white/85 transition-colors hover:bg-white/10 sm:inline-flex"
          @click="scrollTo('#tracking', { offset: -96 })"
        >
          {{ t('shop.trackOrder') }}
        </button>
      </div>

      <div v-if="filtered.length" class="grid gap-6 lg:grid-cols-2">
        <article
          v-for="product in filtered"
          :key="product.id"
          class="product-card glass-ice group overflow-hidden rounded-3xl text-[#2A2018] shadow-lg transition-shadow duration-500 hover:shadow-xl"
        >
          <div class="grid md:grid-cols-2">
            <div class="relative flex min-h-[220px] items-center justify-center bg-[#F7F0E3] p-6 md:min-h-[280px]">
              <div v-if="product.badge" class="absolute left-4 top-4 z-10 rounded-full bg-[#E8C84A] px-3 py-1 font-display text-xs font-bold text-[#2A2018]">
                {{ product.badge }}
              </div>
              <img :src="product.image" :alt="product.name" class="product-bottle-img max-h-48 w-auto max-w-full object-contain md:max-h-52" loading="lazy" />
            </div>

            <div class="flex flex-col border-t border-[#2A2018]/8 p-5 md:border-l md:border-t-0 md:p-6">
              <p class="mb-1 font-body text-xs font-medium uppercase tracking-wider text-[#2A7A72]">{{ t('shop.perPack') }}</p>
              <h3 class="mb-2 font-display text-lg font-bold leading-snug md:text-xl">{{ product.name }}</h3>
              <p class="mb-4 font-body text-sm leading-relaxed text-[#2A2018]/65">{{ product.description }}</p>

              <ul class="mb-4 space-y-1.5">
                <li
                  v-for="h in product.highlights.slice(0, expandedId === product.id ? undefined : 2)"
                  :key="h.key"
                  class="flex gap-2 font-body text-xs leading-relaxed text-[#2A2018]/70"
                >
                  <span class="mt-0.5 shrink-0 text-[#4AAB9E]">✓</span>
                  <span>{{ h.text }}</span>
                </li>
              </ul>

              <button
                type="button"
                class="mb-4 self-start font-body text-xs font-semibold text-[#2A7A72] underline-offset-2 hover:underline"
                @click="toggleDetails(product.id)"
              >
                {{ expandedId === product.id ? t('shop.hideSpecs') : t('shop.showSpecs') }}
              </button>

              <dl v-if="expandedId === product.id" class="mb-4 space-y-2 rounded-2xl bg-[#F7F0E3] p-4">
                <div v-for="spec in product.specs" :key="spec.key" class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-body text-xs">
                  <dt class="font-semibold text-[#2A2018]/55">{{ spec.label }}</dt>
                  <dd class="text-[#2A2018]/80">{{ spec.value }}</dd>
                </div>
              </dl>

              <div class="mt-auto flex items-center justify-between gap-3 border-t border-[#2A2018]/8 pt-4">
                <div>
                  <span class="font-display text-2xl font-bold text-[#2A7A72]">${{ product.price }}</span>
                  <span class="ml-1 font-body text-xs text-[#2A2018]/45">MXN</span>
                </div>
                <button
                  class="magnetic-btn rounded-full bg-[#2A7A72] px-5 py-2.5 font-display text-sm font-bold text-white transition-all"
                  @click="addToCart(product)"
                >
                  {{ t('shop.add') }}
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>

      <p v-else class="rounded-2xl bg-white/10 px-6 py-10 text-center font-body text-white/70">
        {{ t('shop.empty') }}
      </p>

      <div class="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <button class="magnetic-btn rounded-full bg-white px-8 py-4 font-display text-base font-bold text-[#2A7A72] shadow-md transition-all" @click="cart.openCart('drawer')">
          {{ t('shop.viewCart', { count: cart.itemCount }) }}
        </button>
        <p class="font-body text-sm text-white/70">{{ t('shop.perPack') }} · $389 MXN · {{ t('shop.shippingNote') }}</p>
      </div>
    </div>
  </section>
</template>
