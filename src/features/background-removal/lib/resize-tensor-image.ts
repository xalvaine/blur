import ndarray, { Data, NdArray } from 'ndarray'

export const resizeTensorImage = <T extends Data = Data<number>>(
  imageTensor: NdArray<T>,
  newWidth: number,
  newHeight: number,
  arrayConstructCallback: (length: number) => T,
  roundValues: boolean = true,
): NdArray<T> => {
  const [srcHeight, srcWidth, srcChannels] = imageTensor.shape
  const scaleX = srcWidth / newWidth
  const scaleY = srcHeight / newHeight

  const resizedImageData = ndarray(
    arrayConstructCallback(srcChannels * newWidth * newHeight),
    [newHeight, newWidth, srcChannels],
  )

  for (let y = 0; y < newHeight; y++) {
    for (let x = 0; x < newWidth; x++) {
      const srcX = x * scaleX
      const srcY = y * scaleY
      const x1 = Math.max(Math.floor(srcX), 0)
      const x2 = Math.min(Math.ceil(srcX), srcWidth - 1)
      const y1 = Math.max(Math.floor(srcY), 0)
      const y2 = Math.min(Math.ceil(srcY), srcHeight - 1)

      const dx = srcX - x1
      const dy = srcY - y1

      for (let c = 0; c < srcChannels; c++) {
        const p1 = imageTensor.get(y1, x1, c)
        const p2 = imageTensor.get(y1, x2, c)
        const p3 = imageTensor.get(y2, x1, c)
        const p4 = imageTensor.get(y2, x2, c)

        // Bilinear interpolation
        const interpolatedValue =
          (1 - dx) * (1 - dy) * p1 +
          dx * (1 - dy) * p2 +
          (1 - dx) * dy * p3 +
          dx * dy * p4

        resizedImageData.set(
          y,
          x,
          c,
          roundValues ? Math.round(interpolatedValue) : interpolatedValue,
        )
      }
    }
  }

  return resizedImageData
}
