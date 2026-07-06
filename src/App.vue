<script setup>
import { defineAsyncComponent, ref } from 'vue'
import { useLenis } from './composables/useLenis'
import AppNav from './components/layout/AppNav.vue'
import AppLoader from './components/ui/AppLoader.vue'
import CustomCursor from './components/ui/CustomCursor.vue'
import HeroSection from './components/hero/HeroSection.vue'
import CartDrawer from './components/shop/CartDrawer.vue'
import ContactSection from './components/contact/ContactSection.vue'
import ShopSection from './components/shop/ShopSection.vue'
import ShippingTracker from './components/shop/ShippingTracker.vue'
import LoginModal from './components/auth/LoginModal.vue'
import LegalModal from './components/legal/LegalModal.vue'

const StoryLabSection = defineAsyncComponent(() => import('./components/story/StoryLabSection.vue'))
const FlavorsSection = defineAsyncComponent(() => import('./components/flavors/FlavorsSection.vue'))
const BenefitsSection = defineAsyncComponent(() => import('./components/benefits/BenefitsSection.vue'))
const MapExperience = defineAsyncComponent(() => import('./components/map/MapExperience.vue'))
const TestimonialsSection = defineAsyncComponent(() => import('./components/testimonials/TestimonialsSection.vue'))
const InstagramMosaic = defineAsyncComponent(() => import('./components/instagram/InstagramMosaic.vue'))
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
    <CustomCursor />
    <AppNav />
    <main class="relative">
      <HeroSection />
      <div class="section-sand tropical-grain section-sand--light" data-nav-contrast="light">
        <StoryLabSection />
        <FlavorsSection />
        <BenefitsSection />
        <ShopSection />
        <ContactSection />
        <MapExperience />
        <TestimonialsSection />
        <InstagramMosaic />
      </div>
    </main>
    <ShippingTracker />
    <AppFooter />
    <CartDrawer />
    <LoginModal />
    <LegalModal />
  </div>
</template>
