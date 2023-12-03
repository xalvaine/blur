import ndarray, { NdArray } from 'ndarray'

export const resizeTensorImage = async (
  imageTensor: NdArray<Uint8Array>,
  newWidth: number,
  newHeight: number,
): Promise<NdArray<Uint8Array>> => {
  const [srcHeight, srcWidth, srcChannels] = imageTensor.shape
  // Calculate the scaling factors
  const scaleX = srcWidth / newWidth
  const scaleY = srcHeight / newHeight

  // Create a new NdArray to store the resized image
  const resizedImageData = ndarray(
    new Uint8Array(srcChannels * newWidth * newHeight),
    [newHeight, newWidth, srcChannels],
  )
  // Perform interpolation to fill the resized NdArray
  for (let y = 0; y < newHeight; y++) {
    for (let x = 0; x < newWidth; x++) {
      for (let c = 0; c < srcChannels; c++) {
        const srcX = x * scaleX
        const srcY = y * scaleY
        const x1 = Math.floor(srcX)
        const x2 = Math.ceil(srcX)
        const y1 = Math.floor(srcY)
        const y2 = Math.ceil(srcY)

        const dx = srcX - x1
        const dy = srcY - y1

        const p1 = imageTensor.get(y1, x1, c)
        const p2 = imageTensor.get(y1, x2, c)
        const p3 = imageTensor.get(y2, x1, c)
        const p4 = imageTensor.get(y2, x2, c)

        // Perform bilinear interpolation
        const interpolatedValue =
          (1 - dx) * (1 - dy) * p1 +
          dx * (1 - dy) * p2 +
          (1 - dx) * dy * p3 +
          dx * dy * p4

        resizedImageData.set(y, x, c, Math.round(interpolatedValue))
      }
    }
  }

  return resizedImageData
}
