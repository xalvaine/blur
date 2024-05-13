import { Sprite } from 'pixi.js'

const loadAllSpritesFromBase64 = (base64objects: string[]) => {
  return Promise.all(
    base64objects.map(
      (base64object) =>
        new Promise<Sprite>((resolve) => {
          const sprite = Sprite.from(base64object)
          if (sprite.texture.baseTexture.valid) {
            resolve(sprite)
          }
          sprite.texture.baseTexture.on(`loaded`, () => {
            resolve(sprite)
          })
        }),
    ),
  )
}

export const handleLoadSpritesFromImages = async (
  images: string[],
  rendererWidth: number,
  rendererHeight: number,
) => {
  const sprites = await loadAllSpritesFromBase64(images)
  for (const sprite of sprites) {
    const widthScaleToFit = rendererWidth / sprite.width
    const heightScaleToFit = rendererHeight / sprite.height
    const realScaleToFit = Math.min(widthScaleToFit, heightScaleToFit)
    sprite.width *= realScaleToFit
    sprite.height *= realScaleToFit
    sprite.x = (rendererWidth - sprite.width) / 2
    sprite.y = (rendererHeight - sprite.height) / 2
  }

  return sprites
}
