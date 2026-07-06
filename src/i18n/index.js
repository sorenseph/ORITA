import { createI18n } from 'vue-i18n'
import es from './locales/es'
import en from './locales/en'

const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('orita-lang') : null
const browserLang = typeof navigator !== 'undefined' ? navigator.language.slice(0, 2) : 'es'

export const i18n = createI18n({
  legacy: false,
  locale: saved || (browserLang === 'en' ? 'en' : 'es'),
  fallbackLocale: 'es',
  messages: { es, en },
})

export function setLocale(locale) {
  i18n.global.locale.value = locale
  localStorage.setItem('orita-lang', locale)
  document.documentElement.lang = locale
  document.title = i18n.global.t('meta.title')
  const meta = document.querySelector('meta[name="description"]')
  if (meta) meta.setAttribute('content', i18n.global.t('meta.description'))
}
