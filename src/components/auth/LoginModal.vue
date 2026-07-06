<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/auth'

const { t } = useI18n()
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')

function submit() {
  error.value = ''
  if (!email.value.trim() || !password.value.trim()) {
    error.value = t('auth.errors.required')
    return
  }
  auth.login(email.value.trim())
  email.value = ''
  password.value = ''
}

function close() {
  auth.closeLogin()
  error.value = ''
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="auth.isOpen" class="fixed inset-0 z-[220] bg-black/45 backdrop-blur-sm" @click="close" />
    </Transition>
    <Transition name="modal">
      <div
        v-if="auth.isOpen"
        class="fixed top-1/2 left-1/2 z-[221] w-[min(100%,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 shadow-2xl md:p-8"
        role="dialog"
        :aria-label="t('auth.title')"
      >
        <button
          type="button"
          class="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-[#2A2018]/40 hover:bg-[#2A2018]/5 hover:text-[#2A2018]"
          :aria-label="t('auth.close')"
          @click="close"
        >
          ✕
        </button>
        <img src="/images/logo_header.png" alt="Orita" class="mx-auto mb-5 h-8 w-auto" />
        <h2 class="mb-1 text-center font-display text-xl font-bold text-[#2A2018]">{{ t('auth.title') }}</h2>
        <p class="mb-6 text-center font-body text-sm text-[#2A2018]/55">{{ t('auth.subtitle') }}</p>
        <form class="space-y-3" @submit.prevent="submit">
          <input v-model="email" type="email" :placeholder="t('auth.email')" class="auth-input" autocomplete="email" />
          <input v-model="password" type="password" :placeholder="t('auth.password')" class="auth-input" autocomplete="current-password" />
          <p v-if="error" class="font-body text-xs text-red-500">{{ error }}</p>
          <button type="submit" class="w-full rounded-full bg-[#2A7A72] py-3 font-display text-sm font-bold text-white transition-colors hover:bg-[#236860]">
            {{ t('auth.submit') }}
          </button>
        </form>
        <p class="mt-4 text-center font-body text-xs text-[#2A2018]/40">{{ t('auth.demoNote') }}</p>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.auth-input {
  width: 100%;
  border-radius: 0.75rem;
  border: 1px solid rgba(42, 32, 24, 0.12);
  background: #f7f0e3;
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: #2a2018;
  outline: none;
}
.auth-input:focus { border-color: #2a7a72; }
.auth-input::placeholder { color: rgba(42, 32, 24, 0.35); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
</style>
