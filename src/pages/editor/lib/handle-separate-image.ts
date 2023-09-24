import axios from 'axios'

export const handleSeparateImage = async ([url, image]: [string, File]) => {
  const formData = new FormData()
  formData.append(`file`, image)

  return (
    await axios.post<Paths.SegmentPhotoBackgroundAndForegroundSegmentPost.Responses.$200>(
      url,
      formData,
    )
  ).data
}
