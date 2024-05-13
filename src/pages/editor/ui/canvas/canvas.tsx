import React, { useCallback, useEffect, useRef } from 'react'
import { Application, ENV, settings } from 'pixi.js'

import styles from './canvas.module.scss'
import { usePixiApp } from 'pages/editor/lib/use-pixi-app'

type SceneProps = Pick<
  ReturnType<typeof usePixiApp>,
  `pixiApp` | `setPixiApp`
> & {
  rendererWidth: number
  rendererHeight: number
}

const handleScaleApp = (
  pixiApp: Application,
  pixiAppContainer: HTMLDivElement,
  appWidth: number,
  appHeight: number,
) => {
  const canvasElement = pixiAppContainer.children[0] as HTMLCanvasElement
  if (!canvasElement) {
    return
  }

  const containerWidth = pixiAppContainer.offsetWidth
  const containerHeight = pixiAppContainer.offsetHeight
  const scaleWidth = containerWidth / appWidth
  const scaleHeight = containerHeight / appHeight
  const scale = Math.min(scaleWidth, scaleHeight)

  pixiApp.renderer.resize(appWidth, appHeight)
  canvasElement.style.width = `${appWidth * scale}px`
  canvasElement.style.height = `${appHeight * scale}px`
}

export const Canvas = ({
  pixiApp,
  setPixiApp,
  rendererWidth,
  rendererHeight,
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
    if (!!pixiApp) {
      return
    }
    settings.PREFER_ENV = ENV.WEBGL2
    const app = new Application({
      backgroundAlpha: 0,
      width: rendererWidth,
      height: rendererHeight,
      autoDensity: false,
    })
    app.ticker.stop()
    setPixiApp(app)
  }, [pixiApp, rendererHeight, rendererWidth, setPixiApp])

  useEffect(() => {
    const pixiContainer = pixiContainerRef.current
    if (!pixiApp || !pixiContainer) {
      return
    }

    const resizeObserver = new ResizeObserver(() =>
      handleScaleApp(pixiApp, pixiContainer, rendererWidth, rendererHeight),
    )
    resizeObserver.observe(pixiContainer)

    return () => resizeObserver.disconnect()
  }, [pixiApp, rendererHeight, rendererWidth])

  return <div className={styles.container} ref={pixiContainerRef} />
}
