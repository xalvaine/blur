import ndarray, { NdArray } from 'ndarray'

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
  model: Blob,
) => {
  const resolution = 1024
  const [srcHeight, srcWidth] = imageTensor.shape
  let tensorImage = await resizeTensorImage(imageTensor, resolution, resolution)
  const inputTensor = convertTensorHWCtoBCHW(
    tensorImage as unknown as NdArray<Uint32Array>,
  )

  const predictionsDict = await runOnnxSession(
    await model.arrayBuffer(),
    inputTensor,
  )

  const [width, height] = calculateProportionalSize(
    srcWidth,
    srcHeight,
    resolution,
    resolution,
  )
  const predictionsTensor = ndarray(predictionsDict.data, [
    resolution,
    resolution,
  ])
  tensorImage = await resizeTensorImage(imageTensor, width, height)
  const foregroundTensor = ndarray(tensorImage.data.slice(), [height, width, 4])
  const backgroundTensor = ndarray(tensorImage.data.slice(), [height, width, 4])

  const predictionsHeightScale = resolution / height
  const predictionsWidthScale = resolution / width
  for (let row = 0; row < tensorImage.shape[0]; row++) {
    for (let column = 0; column < tensorImage.shape[1]; column++) {
      const predictionsRow = Math.trunc(row * predictionsHeightScale)
      const predictionsColumn = Math.trunc(column * predictionsWidthScale)
      const alpha = predictionsTensor.get(predictionsRow, predictionsColumn)

      foregroundTensor.set(row, column, 3, alpha * 255)
      backgroundTensor.set(row, column, 3, (1 - alpha) * 255)
    }
  }

  const [predictionsCenterX, predictionsCenterY] =
    getCenterOfMass(predictionsTensor)
  const centerX = predictionsCenterX - (resolution - width) / 2
  const centerY = predictionsCenterY - (resolution - height) / 2

  return {
    source: tensorImage,
    foreground: foregroundTensor,
    background: backgroundTensor,
    width,
    height,
    centerX,
    centerY,
  }
}
