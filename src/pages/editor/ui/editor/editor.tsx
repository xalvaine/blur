import React, { useState } from 'react'
import { Application, Filter, ICanvas, Sprite } from 'pixi.js'

import {
  ModelType,
  useBackgroundRemoval,
} from 'features/background-removal/lib'

import { Scene } from '../scene'
import { Upload } from '../upload'
import { BlurTypes, Controls } from '../controls'
import { Actions } from '../actions'
import { ModelPicker } from '../model-picker'
import { useLoadSprites } from '../../lib/use-load-sprites'
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
  const [modelType, setModelType] = useState<ModelType>(ModelType.Small)
  const { imageData, isImageProcessing, modelLoadingProgress, isModelLoading } =
    useBackgroundRemoval({ image: imageSource, modelType })
  useLoadSprites({ setSprites, pixiApp, separatedImage: imageData })
  useApplyBackgroundFilters({ pixiApp, filters, setSprites })

  return (
    <div className={styles.wrapper}>
      <div className={styles.imageBack}>
        <div className={styles.image}>
          {imageData ? (
            <Scene
              pixiApp={pixiApp}
              setPixiApp={setPixiApp}
              sprites={sprites}
              separatedImage={imageData}
            />
          ) : (
            <Upload
              onUpload={setImageSource}
              isImageProcessing={isImageProcessing}
              isModelLoading={isModelLoading}
              separateImageError={false}
              loadingProgress={modelLoadingProgress}
            />
          )}
        </div>
      </div>
      <div className={styles.interactionsBlock}>
        <ModelPicker modelType={modelType} setModelType={setModelType} />
        <Controls
          setFilters={setFilters}
          separatedImage={imageData}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
        <Actions
          setImageSource={setImageSource}
          pixiApp={pixiApp}
          separatedImage={imageData}
        />
      </div>
    </div>
  )
}
