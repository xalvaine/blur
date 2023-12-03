import { useState, useEffect, useRef } from 'react'
import { Cache } from 'swr'

import { createCacheProvider } from './cache-provider'

interface UseCacheProviderParams {
  dbName: string
  storeName: string
}

export const useCacheProvider = ({
  dbName,
  storeName,
}: UseCacheProviderParams) => {
  const [cacheProvider, setCacheProvider] = useState<() => Cache>()
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) {
      return
    }
    initializedRef.current = true
    createCacheProvider({ dbName, storeName }).then((cacheProvider) =>
      setCacheProvider(() => cacheProvider),
    )
  }, [dbName, storeName])

  return cacheProvider
}
