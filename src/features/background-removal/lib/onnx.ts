import ndarray, { NdArray } from 'ndarray'
import * as ort from 'onnxruntime-web'

import { isSafari } from 'shared/lib'

export async function runOnnxSession(
  model: ArrayBufferLike,
  input: NdArray<Float32Array>,
  inputKey: string,
  outputKey: string,
  providers: string[],
) {
  ort.env.wasm.numThreads = isSafari() ? 1 : navigator.hardwareConcurrency // https://github.com/microsoft/onnxruntime/issues/11567
  ort.env.wasm.proxy = true

  const ort_config: ort.InferenceSession.SessionOptions = {
    executionProviders: providers,
    graphOptimizationLevel: 'all',
    executionMode: 'parallel',
    enableCpuMemArena: true,
  }
  const session = (await ort.InferenceSession.create(
    model,
    ort_config,
  )) as ort.InferenceSession

  const feeds = {
    [inputKey]: new ort.Tensor(
      'float32',
      new Float32Array(input.data),
      input.shape,
    ),
  }
  const outputData = await session.run(feeds, {})

  const output: ort.Tensor = outputData[outputKey]
  const shape: number[] = output.dims as number[]
  const data: Float32Array = output.data as Float32Array
  return ndarray(data, shape)
}
