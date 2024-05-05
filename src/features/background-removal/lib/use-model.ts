import useSWR from 'swr'
import axios, { AxiosProgressEvent } from 'axios'
import { useCallback, useEffect, useState } from 'react'

export enum ModelType {
  Isnet, // Slowest, ~80MB
  Quant, // Medium speed, ~40MB
  U2netP, // Fastest, ~5MB
}

export interface ModelData {
  resolution: number
  path: string
  inputKey: string
  outputKey: string
  mean: [number, number, number]
  std: [number, number, number]
  providers: string[]
  alternativeStorageURL?: string
}

export const modelTypeToData: Record<ModelType, ModelData> = {
  [ModelType.Isnet]: {
    resolution: 1024,
    path: `medium`,
    inputKey: `input`,
    outputKey: `output`,
    mean: [128, 128, 128],
    std: [256, 256, 256],
    providers: ['wasm'],
  },
  [ModelType.Quant]: {
    resolution: 320,
    path: `silueta.onnx`,
    inputKey: `input.1`,
    outputKey: `1959`,
    mean: [124, 117, 104],
    std: [59, 57, 58],
    providers: ['wasm'],
    alternativeStorageURL: `./models`,
  },
  [ModelType.U2netP]: {
    resolution: 320,
    path: `u2netp.onnx`,
    inputKey: `input.1`,
    outputKey: `1959`,
    mean: [124, 117, 104],
    std: [59, 57, 58],
    providers: ['wasm'],
    alternativeStorageURL: `./models`,
  },
}

interface UseModelParams {
  modelType: ModelType | undefined
}

const getURL = (modelType: ModelType) =>
  `${
    modelTypeToData[modelType].alternativeStorageURL ||
    process.env.REACT_APP_S3_URL
  }/${modelTypeToData[modelType].path}`

export const useModel = ({ modelType }: UseModelParams) => {
  const [progress, setProgress] = useState<AxiosProgressEvent>()
  const [model, setModel] = useState<Blob>()
  const [key, setKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetcher = useCallback(
    async (url: string) =>
      new Promise<{ file: string }>(async (resolve, reject) => {
        const reader = new FileReader()
        const data = (
          await axios.get(url, {
            onDownloadProgress: setProgress,
            responseType: `blob`,
          })
        ).data
        reader.addEventListener(`loadend`, () => {
          if (typeof reader.result === `string`) {
            resolve({ file: reader.result })
          } else {
            reject(reader.error || reader.result)
          }
        })
        reader.readAsDataURL(data)
      }),
    [],
  )

  const SWRResponse = useSWR<{ file: string }>(key, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  const handleFetchModel = useCallback(async (data: { file: string }) => {
    return (await fetch(data.file)).blob()
  }, [])

  const newKey =
    modelType !== undefined && modelType in ModelType ? getURL(modelType) : null

  useEffect(() => {
    setModel(undefined)
    setIsLoading(newKey !== null && newKey !== key)
    setKey(newKey)
  }, [key, modelType, newKey])

  useEffect(() => {
    if (SWRResponse.data) {
      handleFetchModel(SWRResponse.data).then((model) => {
        setModel(model)
        setIsLoading(false)
      })
    }
  }, [SWRResponse.data, handleFetchModel])

  return {
    model: newKey === key ? model : undefined,
    progress,
    isModelLoading: isLoading,
  }
}
