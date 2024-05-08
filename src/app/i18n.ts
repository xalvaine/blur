import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

i18next.use(initReactI18next).init({
  lng: navigator.language,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})
