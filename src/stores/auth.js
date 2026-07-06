import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isOpen = ref(false)
  const user = ref(null)

  function openLogin() {
    isOpen.value = true
  }

  function closeLogin() {
    isOpen.value = false
  }

  function login(email) {
    user.value = { email, name: email.split('@')[0] }
    isOpen.value = false
    return true
  }

  function logout() {
    user.value = null
  }

  return { isOpen, user, openLogin, closeLogin, login, logout }
})
