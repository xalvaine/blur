import { Dispatch, SetStateAction, useEffect } from 'react'
import { Application, Filter, Sprite } from 'pixi.js'

interface UseApplyFiltersParams {
  pixiApp: Application | undefined
  setSprites: Dispatch<SetStateAction<Sprite[]>>
  filters: Filter[]
}

export const useApplyBackgroundFilters = ({
  pixiApp,
  setSprites,
  filters,
}: UseApplyFiltersParams) => {
  useEffect(() => {
    if (!pixiApp) {
      return
    }

    setSprites(([source, background, ...restSprites]) => {
      if (!background) {
        return []
      }

      background.filters = filters

      return [source, background, ...restSprites]
    })
  }, [filters, pixiApp, setSprites])
}
