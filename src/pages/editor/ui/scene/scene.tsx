import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import { Application, DisplayObject, ICanvas, Sprite } from 'pixi.js'

import styles from './scene.module.scss'

interface SceneProps<T = Application<ICanvas> | undefined> {
  pixiApp: T
  setPixiApp: Dispatch<SetStateAction<T>>
  sprites: Sprite[]
  separatedImage: Components.Schemas.Segmentation
}

export const Scene = ({
  pixiApp,
  setPixiApp,
  sprites,
  separatedImage,
}: SceneProps) => {
  const pixiContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const pixiContainerElement = pixiContainerRef.current
    if (!pixiApp || !pixiContainerElement) {
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

    pixiContainerElement.appendChild(pixiApp.view as unknown as Node)
    return () => {
      if (pixiContainerElement?.children[0]) {
        pixiContainerElement?.removeChild(pixiContainerElement.children[0])
      }
    }
  }, [pixiApp])

  useEffect(() => {
    if (!!pixiApp || !separatedImage) {
      return
    }
    const app = new Application({
      backgroundAlpha: 0,
      width: separatedImage.width,
      height: separatedImage.height,
      autoDensity: false,
    })
    app.ticker.stop()
    setPixiApp(app)
  }, [pixiApp, separatedImage, setPixiApp])

  useEffect(() => {
    return () => {
      pixiApp?.destroy()
    }
  }, [pixiApp])

  useEffect(() => {
    return () => {
      if (pixiApp) {
        setPixiApp(undefined)
      }
    }
  }, [pixiApp, setPixiApp])

  const scaleApp = useCallback(() => {
    if (!pixiContainerRef.current) {
      return
    }

    const canvasElement = pixiContainerRef.current
      .children[0] as HTMLCanvasElement

    if (!canvasElement) {
      return
    }

    const containerWidth = pixiContainerRef.current.offsetWidth
    const scale =
      containerWidth / Math.max(separatedImage.width, separatedImage.height)

    canvasElement.style.width = `${separatedImage.width * scale}px`
    canvasElement.style.height = `${separatedImage.height * scale}px`
  }, [separatedImage.height, separatedImage.width])

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

  return <div className={styles.container} ref={pixiContainerRef} />
}
