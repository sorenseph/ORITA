import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { flavorVisuals, storyStepIds, labIngredientIds, labIngredientVisuals, benefitIds, mapMarkers, testimonialMeta, productVisuals } from '../data/content'
import { storyStepVisuals } from '../data/storySteps'

export function useLocalizedFlavors() {
  const { t } = useI18n()
  return computed(() =>
    flavorVisuals.map((f) => {
      return {
        ...f,
        name: t(`flavors.items.${f.id}.name`),
        tagline: t(`flavors.items.${f.id}.tagline`),
        description: t(`flavors.items.${f.id}.description`),
        ingredients: f.ingredients.map((ing) => ({
          ...ing,
          label: t(`flavors.items.${f.id}.ingredients.${ing.key}`),
        })),
      }
    })
  )
}

export function useLocalizedStorySteps() {
  const { t } = useI18n()
  return computed(() =>
    storyStepIds.map((id) => ({
      id,
      label: t(`story.steps.${id}.label`),
      sublabel: t(`story.steps.${id}.sublabel`),
      lottie: storyStepVisuals[id]?.lottie,
      image: storyStepVisuals[id]?.img,
      imageSize: storyStepVisuals[id]?.size || 140,
      color: { water: '#4AAB9E', agave: '#C4A035', fruit: '#D4734A', bubble: '#E8C84A', orita: '#D45682' }[id],
    }))
  )
}

export function useLocalizedLabIngredients() {
  const { t } = useI18n()
  const colors = {
    agave: '#C4A035', mineral: '#4AAB9E', fruit: '#D4734A',
    inulin: '#3D9A8E', herbs: '#7A9E6B', 'zero-cane': '#D45682',
  }
  const floats = {
    agave: { x: -20, y: 10, rotate: -8 },
    mineral: { x: 15, y: -15, rotate: 5 },
    fruit: { x: -10, y: 20, rotate: -3 },
    inulin: { x: 25, y: 5, rotate: 8 },
    herbs: { x: -25, y: -10, rotate: -6 },
    'zero-cane': { x: 10, y: -20, rotate: 4 },
  }
  const i18nKeys = { agave: 'agave', mineral: 'mineral', fruit: 'fruit', inulin: 'inulin', herbs: 'herbs', 'zero-cane': 'zeroCane' }

  return computed(() =>
    labIngredientIds.map((id) => ({
      id,
      name: t(`lab.items.${i18nKeys[id]}.name`),
      benefit: t(`lab.items.${i18nKeys[id]}.benefit`),
      detail: t(`lab.items.${i18nKeys[id]}.detail`),
      color: colors[id],
      float: floats[id],
      img: labIngredientVisuals[id]?.img,
      cardBg: labIngredientVisuals[id]?.cardBg || '#FFFFFF',
      accent: labIngredientVisuals[id]?.accent || colors[id],
      imgSize: labIngredientVisuals[id]?.imgSize,
    }))
  )
}

export function useLocalizedBenefits() {
  const { t } = useI18n()
  const visuals = {
    calories: { stat: '71', unitKey: 'kcal', bg: '#FFF4EC', accent: '#D4734A' },
    sugar: { stat: '0', unitKey: 'cane', bg: '#FCE8EF', accent: '#D45682' },
    fiber: { stat: '2.5', unitKey: 'g', bg: '#E8F6F3', accent: '#4AAB9E' },
    natural: { stat: '100', unitKey: 'pct', bg: '#FFF8E0', accent: '#C4A035' },
  }
  return computed(() =>
    benefitIds.map((id) => ({
      id,
      ...visuals[id],
      unit: t(`benefits.units.${visuals[id].unitKey}`),
      title: t(`benefits.items.${id}.title`),
      description: t(`benefits.items.${id}.description`),
    }))
  )
}

export function useLocalizedLocations() {
  const { t } = useI18n()
  const names = {
    gdl: 'Guadalajara',
    'puerto-vallarta': 'Puerto Vallarta',
    tequila: 'Tequila',
    bcs: 'Baja California Sur',
    oaxaca: 'Oaxaca',
    cancun: 'Quintana Roo',
    north: 'Norte de México',
    pacific: 'Costa Pacífico',
    gulf: 'Golfo de México',
  }
  return computed(() =>
    mapMarkers.map((m) => ({
      ...m,
      name: t(`map.locations.${m.id}`, names[m.id] || m.id),
    }))
  )
}

export function useLocalizedTestimonials() {
  const { t } = useI18n()
  return computed(() =>
    testimonialMeta.map((m) => ({
      ...m,
      text: t(`testimonials.items.${m.id}.text`),
    }))
  )
}

export function useLocalizedProducts() {
  const { t } = useI18n()
  return computed(() =>
    productVisuals.map((p) => ({
      ...p,
      name: t(`shop.products.${p.id}.name`),
      description: t(`shop.products.${p.id}.description`),
      highlights: (p.highlightIds || []).map((key) => ({
        key,
        label: t(`shop.highlightLabels.${key}`),
        text: t(`shop.products.${p.id}.highlights.${key}`),
      })),
      specs: (p.specKeys || []).map((key) => ({
        key,
        label: t(`shop.specLabels.${key}`),
        value: t(`shop.products.${p.id}.specs.${key}`),
      })),
      badge: p.badgeKey ? t(`shop.badges.${p.badgeKey}`) : null,
    }))
  )
}
