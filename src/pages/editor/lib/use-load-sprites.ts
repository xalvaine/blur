import { Dispatch, SetStateAction, useCallback, useEffect } from 'react'
import { Application, ICanvas, Sprite } from 'pixi.js'

interface UseHandleSetBackgroundParams {
  separatedImage: Components.Schemas.Segmentation | undefined
  setSprites: Dispatch<SetStateAction<Sprite[]>>
  pixiApp: Application<ICanvas> | undefined
}

const loadAllSpritesFromBase64 = (...base64objects: string[]) => {
  return Promise.all(
    base64objects.map(
      (base64object) =>
        new Promise<Sprite>((resolve) => {
          const sprite = Sprite.from('data:image/png;base64,' + base64object)
          sprite.texture.baseTexture.on(`loaded`, () => resolve(sprite))
        }),
    ),
  )
}

export const useLoadSprites = ({
  separatedImage,
  setSprites,
  pixiApp,
}: UseHandleSetBackgroundParams) => {
  const handleSetBackground = useCallback(async () => {
    if (!separatedImage || !pixiApp) {
      return
    }

    const { background, foreground, source } = separatedImage
    const sprites = await loadAllSpritesFromBase64(
      source,
      background,
      foreground,
    )
    for (const sprite of sprites) {
      const widthScaleToFit = pixiApp.view.width / sprite.width
      const heightScaleToFit = pixiApp.view.height / sprite.height
      const realScaleToFit = Math.min(widthScaleToFit, heightScaleToFit)
      sprite.width *= realScaleToFit
      sprite.height *= realScaleToFit
      sprite.x = (pixiApp.view.width - sprite.width) / 2
      sprite.y = (pixiApp.view.height - sprite.height) / 2
    }
    setSprites(sprites)
  }, [pixiApp, separatedImage, setSprites])

  useEffect(() => {
    handleSetBackground()
  }, [handleSetBackground])
}
