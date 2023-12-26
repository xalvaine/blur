import { useCallback, useEffect, useState } from 'react'
import { Application, Filter, Sprite } from 'pixi.js'
import { handleLoadSprites } from './handle-load-sprites'

interface UseApplyFiltersParams {
  pixiApp: Application | undefined
  separatedImage: Components.Schemas.Segmentation | undefined
}

export const useFilteredSprites = ({
  pixiApp,
  separatedImage,
}: UseApplyFiltersParams) => {
  const [filters, setFilters] = useState<Filter[]>([])
  const [sprites, setSprites] = useState<Sprite[]>([])
  const [filteredSprites, setFilteredSprites] = useState<Sprite[]>([])

  const handleApplyBackgroundFilters = useCallback(
    (sprites: Sprite[], filters: Filter[]) => {
      const [source, background, ...restSprites] = sprites
      if (!background) {
        return []
      }

      background.filters = filters

      return [source, background, ...restSprites]
    },
    [],
  )

  useEffect(() => {
    if (!pixiApp || !separatedImage) {
      return
    }

    handleLoadSprites({ pixiApp, separatedImage }).then(setSprites)

    return () => {
      setSprites([])
    }
  }, [pixiApp, separatedImage])

  useEffect(() => {
    setFilteredSprites(handleApplyBackgroundFilters(sprites, filters))
  }, [filters, handleApplyBackgroundFilters, sprites])

  return { sprites: filteredSprites, setFilters }
}
