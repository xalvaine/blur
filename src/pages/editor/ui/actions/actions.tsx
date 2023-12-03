import { Button } from 'antd'
import React, { Dispatch, SetStateAction, useCallback } from 'react'
import { Application, ICanvas, DisplayObject } from 'pixi.js'
import classNames from 'classnames'

import styles from './actions.module.scss'

interface ActionsProps {
  className?: string
  setImageSource: Dispatch<SetStateAction<File | undefined>>
  pixiApp: Application<ICanvas> | undefined
  separatedImage: Components.Schemas.Segmentation | undefined
}

export const Actions = ({
  className,
  setImageSource,
  pixiApp,
  separatedImage,
}: ActionsProps) => {
  const handleDownload = useCallback(async () => {
    if (!pixiApp) {
      return
    }

    const imageDataURL = await pixiApp.renderer.extract.base64(
      pixiApp.stage as DisplayObject,
    )
    const link = document.createElement(`a`)
    link.setAttribute(`href`, imageDataURL)
    link.setAttribute('download', `blurred-image-${Date.now()}.png`)
    link.style.display = `none`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [pixiApp])

  const handleClear = useCallback(() => {
    setImageSource(undefined)
  }, [setImageSource])

  return (
    <div className={classNames(className, styles.wrapper)}>
      <Button
        block
        type='primary'
        disabled={!separatedImage}
        onClick={handleDownload}
      >
        Скачать
      </Button>
      <Button block danger disabled={!separatedImage} onClick={handleClear}>
        Отменить
      </Button>
    </div>
  )
}
