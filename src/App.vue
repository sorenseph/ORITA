<script setup>
import { defineAsyncComponent, ref } from 'vue'
import { useLenis } from './composables/useLenis'
import AppNav from './components/layout/AppNav.vue'
import AppLoader from './components/ui/AppLoader.vue'
import HeroSection from './components/hero/HeroSection.vue'
import CartDrawer from './components/shop/CartDrawer.vue'
import ContactSection from './components/contact/ContactSection.vue'

const StoryLabSection = defineAsyncComponent(() => import('./components/story/StoryLabSection.vue'))
const FlavorsSection = defineAsyncComponent(() => import('./components/flavors/FlavorsSection.vue'))
const BenefitsSection = defineAsyncComponent(() => import('./components/benefits/BenefitsSection.vue'))
const MapExperience = defineAsyncComponent(() => import('./components/map/MapExperience.vue'))
const TestimonialsSection = defineAsyncComponent(() => import('./components/testimonials/TestimonialsSection.vue'))
const InstagramMosaic = defineAsyncComponent(() => import('./components/instagram/InstagramMosaic.vue'))
const ShopSection = defineAsyncComponent(() => import('./components/shop/ShopSection.vue'))
const AppFooter = defineAsyncComponent(() => import('./components/layout/AppFooter.vue'))

const showLoader = ref(true)

useLenis()

function onLoaderDone() {
  showLoader.value = false
  document.body.classList.add('loaded')
}
</script>

<template>
  <div class="relative min-h-screen">
    <AppLoader v-if="showLoader" @done="onLoaderDone" />
    <AppNav />
    <main class="relative">
      <HeroSection />
      <div class="section-sand tropical-grain section-sand--light" data-nav-contrast="light">
        <StoryLabSection />
        <FlavorsSection />
        <BenefitsSection />
        <ContactSection />
        <MapExperience />
        <TestimonialsSection />
        <InstagramMosaic />
        <ShopSection />
      </div>
    </main>
    <AppFooter />
    <CartDrawer />
  </div>
</template>
