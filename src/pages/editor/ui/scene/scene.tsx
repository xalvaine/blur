import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react'
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

  useEffect(() => {
    if (!pixiApp || !pixiContainerRef.current) {
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
  }, [pixiApp, separatedImage])

  useEffect(() => {
    if (!pixiApp || !pixiApp.stage) {
      return
    }

    pixiApp.stage.removeChildren()
    for (const sprite of sprites) {
      pixiApp.stage.addChild(sprite as DisplayObject)
    }
  }, [pixiApp, sprites])

  return <div className={styles.container} ref={pixiContainerRef} />
}
