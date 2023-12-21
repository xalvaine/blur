import { NdArray } from 'ndarray'

export const encodeImage = async (
  imageTensor: NdArray<Uint8Array>,
  quality: number = 0.8,
  format: string = `image/png`,
): Promise<Blob> => {
  const [height, width] = imageTensor.shape

  switch (format) {
    case `image/x-rgba8`:
      return new Blob([imageTensor.data], { type: `image/x-rgba8` })
    case `image/png`:
    case `image/jpeg`:
    case `image/webp`:
      const imageData = new ImageData(
        new Uint8ClampedArray(imageTensor.data),
        width,
        height,
      )
      const canvas = document.createElement(`canvas`)
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext(`2d`)!
      ctx.putImageData(imageData, 0, 0)
      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), format, quality)
      })
    default:
      throw new Error(`Invalid format: ${format}`)
  }
}
