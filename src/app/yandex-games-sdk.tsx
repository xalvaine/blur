import { useEffect, useRef } from 'react'
import i18next from "i18next";

import { isYandexGames } from 'shared/lib'

export const YandexGamesSdk = () => {
  const isYandexGamesSDKInitialized = useRef(false)
  useEffect(() => {
    if (isYandexGames() && !isYandexGamesSDKInitialized.current) {
      isYandexGamesSDKInitialized.current = true
      const script = document.createElement('script')
      script.src = 'https://yandex.ru/games/sdk/v2'
      script.async = true
      document.body.appendChild(script)
      script.onload = () => {
        YaGames.init().then((sdk) => {
          sdk.features.LoadingAPI.ready()
          i18next.changeLanguage(sdk.environment.i18n.lang)
        })
      }
    }
  }, [])
  return null
}
