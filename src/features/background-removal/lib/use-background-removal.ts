import { useCallback, useEffect, useState } from 'react'
import { NdArray } from 'ndarray'

import { ModelType, useModel } from './use-model'
import { decodeImage } from './decode-image'
import { runInference } from './inference'
import { encodeImage } from './encode-image'

interface UseBackgroundRemovalParams {
  image: File | undefined
  modelType: ModelType | undefined
}

export const useBackgroundRemoval = ({
  image,
  modelType,
}: UseBackgroundRemovalParams) => {
  const {
    data,
    progress,
    isLoading: isModelLoading,
  } = useModel({
    modelType: image ? modelType : undefined,
  })
  const [isImageProcessing, setIsImageProcessing] = useState(false)
  const [imageData, setImageData] = useState<Components.Schemas.Segmentation>()

  const separateImage = useCallback(async (data: File, image: File) => {
    const decodedImage = await decodeImage(image)
    const { source, background, foreground, ...rest } = await runInference(
      decodedImage as unknown as NdArray<Uint8Array>,
      data,
    )

    setImageData({
      foreground: URL.createObjectURL(await encodeImage(foreground)),
      background: URL.createObjectURL(await encodeImage(background)),
      source: URL.createObjectURL(await encodeImage(source)),
      ...rest,
    })
  }, [])

  useEffect(() => {
    setImageData(undefined)
    if (!data || !image) {
      return
    }
    setIsImageProcessing(true)
    separateImage(data, image).then(() => setIsImageProcessing(false))
  }, [data, image, separateImage])

  return {
    modelLoadingProgress: progress,
    isImageProcessing,
    isModelLoading,
    imageData,
  }
}
