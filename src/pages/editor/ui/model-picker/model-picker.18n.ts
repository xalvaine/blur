import i18next from 'i18next'

export const MODEL_PICKER_NAMESPACE = `model-picker`

i18next.addResourceBundle(`ru`, MODEL_PICKER_NAMESPACE, {
  backgroundSelectionQuality: `Качество выделения фона`,
  low: `Низкое`,
  medium: `Среднее`,
  high: `Высокое`,
  size: `{{size}} МБ`,
})

i18next.addResourceBundle(`en`, MODEL_PICKER_NAMESPACE, {
  backgroundSelectionQuality: `Background selection quality`,
  low: `Low`,
  medium: `Medium`,
  high: `High`,
  size: `{{size}} MB`,
})

i18next.addResourceBundle(`tr`, MODEL_PICKER_NAMESPACE, {
  backgroundSelectionQuality: `Arka plan seçim kalitesi`,
  low: `Düşük`,
  medium: `Orta`,
  high: `Yüksek`,
  size: `{{size}} MB`,
})
