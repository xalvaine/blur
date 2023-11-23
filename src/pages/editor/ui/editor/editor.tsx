import React, { useState } from 'react'
import { Application, Filter, ICanvas, Sprite } from 'pixi.js'

import { Scene } from '../scene'
import { Upload } from '../upload'
import { BlurTypes, Controls } from '../controls'
import { Actions } from '../actions'
import { useLoadSprites } from '../../lib/use-load-sprites'
import { useSeparatedImage } from '../../lib/use-separated-image'
import { useApplyBackgroundFilters } from '../../lib/use-apply-background-filters'

import styles from './editor.module.scss'

export const Editor = () => {
  const [pixiApp, setPixiApp] = useState<Application<ICanvas>>()
  const [imageSource, setImageSource] = useState<File>()
  const [sprites, setSprites] = useState<Sprite[]>([])
  const [selectedFilter, setSelectedFilter] = useState<BlurTypes>(
    BlurTypes.None,
  )
  const [filters, setFilters] = useState<Filter[]>([])
  const {
    data: separatedImage,
    isLoading: isSeparatedImageLoading,
    error: separateImageError,
  } = useSeparatedImage({ image: imageSource })
  useLoadSprites({ setSprites, pixiApp, separatedImage })
  useApplyBackgroundFilters({ pixiApp, filters, setSprites })

  return (
    <div className={styles.wrapper}>
      <div className={styles.imageBack}>
        <div className={styles.image}>
          {separatedImage ? (
            <Scene
              pixiApp={pixiApp}
              setPixiApp={setPixiApp}
              sprites={sprites}
              separatedImage={separatedImage}
            />
          ) : (
            <Upload
              onUpload={setImageSource}
              isLoading={isSeparatedImageLoading}
              separateImageError={!!separateImageError}
            />
          )}
        </div>
      </div>
      <div className={styles.interactionsBlock}>
        <Controls
          setFilters={setFilters}
          separatedImage={separatedImage}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
        <Actions
          setImageSource={setImageSource}
          setSprites={setSprites}
          setSelectedFilter={setSelectedFilter}
          setPixiApp={setPixiApp}
          pixiApp={pixiApp}
          separatedImage={separatedImage}
        />
      </div>
    </div>
  )
}
