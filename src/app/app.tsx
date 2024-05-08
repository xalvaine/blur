import './app.scss'
import './i18n'

import React, { useEffect } from 'react'
import { ColorModeScript, useColorMode } from '@chakra-ui/react'

import { Editor } from 'pages/editor/ui'

import { YandexGamesSdk } from './yandex-games-sdk'

const media = window.matchMedia(`(prefers-color-scheme: dark)`)

export const App = () => {
  const { setColorMode } = useColorMode()

  useEffect(() => {
    const handleMediaChange = (event: MediaQueryListEvent) => {
      setColorMode(event.matches ? `dark` : `light`)
    }

    setColorMode(media.matches ? `dark` : `light`)

    media.addEventListener(`change`, handleMediaChange)
    return () => {
      media.removeEventListener(`change`, handleMediaChange)
    }
  }, [setColorMode])

  return (
    <>
      <ColorModeScript initialColorMode={media.matches ? `dark` : `light`} />
      <Editor />
      <YandexGamesSdk />
    </>
  )
}
