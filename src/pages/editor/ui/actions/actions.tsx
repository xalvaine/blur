import { Button } from 'antd'
import React, { Dispatch, SetStateAction, useCallback } from 'react'
import { Application, ICanvas, Sprite, DisplayObject } from 'pixi.js'
import classNames from 'classnames'

import { BlurTypes } from '../controls'

import styles from './actions.module.scss'

interface ActionsProps<T = Application<ICanvas> | undefined> {
  className?: string
  setImageSource: Dispatch<SetStateAction<File | undefined>>
  setSelectedFilter: Dispatch<SetStateAction<BlurTypes>>
  setSprites: Dispatch<SetStateAction<Sprite[]>>
  pixiApp: T
  setPixiApp: Dispatch<SetStateAction<T>>
  separatedImage: Components.Schemas.Segmentation | undefined
}

export const Actions = ({
  className,
  setImageSource,
  setSelectedFilter,
  pixiApp,
  setPixiApp,
  setSprites,
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
    setSelectedFilter(BlurTypes.None)
    setSprites([])
    pixiApp?.destroy()
    setPixiApp(undefined)
  }, [pixiApp, setImageSource, setPixiApp, setSelectedFilter, setSprites])

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
