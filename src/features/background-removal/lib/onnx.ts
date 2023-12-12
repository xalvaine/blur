import ndarray, { NdArray } from 'ndarray'
import * as ort from 'onnxruntime-web'

export async function runOnnxSession(
  model: ArrayBufferLike,
  input: NdArray<Float32Array>,
) {
  ort.env.wasm.numThreads = navigator.hardwareConcurrency
  ort.env.wasm.proxy = true

  const ort_config: ort.InferenceSession.SessionOptions = {
    executionProviders: ['wasm'],
    graphOptimizationLevel: 'all',
    executionMode: 'parallel',
    enableCpuMemArena: true,
  }
  const session = (await ort.InferenceSession.create(
    model,
    ort_config,
  )) as ort.InferenceSession

  const feeds = {
    input: new ort.Tensor('float32', new Float32Array(input.data), input.shape),
  }
  const outputData = await session.run(feeds, {})

  const output: ort.Tensor = outputData['output']
  const shape: number[] = output.dims as number[]
  const data: Float32Array = output.data as Float32Array
  const tensor = ndarray(data, shape)
  return tensor
}
