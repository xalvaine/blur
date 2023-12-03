import './app.scss'

import React from 'react'
import { ConfigProvider } from 'antd'
import { SWRConfig } from 'swr'

import { Editor } from 'pages/editor/ui'
import { useCacheProvider } from 'features/cache-provider/lib'

export const App = () => {
  const cacheProvider = useCacheProvider({
    dbName: process.env.REACT_APP_DATABASE_NAME!,
    storeName: process.env.REACT_APP_STORE_NAME!,
  })

  return (
    <ConfigProvider
      componentSize='large'
      theme={{
        token: {
          colorPrimary: `#7C50F3`,
        },
      }}
    >
      <SWRConfig value={{ provider: cacheProvider }}>
        <Editor />
      </SWRConfig>
    </ConfigProvider>
  )
}
