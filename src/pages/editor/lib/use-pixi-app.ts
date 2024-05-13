import { useCallback, useState } from 'react'
import { Application, DisplayObject, Filter, ICanvas, Sprite } from 'pixi.js'

export const usePixiApp = () => {
  const [pixiApp, setPixiApp] = useState<Application<ICanvas>>()

  const handleSetSprites = useCallback(
    (sprites: Sprite[]) => {
      if (!pixiApp?.stage) {
        return
      }

      pixiApp.stage.removeChildren()
      for (const sprite of sprites) {
        pixiApp.stage.addChild(sprite as DisplayObject)
      }
      pixiApp.render()
    },
    [pixiApp],
  )

  const handleSetFilters = useCallback(
    (spriteIndex: number, filters: Filter[]) => {
      if (!pixiApp?.stage || !pixiApp.stage.children[spriteIndex]) {
        return
      }
      pixiApp.stage.children[spriteIndex].filters = filters
      pixiApp.render()
    },
    [pixiApp],
  )

  return {
    pixiApp,
    setPixiApp,
    setSprites: handleSetSprites,
    setFilters: handleSetFilters,
  }
}
