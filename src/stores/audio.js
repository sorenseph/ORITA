import { defineStore } from 'pinia'
import { ref } from 'vue'

const MUSIC_SRC = '/music/Dan Zeitune - Last Dance.mp3'

export const useAudioStore = defineStore('audio', () => {
  const enabled = ref(true)
  let audioEl = null
  let unlockBound = false

  function ensureAudio() {
    if (!audioEl) {
      audioEl = new Audio(encodeURI(MUSIC_SRC))
      audioEl.loop = true
      audioEl.volume = 0.32
      audioEl.preload = 'auto'
    }
    return audioEl
  }

  function bindUnlock() {
    if (unlockBound) return
    unlockBound = true
    const unlock = () => {
      if (enabled.value) play()
      document.removeEventListener('pointerdown', unlock)
      document.removeEventListener('keydown', unlock)
    }
    document.addEventListener('pointerdown', unlock, { once: true })
    document.addEventListener('keydown', unlock, { once: true })
  }

  async function play() {
    if (!enabled.value) return
    const el = ensureAudio()
    try {
      await el.play()
    } catch {
      bindUnlock()
    }
  }

  function pause() {
    audioEl?.pause()
  }

  function stop() {
    if (!audioEl) return
    audioEl.pause()
    audioEl.currentTime = 0
  }

  function toggle() {
    enabled.value = !enabled.value
    if (enabled.value) play()
    else stop()
  }

  /** Llamar al terminar el loader o al cargar la app */
  function init() {
    if (enabled.value) play()
  }

  return { enabled, toggle, play, pause, stop, init }
})
