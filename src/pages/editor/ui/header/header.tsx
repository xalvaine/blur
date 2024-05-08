import { Dispatch, SetStateAction, useCallback } from 'react'
import { Application, DisplayObject, ICanvas } from 'pixi.js'
import { IconButton } from '@chakra-ui/react'
import {
  FileDownloadOutlined,
  IosShareOutlined,
  ShareOutlined,
  CloseOutlined,
} from '@mui/icons-material'
import classNames from 'classnames'

import { isIOS, isYandexGames } from 'shared/lib'

import logo from './logo.png'
import styles from './header.module.scss'

interface HeaderProps {
  setImageSource: Dispatch<SetStateAction<File | undefined>>
  pixiApp: Application<ICanvas> | undefined
  separatedImage: Components.Schemas.Segmentation | undefined
  className?: string
}

const getFileName = () => `blurred-image-${Date.now()}.png`

export const Header = ({
  setImageSource,
  pixiApp,
  separatedImage,
  className,
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
    <header className={classNames(styles.header, className)}>
      <div className={styles.wrapper}>
        {!isYandexGames() && (
          <img className={styles.image} src={logo} alt={'Логотип'} />
        )}
        <div className={styles.buttons}>
          {!!navigator.canShare && (
            <IconButton
              isRound
              aria-label=''
              isDisabled={!separatedImage}
              variant='ghost'
              className={separatedImage ? styles.icon : undefined}
              icon={
                isIOS() ? (
                  <IosShareOutlined className={styles.shareIcon} />
                ) : (
                  <ShareOutlined className={styles.shareIcon} />
                )
              }
              onClick={handleShare}
            />
          )}
          <IconButton
            isRound
            aria-label=''
            isDisabled={!separatedImage}
            variant='ghost'
            className={separatedImage ? styles.icon : undefined}
            icon={<FileDownloadOutlined />}
            onClick={handleDownload}
          />
          <IconButton
            isRound
            aria-label=''
            isDisabled={!separatedImage}
            variant='ghost'
            className={separatedImage ? styles.icon : undefined}
            icon={<CloseOutlined />}
            onClick={handleClear}
          />
        </div>
      </div>
    </header>
  )
}
