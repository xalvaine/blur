import ndarray, { NdArray } from 'ndarray'

export const convertTensorHWCtoBCHW = (
  imageTensor: NdArray<Uint32Array>,
  mean: number[] = [128, 128, 128],
  std: number[] = [256, 256, 256],
): NdArray<Float32Array> => {
  const imageBufferData = imageTensor.data
  const [srcHeight, srcWidth, srcChannels] = imageTensor.shape
  const stride = srcHeight * srcWidth
  const float32Data = new Float32Array(3 * stride)

  // r_0, r_1, .... g_0,g_1, .... b_0
  for (let i = 0, j = 0; i < imageBufferData.length; i += 4, j += 1) {
    float32Data[j] = (imageBufferData[i] - mean[0]) / std[0]
    float32Data[j + stride] = (imageBufferData[i + 1] - mean[1]) / std[1]
    float32Data[j + stride + stride] =
      (imageBufferData[i + 2] - mean[2]) / std[2]
  }

  return ndarray(float32Data, [1, 3, srcHeight, srcWidth])
}
