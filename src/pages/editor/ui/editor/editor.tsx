import React, { useState } from 'react'
import { Application, ICanvas } from 'pixi.js'

import {
  ModelType,
  useBackgroundRemoval,
} from 'features/background-removal/lib'

import { Scene } from '../scene'
import { Upload } from '../upload'
import { BlurTypes, Controls } from '../controls'
import { ModelPicker } from '../model-picker'
import { Header } from '../header'
import { useFilteredSprites } from '../../lib/use-filtered-sprites'

import styles from './editor.module.scss'

export const Editor = () => {
  const [pixiApp, setPixiApp] = useState<Application<ICanvas>>()
  const [selectedFilter, setSelectedFilter] = useState<BlurTypes>(
    BlurTypes.None,
  )
  const [modelType, setModelType] = useState<ModelType>(ModelType.U2netP)
  const {
    imageData,
    isImageProcessing,
    modelLoadingProgress,
    isModelLoading,
    setImage,
  } = useBackgroundRemoval({ modelType })
  const { sprites, setFilters } = useFilteredSprites({
    pixiApp,
    separatedImage: imageData,
  })

  return (
    <>
      <Header
        setImageSource={setImage}
        pixiApp={pixiApp}
        separatedImage={imageData}
      />
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
                onUpload={setImage}
                isImageProcessing={isImageProcessing}
                isModelLoading={isModelLoading}
                separateImageError={false}
                loadingProgress={modelLoadingProgress}
              />
            )}
          </div>
        </div>
        <div className={styles.interactionsBlock}>
          <Controls
            className={styles.controls}
            setFilters={setFilters}
            separatedImage={imageData}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
          <ModelPicker
            disabled={isImageProcessing}
            modelType={modelType}
            setModelType={setModelType}
          />
        </div>
      </div>
    </>
  )
}
