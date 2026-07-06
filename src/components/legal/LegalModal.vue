<script setup>
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLegalStore } from '../../stores/legal'

const { t, tm } = useI18n()
const legal = useLegalStore()

const docKey = computed(() => (legal.activeDoc === 'terms' ? 'terms' : 'privacy'))

const sections = computed(() => tm(`legal.${docKey.value}.sections`) || [])

const dialogLabel = computed(() =>
  legal.activeDoc === 'terms' ? t('legal.terms.title') : t('legal.privacy.title'),
)

watch(
  () => legal.isOpen,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
  },
)

function close() {
  legal.close()
}

function switchDoc(doc) {
  legal.activeDoc = doc
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="legal.isOpen"
        class="fixed inset-0 z-[220] bg-black/50 backdrop-blur-sm"
        @click="close"
      />
    </Transition>

    <Transition name="slide-up">
      <aside
        v-if="legal.isOpen"
        class="fixed inset-x-0 bottom-0 z-[221] flex max-h-[92vh] flex-col rounded-t-3xl bg-[#F7F0E3] shadow-2xl md:inset-x-auto md:top-1/2 md:bottom-auto md:left-1/2 md:max-h-[85vh] md:w-[min(100%,42rem)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl"
        role="dialog"
        :aria-label="dialogLabel"
        data-lenis-prevent
      >
        <div class="flex shrink-0 items-center justify-between border-b border-[#2A2018]/10 px-5 py-4 md:px-6">
          <div class="flex gap-1 rounded-full bg-[#2A2018]/6 p-1">
            <button
              type="button"
              class="rounded-full px-3 py-1.5 font-body text-xs font-semibold transition-colors"
              :class="docKey === 'privacy' ? 'bg-white text-[#2A2018] shadow-sm' : 'text-[#2A2018]/55 hover:text-[#2A2018]'"
              @click="switchDoc('privacy')"
            >
              {{ t('footer.links.privacy') }}
            </button>
            <button
              type="button"
              class="rounded-full px-3 py-1.5 font-body text-xs font-semibold transition-colors"
              :class="docKey === 'terms' ? 'bg-white text-[#2A2018] shadow-sm' : 'text-[#2A2018]/55 hover:text-[#2A2018]'"
              @click="switchDoc('terms')"
            >
              {{ t('footer.links.terms') }}
            </button>
          </div>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full text-[#2A2018]/50 hover:bg-[#2A2018]/8 hover:text-[#2A2018]"
            :aria-label="t('legal.close')"
            @click="close"
          >
            ✕
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-5 py-6 md:px-8 md:py-8">
          <p class="mb-2 font-body text-xs tracking-[0.25em] text-[#2A2018]/45 uppercase">{{ t('legal.eyebrow') }}</p>
          <h2 class="font-display text-2xl font-bold text-[#2A2018] md:text-3xl">
            {{ t(`legal.${docKey}.title`) }}
          </h2>
          <p class="mt-2 font-body text-xs text-[#2A2018]/50">{{ t(`legal.${docKey}.updated`) }}</p>
          <p class="mt-5 font-body text-sm leading-relaxed text-[#2A2018]/75">{{ t(`legal.${docKey}.intro`) }}</p>

          <article
            v-for="(section, i) in sections"
            :key="`${docKey}-${i}`"
            class="mt-8 border-t border-[#2A2018]/8 pt-6"
          >
            <h3 class="font-display text-base font-bold text-[#2A7A72]">{{ section.title }}</h3>
            <p
              v-for="(paragraph, j) in section.paragraphs"
              :key="j"
              class="mt-2.5 font-body text-sm leading-relaxed text-[#2A2018]/72"
            >
              {{ paragraph }}
            </p>
          </article>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(100%); }
@media (min-width: 768px) {
  .slide-up-enter-from, .slide-up-leave-to { transform: translate(-50%, -48%) scale(0.96); }
}
</style>
