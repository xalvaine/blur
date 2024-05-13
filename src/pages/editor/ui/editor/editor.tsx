import React, { ComponentProps, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'

import {
  ModelType,
  useBackgroundRemoval,
} from 'features/background-removal/lib'

import { Upload } from '../upload'
import { Controls } from '../controls'
import { ModelPicker } from '../model-picker'
import { Header } from '../header'
import { usePixiApp } from '../../lib/use-pixi-app'
import { BlurType, Scene } from '../scene'

import styles from './editor.module.scss'

const INITIAL_SCROLL = 100
const BLUR_RADIUS_DEFAULT = 16

export const Editor = () => {
  const [blurType, setBlurType] = useState<
    ComponentProps<typeof Controls>['blurType']
  >(BlurType.Gaussian)
  const [radius, setRadius] = useState(BLUR_RADIUS_DEFAULT)
  const [modelType, setModelType] = useState<ModelType>(ModelType.U2netP)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const {
    segmentation,
    isImageProcessing,
    modelLoadingProgress,
    isModelLoading,
    setImage,
  } = useBackgroundRemoval({ modelType })
  const { pixiApp, setPixiApp, setSprites, setFilters } = usePixiApp()

  useEffect(() => {
    if (segmentation) {
      wrapperRef.current?.scrollTo({ top: INITIAL_SCROLL, behavior: `smooth` })
    }
  }, [segmentation])

  return (
    <>
      <Header
        setImageSource={setImage}
        pixiApp={pixiApp}
        segmentation={segmentation}
        className={styles.disableSelection}
      />
      <div
        ref={wrapperRef}
        className={classNames(styles.wrapper, styles.disableSelection)}
      >
        <div className={styles.imageBack}>
          <div className={styles.image}>
            {segmentation ? (
              <Scene
                pixiApp={pixiApp}
                setPixiApp={setPixiApp}
                segmentation={segmentation}
                setFilters={setFilters}
                setSprites={setSprites}
                blurType={blurType}
                radius={radius}
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
            segmentation={segmentation}
            blurType={blurType}
            setBlurType={setBlurType}
            radius={radius}
            setRadius={setRadius}
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
