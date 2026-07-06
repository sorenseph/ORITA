<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '../../stores/cart'

const { t } = useI18n()
const cart = useCartStore()
const code = ref('')
const result = ref(null)
const searched = ref(false)

const demoStatuses = [
  { key: 'confirmed', label: 'confirmed' },
  { key: 'preparing', label: 'preparing' },
  { key: 'shipped', label: 'shipped' },
  { key: 'delivered', label: 'delivered' },
]

function track() {
  searched.value = true
  const trimmed = code.value.trim().toUpperCase()
  if (!trimmed) {
    result.value = null
    return
  }
  if (trimmed === cart.lastTrackingCode) {
    result.value = { found: true, status: 'shipped', code: trimmed }
    return
  }
  if (/^ORITA-MX-[A-Z0-9]{6}$/.test(trimmed)) {
    result.value = { found: true, status: 'preparing', code: trimmed }
    return
  }
  result.value = { found: false, code: trimmed }
}
</script>

<template>
  <section id="tracking" class="border-t border-[#2A2018]/6 bg-[#F7F0E3] py-10 md:py-12">
    <div class="mx-auto max-w-xl px-5 md:px-8">
      <p class="mb-1 text-center font-body text-[11px] tracking-[0.25em] text-[#2A2018]/40 uppercase">{{ t('tracking.eyebrow') }}</p>
      <h2 class="mb-2 text-center font-display text-lg font-bold text-[#2A2018]/80 md:text-xl">{{ t('tracking.title') }}</h2>
      <p class="mb-5 text-center font-body text-xs text-[#2A2018]/45">{{ t('tracking.hint') }}</p>
      <form class="flex gap-2" @submit.prevent="track">
        <input
          v-model="code"
          type="text"
          :placeholder="t('tracking.placeholder')"
          class="tracking-input flex-1"
          spellcheck="false"
        />
        <button type="submit" class="shrink-0 rounded-full bg-[#2A7A72]/90 px-5 py-2.5 font-display text-xs font-bold text-white transition-colors hover:bg-[#2A7A72]">
          {{ t('tracking.submit') }}
        </button>
      </form>
      <div v-if="searched && result?.found" class="mt-4 rounded-2xl border border-[#2A7A72]/15 bg-white/60 px-4 py-3">
        <p class="font-body text-xs text-[#2A2018]/50">{{ result.code }}</p>
        <p class="mt-1 font-display text-sm font-bold text-[#2A7A72]">{{ t(`tracking.status.${result.status}`) }}</p>
        <ol class="mt-3 flex justify-between gap-1">
          <li
            v-for="(step, i) in demoStatuses"
            :key="step.key"
            class="flex flex-1 flex-col items-center gap-1"
          >
            <span
              class="h-1.5 w-full rounded-full"
              :class="demoStatuses.findIndex((s) => s.key === result.status) >= i ? 'bg-[#4AAB9E]' : 'bg-[#2A2018]/10'"
            />
            <span class="text-center font-body text-[9px] leading-tight text-[#2A2018]/40">{{ t(`tracking.steps.${step.label}`) }}</span>
          </li>
        </ol>
      </div>
      <p v-else-if="searched && result && !result.found" class="mt-3 text-center font-body text-xs text-[#2A2018]/45">
        {{ t('tracking.notFound') }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.tracking-input {
  border-radius: 9999px;
  border: 1px solid rgba(42, 32, 24, 0.1);
  background: rgba(255, 255, 255, 0.7);
  padding: 0.625rem 1rem;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  color: #2a2018;
  outline: none;
}
.tracking-input:focus { border-color: #2a7a72; }
.tracking-input::placeholder { color: rgba(42, 32, 24, 0.3); }
</style>
