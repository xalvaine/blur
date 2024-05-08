import i18next from 'i18next'

export const CONTROLS_NAMESPACE = `controls`

i18next.addResourceBundle(`ru`, CONTROLS_NAMESPACE, {
  blurRadius: `Радиус размытия`,
  blurType: `Тип размытия`,
  default: `Обычное`,
  vertical: `Вертикальное`,
  horizontal: `Горизонтальное`,
  zoomBlur: `Зум-блюр`,
})

i18next.addResourceBundle(`en`, CONTROLS_NAMESPACE, {
  blurRadius: `Blur radius`,
  blurType: `Blur type`,
  default: `Default`,
  vertical: `Vertical`,
  horizontal: `Horizontal`,
  zoomBlur: `Zoom blur`,
})

i18next.addResourceBundle(`tr`, CONTROLS_NAMESPACE, {
  blurRadius: `Bulanıklaştırma yarıçapı`,
  blurType: `Bulanıklaştırma türü`,
  default: `Varsayılan`,
  vertical: `Dikey`,
  horizontal: `Yatay`,
  zoomBlur: `Yakınlaştırma bulanıklığı`,
})
