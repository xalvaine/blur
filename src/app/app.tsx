import './app.scss'

import React from 'react'
import { Editor } from 'pages/editor/ui'
import { ConfigProvider } from 'antd'

export const App = () => {
  return (
    <ConfigProvider
      componentSize='large'
      theme={{
        token: {
          colorPrimary: `#7C50F3`,
        },
      }}
    >
      <Editor />
    </ConfigProvider>
  )
}
