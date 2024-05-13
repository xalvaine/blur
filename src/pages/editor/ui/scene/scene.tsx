import React, { useEffect } from 'react'
import {
  HorizontalBlurFilter,
  VerticalBlurFilter,
  ZoomBlurFilter,
} from '@xalvaine/pixi-filters'

import { useBackgroundRemoval } from 'features/background-removal/lib'
import { useLongPress } from 'shared/lib'

import { usePixiApp } from '../../lib/use-pixi-app'
import { handleLoadSpritesFromImages } from '../../lib/handle-load-sprites-from-images'
import { Canvas } from '../canvas'

import styles from './scene.module.scss'

enum SpriteIndex {
  Source = 0,
  Background = 1,
  Foreground = 2,
}

export const BlurType = {
  Gaussian: `gaussian`,
  Vertical: `vertical`,
  Horizontal: `horizontal`,
  Zoom: `zoom`,
} as const

const getFilters = (
  blurTypes: (typeof BlurType)[keyof typeof BlurType],
  radius: number,
  center: [number, number],
) => {
  return {
    [BlurType.Gaussian]: [
      new VerticalBlurFilter({ radius }),
      new HorizontalBlurFilter({ radius }),
    ],
    [BlurType.Vertical]: [new VerticalBlurFilter({ radius })],
    [BlurType.Horizontal]: [new HorizontalBlurFilter({ radius })],
    [BlurType.Zoom]: [
      new ZoomBlurFilter({
        radius,
        center,
      }),
    ],
  }[blurTypes]
}

type SceneProps = Pick<
  ReturnType<typeof useBackgroundRemoval>,
  `segmentation`
> &
  Pick<
    ReturnType<typeof usePixiApp>,
    `pixiApp` | `setPixiApp` | `setSprites` | `setFilters`
  > & {
    blurType: (typeof BlurType)[keyof typeof BlurType]
    radius: number
  }

export const Scene = ({
  pixiApp,
  setPixiApp,
  segmentation,
  setSprites,
  setFilters,
  blurType,
  radius,
}: SceneProps) => {
  const { isLongPressed, elementProps } = useLongPress()

  useEffect(() => {
    if (!segmentation) {
      return
    }

    const images: string[] = []
    images[SpriteIndex.Source] = segmentation.source
    images[SpriteIndex.Background] = segmentation.background
    images[SpriteIndex.Foreground] = segmentation.foreground

    handleLoadSpritesFromImages(
      images,
      segmentation.width,
      segmentation.height,
    ).then(setSprites)
  }, [segmentation, setSprites])

  useEffect(() => {
    if (!segmentation) {
      return
    }

    setFilters(
      SpriteIndex.Background,
      isLongPressed
        ? []
        : getFilters(blurType, radius, [
            segmentation.centerX || 0,
            segmentation.centerY || 0,
          ]),
    )
  }, [radius, segmentation, setFilters, blurType, isLongPressed])

  return (
    <div {...elementProps} className={styles.wrapper}>
      {segmentation && (
        <Canvas
          pixiApp={pixiApp}
          setPixiApp={setPixiApp}
          rendererWidth={segmentation.width}
          rendererHeight={segmentation.height}
        />
      )}
    </div>
  )
}
