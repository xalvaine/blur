import './app.scss'

import React, { useEffect, useState } from 'react'
import { ConfigProvider, theme } from 'antd'
import { SWRConfig } from 'swr'

import { Editor } from 'pages/editor/ui'
import { useCacheProvider } from 'features/cache-provider/lib'

const media = window.matchMedia(`(prefers-color-scheme: dark)`)

export const App = () => {
  const cacheProvider = useCacheProvider({
    dbName: process.env.REACT_APP_DATABASE_NAME!,
    storeName: process.env.REACT_APP_STORE_NAME!,
  })
  const [isDark, setIsDark] = useState(media.matches)

  useEffect(() => {
    const handleMediaChange = (event: MediaQueryListEvent) => {
      setIsDark(event.matches)
    }
    media.addEventListener(`change`, handleMediaChange)

    return () => {
      media.removeEventListener(`change`, handleMediaChange)
    }
  }, [])

  return (
    <ConfigProvider
      componentSize='large'
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : undefined,
        token: {
          colorPrimary: `#7C50F3`,
          fontSize: 16,
          sizeUnit: 6,
          controlHeight: 48,
        },
      }}
    >
      <SWRConfig value={{ provider: cacheProvider }}>
        <Editor />
      </SWRConfig>
    </ConfigProvider>
  )
}
