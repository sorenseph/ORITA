import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { instagramFallback, instagramCaptions } from '../data/content'

export function useInstagram() {
  const { locale } = useI18n()
  const posts = ref([])
  const loading = ref(true)
  const fromApi = ref(false)

  const token = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN

  async function fetchFromApi() {
    if (!token) return false
    try {
      const res = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,like_count,thumbnail_url&access_token=${token}&limit=8`
      )
      if (!res.ok) return false
      const data = await res.json()
      if (!data.data?.length) return false

      posts.value = data.data.map((p, i) => ({
        id: p.id,
        image: p.media_url || p.thumbnail_url,
        likes: p.like_count || 0,
        caption: p.caption?.slice(0, 120) || '',
        permalink: p.permalink,
        large: i === 0,
      }))
      fromApi.value = true
      return true
    } catch {
      return false
    }
  }

  function loadFallback() {
    posts.value = instagramFallback.map((p, i) => ({
      ...p,
      caption: instagramCaptions[locale.value]?.[p.captionKey] || instagramCaptions.es[p.captionKey],
      large: i === 0,
    }))
    fromApi.value = false
  }

  onMounted(async () => {
    loading.value = true
    const ok = await fetchFromApi()
    if (!ok) loadFallback()
    loading.value = false
  })

  const displayPosts = computed(() => posts.value)

  return { displayPosts, loading, fromApi, reload: loadFallback }
}
