import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import {
  Application,
  DisplayObject,
  ENV,
  ICanvas,
  settings,
  Sprite,
} from 'pixi.js'

import styles from './scene.module.scss'
import { useLongPress } from 'shared/lib'

interface SceneProps<T = Application<ICanvas> | undefined> {
  pixiApp: T
  setPixiApp: Dispatch<SetStateAction<T>>
  sprites: Sprite[]
  separatedImage: Components.Schemas.Segmentation
  setIsShownWithoutFilters: Dispatch<SetStateAction<boolean>>
}

export const Scene = ({
  pixiApp,
  setPixiApp,
  sprites,
  separatedImage,
  setIsShownWithoutFilters,
}: SceneProps) => {
  const pixiContainerRef = useRef<HTMLDivElement>(null)

  const handleRemoveContainerChildren = useCallback(() => {
    const pixiContainerElement = pixiContainerRef.current
    if (!pixiContainerElement) {
      return
    }

    for (
      let childIndex = 0;
      childIndex < pixiContainerElement.children.length;
      childIndex++
    ) {
      pixiContainerElement.removeChild(
        pixiContainerElement.children[childIndex],
      )
    }
  }, [])

  useEffect(() => {
    const pixiContainerElement = pixiContainerRef.current
    if (!pixiApp || !pixiContainerElement) {
      return
    }

    pixiContainerElement.appendChild(pixiApp.view as unknown as Node)

    return () => {
      handleRemoveContainerChildren()
    }
  }, [handleRemoveContainerChildren, pixiApp])

  useEffect(() => {
    if (!!pixiApp || !separatedImage) {
      return
    }
    settings.PREFER_ENV = ENV.WEBGL2
    const app = new Application({
      backgroundAlpha: 0,
      width: separatedImage.width,
      height: separatedImage.height,
      autoDensity: false,
    })
    app.ticker.stop()
    setPixiApp(app)
  }, [pixiApp, separatedImage, setPixiApp])

  const scaleApp = useCallback(() => {
    if (!pixiContainerRef.current || !pixiApp) {
      return
    }

    const canvasElement = pixiContainerRef.current
      .children[0] as HTMLCanvasElement

    if (!canvasElement) {
      return
    }

    const containerWidth = pixiContainerRef.current.offsetWidth
    const containerHeight = pixiContainerRef.current.offsetHeight
    const scaleWidth = containerWidth / separatedImage.width
    const scaleHeight = containerHeight / separatedImage.height
    const scale = Math.min(scaleWidth, scaleHeight)

    pixiApp.renderer.resize(separatedImage.width, separatedImage.height)
    canvasElement.style.width = `${separatedImage.width * scale}px`
    canvasElement.style.height = `${separatedImage.height * scale}px`
  }, [pixiApp, separatedImage.height, separatedImage.width])

  useEffect(() => {
    const pixiContainer = pixiContainerRef.current
    if (!pixiApp || !pixiContainer) {
      return
    }

    const resizeObserver = new ResizeObserver(scaleApp)
    resizeObserver.observe(pixiContainer)

    return () => void resizeObserver.disconnect()
  }, [pixiApp, scaleApp])

  useEffect(() => {
    if (!pixiApp || !pixiApp.stage) {
      return
    }

    pixiApp.stage.removeChildren()
    for (const sprite of sprites) {
      pixiApp.stage.addChild(sprite as DisplayObject)
    }
    pixiApp.render()
  }, [pixiApp, sprites])

  const { isLongPressed, elementProps } = useLongPress()

  useEffect(() => {
    setIsShownWithoutFilters(isLongPressed)
  }, [isLongPressed, setIsShownWithoutFilters])

  return (
    <div
      {...elementProps}
      className={styles.container}
      ref={pixiContainerRef}
    />
  )
}
