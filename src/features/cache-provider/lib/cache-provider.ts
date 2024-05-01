import type { Cache, State } from 'swr'
import { openDB } from 'idb'

type Key = string

interface CreateCacheProviderParams {
  dbName: string
  storeName: string
}

const isFetchInfo = (state: State): boolean => {
  return (
    state.error instanceof Error ||
    state.isValidating === true ||
    state.isLoading === true
  )
}

export const createCacheProvider = async ({
  dbName,
  storeName,
}: CreateCacheProviderParams): Promise<() => Cache> => {
  const map = new Map<Key, State>()
  const db = await openDB(
    dbName,
    parseInt(process.env.REACT_APP_DB_VERSION || `1`),
    {
      upgrade(database, oldVersion) {
        if (oldVersion) {
          database.deleteObjectStore(storeName)
        }
        database.createObjectStore(storeName)
      },
    },
  )

  let cursor = await db.transaction(storeName, 'readwrite', {}).store.openCursor()

  while (cursor) {
    const key = cursor.key as Key
    const value = cursor.value

    if (cursor.value === undefined) {
      cursor.delete()
    } else {
      map.set(key, value)
    }

    cursor = await cursor.continue()
  }
  return () => ({
    keys: () => map.keys(),

    get: (key: Key) => {
      return map.get(key)
    },

    set: (key: Key, value: State) => {
      map.set(key, value)

      if (isFetchInfo(value)) {
        return
      }

      if (value === undefined) {
        return
      }

      return db.put(storeName, value, key)
    },

    delete: (key: Key) => {
      if (map.delete(key)) {
        return db.delete(storeName, key)
      }
    },
  })
}
