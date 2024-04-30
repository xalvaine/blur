import React, { useEffect, useRef, useState } from 'react'
import { Application, ICanvas } from 'pixi.js'
import classNames from 'classnames'

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

const INITIAL_SCROLL = 100

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
  const { sprites, setFilters, setIsShownWithoutFilters } = useFilteredSprites({
    pixiApp,
    separatedImage: imageData,
  })
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (wrapperRef.current && imageData) {
      wrapperRef.current.scrollTo({ top: INITIAL_SCROLL, behavior: `smooth` })
    }
  }, [imageData])

  return (
    <>
      <Header
        setImageSource={setImage}
        pixiApp={pixiApp}
        separatedImage={imageData}
        className={styles.disableSelection}
      />
      <div
        ref={wrapperRef}
        className={classNames(styles.wrapper, styles.disableSelection)}
      >
        <div className={styles.imageBack}>
          <div className={styles.image}>
            {imageData ? (
              <Scene
                pixiApp={pixiApp}
                setPixiApp={setPixiApp}
                sprites={sprites}
                separatedImage={imageData}
                setIsShownWithoutFilters={setIsShownWithoutFilters}
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
