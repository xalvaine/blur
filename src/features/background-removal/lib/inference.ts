import ndarray, { NdArray } from 'ndarray'

import { ModelData } from './use-model'
import { convertTensorHWCtoBCHW } from './convert-tensor-hwc-to-bchw'
import { resizeTensorImage } from './resize-tensor-image'
import { runOnnxSession } from './onnx'

const calculateProportionalSize = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
): [number, number] => {
  const widthRatio = maxWidth / originalWidth
  const heightRatio = maxHeight / originalHeight
  const scalingFactor = Math.min(widthRatio, heightRatio)
  const newWidth = Math.floor(originalWidth * scalingFactor)
  const newHeight = Math.floor(originalHeight * scalingFactor)
  return [newWidth, newHeight]
}

const getCenterOfMass = (array: NdArray<Float32Array>) => {
  let totalMass = 0
  let xMass = 0
  let yMass = 0

  for (let y = 0; y < array.shape[0]; y++) {
    for (let x = 0; x < array.shape[1]; x++) {
      const mass = array.get(y, x)
      totalMass += mass
      xMass += mass * x
      yMass += mass * y
    }
  }

  const centerX = xMass / totalMass
  const centerY = yMass / totalMass

  return [centerX, centerY]
}

export const runInference = async (
  imageTensor: NdArray<Uint8Array>,
  model: ArrayBufferLike,
  modelData: ModelData,
  outputImageResolution: number,
) => {
  const [srcHeight, srcWidth] = imageTensor.shape
  let tensorImage = await resizeTensorImage(
    imageTensor,
    modelData.resolution,
    modelData.resolution,
    (length) => new Uint8Array(length),
  )
  const inputTensor = convertTensorHWCtoBCHW(
    tensorImage as unknown as NdArray<Uint32Array>,
    modelData.mean,
    modelData.std,
  )
  const predictionsDict = await runOnnxSession(
    model,
    inputTensor,
    modelData.inputKey,
    modelData.outputKey,
    modelData.providers,
  )

  const [targetWidth, targetHeight] = calculateProportionalSize(
    srcWidth,
    srcHeight,
    outputImageResolution,
    outputImageResolution,
  )
  const predictionsTensor = ndarray(
    resizeTensorImage(
      ndarray(predictionsDict.data, [
        modelData.resolution,
        modelData.resolution,
        1,
      ]),
      targetWidth,
      targetHeight,
      (length) => new Float32Array(length),
      false,
    ).data,
    [targetHeight, targetWidth],
  )
  const resizedTensorImage = await resizeTensorImage(
    imageTensor,
    targetWidth,
    targetHeight,
    (length) => new Uint8Array(length),
  )
  const foregroundTensor = ndarray(resizedTensorImage.data.slice(), [
    targetHeight,
    targetWidth,
    4,
  ])
  const backgroundTensor = ndarray(resizedTensorImage.data.slice(), [
    targetHeight,
    targetWidth,
    4,
  ])

  for (let row = 0; row < resizedTensorImage.shape[0]; row++) {
    for (let column = 0; column < resizedTensorImage.shape[1]; column++) {
      const alpha = predictionsTensor.get(row, column)
      foregroundTensor.set(row, column, 3, alpha * 255)
      backgroundTensor.set(row, column, 3, (1 - alpha) * 255)
    }
  }

  const [predictionsCenterX, predictionsCenterY] =
    getCenterOfMass(predictionsTensor)

  return {
    source: resizedTensorImage,
    foreground: foregroundTensor,
    background: backgroundTensor,
    width: targetWidth,
    height: targetHeight,
    centerX: predictionsCenterX,
    centerY: predictionsCenterY,
  }
}
