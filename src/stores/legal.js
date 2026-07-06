import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLegalStore = defineStore('legal', () => {
  const isOpen = ref(false)
  const activeDoc = ref(null)

  function open(doc) {
    activeDoc.value = doc
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
    activeDoc.value = null
  }

  return { isOpen, activeDoc, open, close }
})
