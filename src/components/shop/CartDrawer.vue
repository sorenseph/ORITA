<script setup>
import { ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '../../stores/cart'
import { FREE_SHIPPING_THRESHOLD } from '../../data/content'
import { scrollTo } from '../../composables/useLenis'

const { t } = useI18n()
const cart = useCartStore()
const couponInput = ref('')
const couponError = ref(false)
const orderComplete = ref(false)
const completedTracking = ref('')

function productName(id) {
  const key = `shop.products.${id}.name`
  const translated = t(key)
  return translated === key ? id : translated
}

watch(
  () => cart.isOpen,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) {
      if (cart.view === 'checkout') cart.checkoutStep = 1
      cart.view = 'drawer'
    }
  }
)

function applyCoupon() {
  couponError.value = !cart.applyCoupon(couponInput.value)
}

function finishOrder() {
  cart.completeOrder()
  completedTracking.value = cart.lastTrackingCode
  orderComplete.value = true
  setTimeout(() => {
    orderComplete.value = false
    completedTracking.value = ''
  }, 8000)
}

function goToShop() {
  cart.closeCart()
  scrollTo('#shop', { offset: -96 })
}

function goToTracking() {
  cart.closeCart()
  scrollTo('#tracking', { offset: -96 })
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="cart.isOpen" class="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm" @click="cart.closeCart()" />
    </Transition>

    <Transition name="slide">
      <aside
        v-if="cart.isOpen"
        class="fixed top-0 right-0 z-[201] flex h-full flex-col bg-[#1a3c38] shadow-2xl"
        :class="cart.view === 'checkout' ? 'w-full max-w-lg' : 'w-full max-w-md'"
        data-lenis-prevent
        role="dialog"
        :aria-label="t('cart.title')"
      >
        <div class="flex items-center justify-between border-b border-white/10 px-5 py-4 md:px-6">
          <div class="flex items-center gap-3">
            <button v-if="cart.view === 'checkout' && cart.checkoutStep > 1" class="text-white/60 hover:text-white" @click="cart.prevCheckoutStep()">←</button>
            <h2 class="font-display text-xl font-bold text-white">{{ cart.view === 'checkout' ? t('cart.checkout') : t('cart.title') }}</h2>
            <span v-if="cart.itemCount" class="rounded-full bg-[#4AAB9E] px-2 py-0.5 font-body text-xs text-white">{{ cart.itemCount }}</span>
          </div>
          <button class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 hover:text-white" :aria-label="t('cart.close')" @click="cart.closeCart()">✕</button>
        </div>

        <Transition name="fade">
          <div v-if="orderComplete" class="mx-5 mt-4 rounded-2xl bg-[#4AAB9E] p-4 text-center">
            <p class="font-display font-bold text-white">{{ t('cart.orderDone') }}</p>
            <p v-if="completedTracking" class="mt-2 font-body text-xs text-white/85">{{ t('cart.trackingLabel') }}</p>
            <p v-if="completedTracking" class="mt-1 font-mono text-sm font-bold tracking-wide text-white">{{ completedTracking }}</p>
            <button
              v-if="completedTracking"
              type="button"
              class="mt-3 font-body text-xs text-white/80 underline underline-offset-2 hover:text-white"
              @click="goToTracking"
            >
              {{ t('cart.trackShipment') }}
            </button>
          </div>
        </Transition>

        <div v-if="!cart.items.length && cart.view !== 'checkout'" class="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <img src="/images/bottle_1.webp" alt="" class="h-32 w-auto object-contain opacity-80" />
          <p class="font-body text-white/60">{{ t('cart.empty') }}</p>
          <button class="rounded-full bg-white px-6 py-3 font-display text-sm font-bold text-[#1a3c38]" @click="goToShop">{{ t('cart.goToShop') }}</button>
        </div>

        <div v-else-if="cart.view !== 'checkout'" class="flex flex-1 flex-col overflow-hidden">
          <div class="flex-1 overflow-y-auto px-5 py-4 md:px-6">
            <div v-for="item in cart.items" :key="item.id" class="mb-4 flex gap-4 rounded-2xl bg-white/10 p-4">
              <img :src="item.image" :alt="productName(item.id)" class="h-20 w-16 object-contain" />
              <div class="flex flex-1 flex-col">
                <h3 class="font-display text-sm font-bold text-white">{{ productName(item.id) }}</h3>
                <p class="font-display text-[#4AAB9E]">${{ item.price }} MXN</p>
                <div class="mt-auto flex items-center gap-3">
                  <button class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white" @click="cart.updateQuantity(item.id, item.quantity - 1)">−</button>
                  <span class="min-w-[1.5rem] text-center font-body text-sm text-white">{{ item.quantity }}</span>
                  <button class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white" @click="cart.updateQuantity(item.id, item.quantity + 1)">+</button>
                  <button class="ml-auto text-xs text-white/40 hover:text-red-300" @click="cart.removeItem(item.id)">{{ t('cart.remove') }}</button>
                </div>
              </div>
            </div>
            <div class="mt-4 rounded-2xl bg-white/8 p-4">
              <p class="mb-2 font-body text-xs text-white/50">{{ t('cart.couponHint') }}</p>
              <div class="flex gap-2">
                <input v-model="couponInput" type="text" :placeholder="t('cart.couponPlaceholder')" class="checkout-input flex-1" />
                <button class="rounded-xl bg-white/15 px-4 py-2 font-body text-sm text-white hover:bg-white/25" @click="applyCoupon">{{ t('cart.apply') }}</button>
              </div>
              <p v-if="couponError" class="mt-1 font-body text-xs text-red-300">{{ t('cart.couponInvalid') }}</p>
              <p v-if="cart.couponApplied" class="mt-1 font-body text-xs text-[#4AAB9E]">{{ t('cart.couponApplied') }}</p>
            </div>
          </div>
          <div class="border-t border-white/10 px-5 py-5 md:px-6">
            <div class="mb-2 flex justify-between font-body text-sm text-white/60"><span>{{ t('cart.subtotal') }}</span><span>${{ cart.subtotal }}</span></div>
            <div v-if="cart.discount" class="mb-2 flex justify-between font-body text-sm text-[#4AAB9E]"><span>{{ t('cart.discount') }}</span><span>-${{ cart.discount }}</span></div>
            <div class="mb-4 flex justify-between font-body text-sm text-white/60">
              <span>{{ t('cart.shipping') }}</span><span>{{ cart.shipping ? `$${cart.shipping}` : t('cart.freeShipping') }}</span>
            </div>
            <p v-if="cart.subtotal < FREE_SHIPPING_THRESHOLD && cart.subtotal > 0" class="mb-3 font-body text-xs text-white/40">{{ t('cart.freeShippingHint', { amount: FREE_SHIPPING_THRESHOLD }) }}</p>
            <div class="mb-4 flex justify-between font-display text-xl font-bold text-white"><span>{{ t('cart.total') }}</span><span>${{ cart.total }}</span></div>
            <button class="w-full rounded-full bg-white py-3.5 font-display text-sm font-bold text-[#1a3c38] transition-all hover:scale-[1.02]" @click="cart.startCheckout()">{{ t('cart.proceed') }}</button>
          </div>
        </div>

        <div v-else class="flex flex-1 flex-col overflow-hidden">
          <div class="flex gap-2 px-5 py-3 md:px-6">
            <div v-for="step in 3" :key="step" class="h-1 flex-1 rounded-full" :class="cart.checkoutStep >= step ? 'bg-[#4AAB9E]' : 'bg-white/10'" />
          </div>
          <div class="flex-1 overflow-y-auto px-5 py-4 md:px-6">
            <div v-if="cart.checkoutStep === 1" class="space-y-3">
              <h3 class="mb-2 font-display text-lg font-bold text-white">{{ t('cart.address') }}</h3>
              <input v-model="cart.checkoutData.name" type="text" :placeholder="t('cart.fields.name')" class="checkout-input" />
              <input v-model="cart.checkoutData.email" type="email" :placeholder="t('cart.fields.email')" class="checkout-input" />
              <input v-model="cart.checkoutData.address" type="text" :placeholder="t('cart.fields.address')" class="checkout-input" />
              <div class="grid grid-cols-2 gap-3">
                <input v-model="cart.checkoutData.city" type="text" :placeholder="t('cart.fields.city')" class="checkout-input" />
                <input v-model="cart.checkoutData.zip" type="text" :placeholder="t('cart.fields.zip')" class="checkout-input" />
              </div>
            </div>
            <div v-if="cart.checkoutStep === 2" class="space-y-3">
              <h3 class="mb-2 font-display text-lg font-bold text-white">{{ t('cart.payment') }}</h3>
              <input v-model="cart.checkoutData.cardNumber" type="text" :placeholder="t('cart.fields.card')" maxlength="19" class="checkout-input" />
              <div class="grid grid-cols-2 gap-3">
                <input v-model="cart.checkoutData.cardExpiry" type="text" :placeholder="t('cart.fields.expiry')" maxlength="5" class="checkout-input" />
                <input v-model="cart.checkoutData.cardCvc" type="text" :placeholder="t('cart.fields.cvc')" maxlength="4" class="checkout-input" />
              </div>
              <p class="font-body text-xs text-white/40">{{ t('cart.paymentNote') }}</p>
            </div>
            <div v-if="cart.checkoutStep === 3">
              <h3 class="mb-4 font-display text-lg font-bold text-white">{{ t('cart.summary') }}</h3>
              <div v-for="item in cart.items" :key="item.id" class="mb-2 flex justify-between font-body text-sm text-white/70">
                <span>{{ productName(item.id) }} × {{ item.quantity }}</span>
                <span>${{ item.price * item.quantity }}</span>
              </div>
              <div class="mt-4 border-t border-white/10 pt-4 font-display text-lg font-bold text-white">
                <div class="flex justify-between"><span>{{ t('cart.total') }}</span><span>${{ cart.total }}</span></div>
              </div>
            </div>
          </div>
          <div class="border-t border-white/10 px-5 py-5 md:px-6">
            <button v-if="cart.checkoutStep < 3" class="w-full rounded-full bg-white py-3.5 font-display text-sm font-bold text-[#1a3c38]" @click="cart.nextCheckoutStep()">{{ t('cart.continue') }}</button>
            <button v-else class="w-full rounded-full bg-[#4AAB9E] py-3.5 font-display text-sm font-bold text-white hover:scale-[1.02]" @click="finishOrder">{{ t('cart.confirm', { total: cart.total }) }}</button>
          </div>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.checkout-input {
  width: 100%; border-radius: 0.75rem; background: rgba(255,255,255,0.08);
  padding: 0.75rem 1rem; font-family: var(--font-body); font-size: 0.875rem;
  color: white; outline: none; border: 1px solid rgba(255,255,255,0.1);
}
.checkout-input::placeholder { color: rgba(255,255,255,0.35); }
.checkout-input:focus { border-color: #4AAB9E; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
