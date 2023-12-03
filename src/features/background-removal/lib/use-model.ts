import useSWR from 'swr'
import axios, { AxiosProgressEvent } from 'axios'
import { useCallback, useState } from 'react'

export enum ModelType {
  Small = `small`,
  Medium = `medium`,
  Large = `large`,
}

interface UseModelParams {
  modelType: ModelType | undefined
}

const getURL = (modelType: ModelType) =>
  `${process.env.REACT_APP_S3_URL}/${modelType}`

export const useModel = ({ modelType }: UseModelParams) => {
  const [progress, setProgress] = useState<AxiosProgressEvent>()

  const fetcher = useCallback(async (url: string) => {
    return (
      await axios.get(url, {
        onDownloadProgress: setProgress,
        responseType: `blob`,
      })
    ).data
  }, [])

  const SWRResponse = useSWR(modelType ? getURL(modelType) : null, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  return { ...SWRResponse, progress }
}
