import ndarray from 'ndarray'

const imageBitmapToImageData = (imageBitmap: ImageBitmap): ImageData => {
  const canvas = document.createElement(`canvas`)
  canvas.width = imageBitmap.width
  canvas.height = imageBitmap.height
  const ctx = canvas.getContext(`2d`)!
  ctx.drawImage(imageBitmap, 0, 0)
  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

export const decodeImage = async (blob: Blob) => {
  const imageBitmap = await createImageBitmap(blob)
  const imageData = imageBitmapToImageData(imageBitmap)
  return ndarray(imageData.data, [imageData.height, imageData.width, 4])
}
