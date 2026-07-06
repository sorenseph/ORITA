import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productVisuals, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from '../data/content'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const isOpen = ref(false)
  const view = ref('drawer')
  const couponCode = ref('')
  const couponApplied = ref(false)
  const checkoutStep = ref(1)
  const lastTrackingCode = ref('')

  function generateTrackingCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let suffix = ''
    for (let i = 0; i < 6; i++) suffix += chars[Math.floor(Math.random() * chars.length)]
    return `ORITA-MX-${suffix}`
  }

  const checkoutData = ref({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  })

  const itemCount = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))

  const subtotal = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )

  const discount = computed(() => {
    if (!couponApplied.value) return 0
    return Math.round(subtotal.value * 0.1)
  })

  const shipping = computed(() => {
    if (subtotal.value >= FREE_SHIPPING_THRESHOLD) return 0
    return items.value.length ? SHIPPING_COST : 0
  })

  const total = computed(() => subtotal.value - discount.value + shipping.value)

  function addItem(productId, quantity = 1, openDrawer = false) {
    const product = productVisuals.find((p) => p.id === productId)
    if (!product) return

    const existing = items.value.find((i) => i.id === productId)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({
        id: product.id,
        price: product.price,
        image: product.image,
        quantity,
      })
    }
    if (openDrawer) {
      view.value = 'drawer'
      isOpen.value = true
    }
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find((i) => i.id === productId)
    if (!item) return
    if (quantity <= 0) removeItem(productId)
    else item.quantity = quantity
  }

  function removeItem(productId) {
    items.value = items.value.filter((i) => i.id !== productId)
  }

  function applyCoupon(code) {
    if (code.toUpperCase() === 'ORITA10') {
      couponCode.value = code
      couponApplied.value = true
      return true
    }
    return false
  }

  function openCart(mode = 'drawer') {
    view.value = mode === 'checkout' ? 'checkout' : 'drawer'
    isOpen.value = true
  }

  function closeCart() {
    isOpen.value = false
    if (view.value === 'checkout') checkoutStep.value = 1
  }

  function startCheckout() {
    view.value = 'checkout'
    checkoutStep.value = 1
  }

  function nextCheckoutStep() {
    if (checkoutStep.value < 3) checkoutStep.value++
  }

  function prevCheckoutStep() {
    if (checkoutStep.value > 1) checkoutStep.value--
  }

  function completeOrder() {
    lastTrackingCode.value = generateTrackingCode()
    items.value = []
    couponApplied.value = false
    couponCode.value = ''
    checkoutStep.value = 1
    view.value = 'drawer'
    isOpen.value = false
    return true
  }

  return {
    items, isOpen, view, couponCode, couponApplied, checkoutStep, checkoutData, lastTrackingCode,
    itemCount, subtotal, discount, shipping, total,
    addItem, updateQuantity, removeItem, applyCoupon,
    openCart, closeCart, startCheckout, nextCheckoutStep, prevCheckoutStep, completeOrder,
  }
})
