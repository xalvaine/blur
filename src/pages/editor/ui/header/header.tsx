import {
  CloseOutlined,
  DownloadOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import { Button } from 'antd'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { Application, DisplayObject, ICanvas } from 'pixi.js'

import logo from './logo.png'
import styles from './header.module.scss'

interface HeaderProps {
  setImageSource: Dispatch<SetStateAction<File | undefined>>
  pixiApp: Application<ICanvas> | undefined
  separatedImage: Components.Schemas.Segmentation | undefined
}

const getFileName = () => `blurred-image-${Date.now()}.png`

export const Header = ({
  setImageSource,
  pixiApp,
  separatedImage,
}: HeaderProps) => {
  const handleClear = useCallback(() => {
    setImageSource(undefined)
  }, [setImageSource])

  const handleDownload = useCallback(async () => {
    if (!pixiApp) {
      return
    }

    const imageDataURL = await pixiApp.renderer.extract.base64(
      pixiApp.stage as DisplayObject,
    )
    const link = document.createElement(`a`)
    link.setAttribute(`href`, imageDataURL)
    link.setAttribute('download', getFileName())
    link.style.display = `none`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [pixiApp])

  const handleShare = async () => {
    if (!pixiApp) {
      return
    }

    const blob: Blob | null = await new Promise(
      (resolve) =>
        pixiApp.renderer.extract
          .canvas(pixiApp.stage as DisplayObject)
          .toBlob?.(resolve),
    )

    if (!blob) {
      return
    }

    const file = new File([blob], getFileName(), { type: blob.type })

    return navigator.share({
      files: [file],
    })
  }

  return (
    <header className={styles.header}>
      <div className={styles.wrapper}>
        <img className={styles.image} src={logo} alt={'Логотип'} />
        <div className={styles.buttons}>
          <Button
            disabled={!separatedImage}
            type='text'
            shape='circle'
            icon={<DownloadOutlined />}
            onClick={handleDownload}
          />
          {!!navigator.canShare && (
            <Button
              disabled={!separatedImage}
              type='text'
              shape='circle'
              icon={<ShareAltOutlined />}
              onClick={handleShare}
            />
          )}
          <Button
            disabled={!separatedImage}
            type='text'
            shape='circle'
            icon={<CloseOutlined />}
            onClick={handleClear}
          />
        </div>
      </div>
    </header>
  )
}
