import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useThemeStore } from './theme'

const FLAVOR_AUDIO = {
  tamarind: { fizz: 180, warmth: 220, bubbleRate: 0.4 },
  guava: { fizz: 240, warmth: 280, bubbleRate: 0.35 },
  lime: { fizz: 320, warmth: 400, bubbleRate: 0.5 },
  hibiscus: { fizz: 200, warmth: 260, bubbleRate: 0.3 },
}

export const useAudioStore = defineStore('audio', () => {
  const enabled = ref(false)
  let ctx = null
  let fizzNode = null
  let warmthNode = null
  let masterGain = null
  let bubbleInterval = null

  function createFizz(freq) {
    const bufferSize = ctx.sampleRate * 2
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.06

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = freq
    filter.Q.value = 0.6

    const gain = ctx.createGain()
    gain.gain.value = 0.035

    source.connect(filter)
    filter.connect(gain)
    gain.connect(masterGain)
    source.start()
    return { source, filter, gain }
  }

  function createWarmth(freq) {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    const gain = ctx.createGain()
    gain.gain.value = 0.01
    osc.connect(gain)
    gain.connect(masterGain)
    osc.start()
    return { osc, gain }
  }

  function playBubble(flavorId) {
    if (!ctx || !enabled.value) return
    const cfg = FLAVOR_AUDIO[flavorId] || FLAVOR_AUDIO.tamarind
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(cfg.fizz * 1.4, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(cfg.fizz * 0.4, ctx.currentTime + 0.18)
    gain.gain.setValueAtTime(0.05, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22)
    osc.connect(gain)
    gain.connect(masterGain)
    osc.start()
    osc.stop(ctx.currentTime + 0.25)
  }

  function applyFlavorProfile(flavorId) {
    if (!fizzNode || !warmthNode || !ctx) return
    const cfg = FLAVOR_AUDIO[flavorId] || FLAVOR_AUDIO.tamarind
    fizzNode.filter.frequency.exponentialRampToValueAtTime(cfg.fizz, ctx.currentTime + 1.2)
    warmthNode.osc.frequency.exponentialRampToValueAtTime(cfg.warmth, ctx.currentTime + 1.2)
    if (bubbleInterval) clearInterval(bubbleInterval)
    bubbleInterval = setInterval(() => playBubble(flavorId), (1 / cfg.bubbleRate) * 1000 + Math.random() * 900)
  }

  function start(flavorId) {
    if (ctx) return
    ctx = new AudioContext()
    masterGain = ctx.createGain()
    masterGain.gain.value = 0.45
    masterGain.connect(ctx.destination)
    const cfg = FLAVOR_AUDIO[flavorId] || FLAVOR_AUDIO.tamarind
    fizzNode = createFizz(cfg.fizz)
    warmthNode = createWarmth(cfg.warmth)
    applyFlavorProfile(flavorId)
  }

  function stop() {
    if (bubbleInterval) clearInterval(bubbleInterval)
    bubbleInterval = null
    fizzNode?.source.stop()
    warmthNode?.osc.stop()
    fizzNode = warmthNode = null
    ctx?.close()
    ctx = null
  }

  function toggle() {
    enabled.value = !enabled.value
    const theme = useThemeStore()
    if (enabled.value) start(theme.activeFlavor.id)
    else stop()
  }

  watch(
    () => useThemeStore().activeFlavor.id,
    (id) => {
      if (enabled.value && ctx) applyFlavorProfile(id)
    }
  )

  return { enabled, toggle }
})
