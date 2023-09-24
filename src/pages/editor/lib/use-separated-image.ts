import useSWR from 'swr'

import { handleSeparateImage } from './handle-separate-image'

interface UseSeparatedImageParams {
  image: File | undefined
}

export const useSeparatedImage = ({ image }: UseSeparatedImageParams) => {
  return useSWR<Components.Schemas.Segmentation>(
    image ? [`${process.env.REACT_APP_BACKEND_URL}/segment`, image] : null,
    handleSeparateImage,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 0,
    },
  )
}
