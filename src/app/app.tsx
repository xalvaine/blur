import './app.scss'

import React, { useEffect } from 'react'
import { ColorModeScript, useColorMode } from '@chakra-ui/react'
import { SWRConfig } from 'swr'

import { Editor } from 'pages/editor/ui'
import { useCacheProvider } from 'features/cache-provider/lib'

const media = window.matchMedia(`(prefers-color-scheme: dark)`)

export const App = () => {
  const cacheProvider = useCacheProvider({
    dbName: process.env.REACT_APP_DATABASE_NAME!,
    storeName: process.env.REACT_APP_STORE_NAME!,
  })
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
      <SWRConfig value={{ provider: cacheProvider }}>
        <Editor />
      </SWRConfig>
    </>
  )
}
