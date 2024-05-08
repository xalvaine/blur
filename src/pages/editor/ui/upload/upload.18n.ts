import i18next from 'i18next'

export const UPLOAD_NAMESPACE = `upload`

i18next.addResourceBundle(`ru`, UPLOAD_NAMESPACE, {
  selectImage: `Выбрать изображение`,
  modelLoading: `Загрузка модели {{percentage}}%`,
  backgroundAndForegroundSeparation: `Выделение переднего и заднего плана`,
})

i18next.addResourceBundle(`en`, UPLOAD_NAMESPACE, {
  selectImage: `Select image`,
  modelLoading: `Loading model {{percentage}}%`,
  backgroundAndForegroundSeparation: `Separating foreground and background`,
})

i18next.addResourceBundle(`tr`, UPLOAD_NAMESPACE, {
  selectImage: `Fotoğraf seç`,
  modelLoading: `Model yükleniyor {{percentage}}%`,
  backgroundAndForegroundSeparation: `Ön planı ve arka planı ayırma`,
})
