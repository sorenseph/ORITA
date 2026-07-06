<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useContactForm } from '../../composables/useContactForm'
import { scrollTo } from '../../composables/useLenis'
import BeachDecor from '../tropical/BeachDecor.vue'

const { t } = useI18n()

const {
  form, errors, touched, submitted, isValid,
  onNameInput, onEmailInput, onPhoneInput, onMessageInput, onBlur, submit,
  NAME_MAX, EMAIL_MAX, PHONE_MAX, MESSAGE_MAX,
} = useContactForm()

const channels = computed(() => [
  { icon: '/images/instagram.png', label: 'Instagram', value: '@drinkorita', href: 'https://www.instagram.com/drinkorita/', external: true },
  { icon: '/images/facebook.png', label: 'Facebook', value: 'drinkorita', href: 'https://www.facebook.com/drinkorita/', external: true },
  { icon: '/images/store_icon.png', label: t('contact.shop'), value: t('contact.shopHint'), action: 'shop' },
])

function errorText(field) {
  const key = errors[field]
  if (!key) return ''
  return t(`contact.errors.${field}.${key}`)
}

function handleSubmit(e) {
  e.preventDefault()
  if (submit()) {
    window.setTimeout(() => { submitted.success = false }, 5000)
  }
}

function onChannelClick(ch) {
  if (ch.action === 'shop') scrollTo('#shop', { offset: -96 })
}
</script>

<template>
  <section id="contact" data-nav-contrast="dark" class="relative overflow-hidden bg-[#2A7A72] py-24 text-white md:py-32">
    <BeachDecor />
    <div class="tropical-grain pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden="true" />

    <div class="content-layer mx-auto max-w-6xl px-5 md:px-8">
      <header class="mb-12 text-center md:mb-16">
        <img src="/images/logo_footer.png" alt="Orita" class="mx-auto mb-6 h-12 w-auto md:h-14" />
        <p class="mb-3 font-body text-sm tracking-[0.3em] text-white/70 uppercase">{{ t('contact.eyebrow') }}</p>
        <h2 class="font-editorial text-[clamp(2rem,5vw,3.5rem)] leading-tight">
          {{ t('contact.title') }} <span class="text-[#E8C84A]">{{ t('contact.titleHighlight') }}</span>
        </h2>
        <p class="mx-auto mt-4 max-w-lg font-body text-base text-white/75 md:text-lg">{{ t('contact.intro') }}</p>
      </header>

      <div class="grid gap-10 lg:grid-cols-5 lg:gap-14">
        <div class="space-y-6 lg:col-span-2">
          <div class="rounded-3xl bg-white/10 p-6 backdrop-blur-sm md:p-8">
            <h3 class="mb-4 font-display text-xl font-bold">{{ t('contact.infoTitle') }}</h3>
            <p class="mb-6 font-body text-sm leading-relaxed text-white/75">{{ t('contact.infoText') }}</p>
            <ul class="space-y-3">
              <li v-for="ch in channels" :key="ch.label">
                <a
                  v-if="ch.external"
                  :href="ch.href"
                  target="_blank"
                  rel="noopener"
                  class="group flex items-center gap-4 rounded-2xl bg-white/8 p-4 transition-all hover:bg-white/15"
                >
                  <img :src="ch.icon" alt="" class="h-5 w-5 brightness-0 invert opacity-80" />
                  <div>
                    <p class="font-display text-sm font-bold">{{ ch.label }}</p>
                    <p class="font-body text-xs text-white/60 group-hover:text-white/80">{{ ch.value }}</p>
                  </div>
                  <span class="ml-auto text-white/40 transition-transform group-hover:translate-x-1">→</span>
                </a>
                <button
                  v-else
                  type="button"
                  class="group flex w-full items-center gap-4 rounded-2xl bg-white/8 p-4 text-left transition-all hover:bg-white/15"
                  @click="onChannelClick(ch)"
                >
                  <img :src="ch.icon" alt="" class="h-5 w-5 brightness-0 invert opacity-80" />
                  <div>
                    <p class="font-display text-sm font-bold">{{ ch.label }}</p>
                    <p class="font-body text-xs text-white/60 group-hover:text-white/80">{{ ch.value }}</p>
                  </div>
                  <span class="ml-auto text-white/40 transition-transform group-hover:translate-x-1">→</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <form class="lg:col-span-3 space-y-5 rounded-3xl bg-[#F7F0E3] p-6 text-[#2A2018] shadow-xl md:p-10" novalidate @submit="handleSubmit">
          <h3 class="font-display text-xl font-bold md:text-2xl">{{ t('contact.formTitle') }}</h3>

          <div>
            <label for="contact-name" class="mb-1.5 block font-body text-sm font-medium">{{ t('contact.fields.name') }} *</label>
            <input id="contact-name" :value="form.name" type="text" :maxlength="NAME_MAX" class="field-input" :class="touched.name && errors.name ? 'border-red-400' : ''" :placeholder="t('contact.placeholders.name')" @input="onNameInput" @blur="onBlur('name')" />
            <p v-if="touched.name && errors.name" class="mt-1 text-xs text-red-500">{{ errorText('name') }}</p>
            <p v-else class="mt-1 text-xs text-[#2A2018]/35">{{ form.name.length }}/{{ NAME_MAX }}</p>
          </div>

          <div>
            <label for="contact-email" class="mb-1.5 block font-body text-sm font-medium">{{ t('contact.fields.email') }} *</label>
            <input id="contact-email" :value="form.email" type="email" :maxlength="EMAIL_MAX" class="field-input" :class="touched.email && errors.email ? 'border-red-400' : ''" :placeholder="t('contact.placeholders.email')" @input="onEmailInput" @blur="onBlur('email')" />
            <p v-if="touched.email && errors.email" class="mt-1 text-xs text-red-500">{{ errorText('email') }}</p>
          </div>

          <div>
            <label for="contact-phone" class="mb-1.5 block font-body text-sm font-medium">
              {{ t('contact.fields.phone') }}
              <span class="font-normal text-[#2A2018]/45">({{ t('contact.phoneHint') }})</span>
            </label>
            <input id="contact-phone" :value="form.phone" type="number" inputmode="numeric" autocomplete="tel" min="0" :maxlength="PHONE_MAX" class="field-input" :class="touched.phone && errors.phone ? 'border-red-400' : ''" :placeholder="t('contact.placeholders.phone')" @input="onPhoneInput" @blur="onBlur('phone')" />
            <p v-if="touched.phone && errors.phone" class="mt-1 text-xs text-red-500">{{ errorText('phone') }}</p>
          </div>

          <div>
            <label for="contact-message" class="mb-1.5 block font-body text-sm font-medium">{{ t('contact.fields.message') }} *</label>
            <textarea id="contact-message" :value="form.message" rows="4" :maxlength="MESSAGE_MAX" class="field-input resize-none" :class="touched.message && errors.message ? 'border-red-400' : ''" :placeholder="t('contact.placeholders.message')" @input="onMessageInput" @blur="onBlur('message')" />
            <div class="mt-1 flex justify-between">
              <p v-if="touched.message && errors.message" class="text-xs text-red-500">{{ errorText('message') }}</p>
              <p class="ml-auto text-xs text-[#2A2018]/40">{{ form.message.length }}/{{ MESSAGE_MAX }}</p>
            </div>
          </div>

          <button type="submit" class="w-full rounded-full py-4 font-display text-base font-bold transition-all" :class="isValid ? 'bg-[#2A7A72] text-white hover:scale-[1.02] shadow-md' : 'cursor-not-allowed bg-[#2A2018]/15 text-[#2A2018]/40'" :disabled="!isValid">
            {{ t('contact.submit') }}
          </button>

          <p v-if="submitted.success" class="rounded-xl bg-[#4AAB9E]/20 px-4 py-3 text-center font-body text-sm text-[#2A7A72]">
            {{ t('contact.success') }}
          </p>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.field-input {
  width: 100%; border-radius: 0.75rem; border: 1px solid rgba(42,32,24,0.15);
  padding: 0.75rem 1rem; font-family: var(--font-body); font-size: 0.9375rem;
  color: #2A2018; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
}
.field-input:focus { border-color: #4AAB9E; box-shadow: 0 0 0 3px rgba(74,171,158,0.15); }
.field-input[type='number'] { -moz-appearance: textfield; }
.field-input[type='number']::-webkit-outer-spin-button,
.field-input[type='number']::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
</style>
