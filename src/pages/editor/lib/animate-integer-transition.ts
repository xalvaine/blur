import { useEffect } from 'react'

interface UseAnimateBlurParams {
  startRadius: number
  endRadius: number
  duration: number
}

const inOutQuad = (n: number) => {
  n *= 2
  if (n < 1) return 0.5 * n * n
  return -0.5 * (--n * (n - 2) - 1)
}

export const animateIntegerTransition = (
  startValue: number,
  endValue: number,
  duration: number,
  setValue: (value: number) => void,
) =>
  new Promise((resolve) => {
    let previousTimestamp: number
    let requestId: number
    let previousValue: number
    let count = 0

    const step = (timestamp: number) => {
      if (!previousTimestamp) {
        previousTimestamp = timestamp
        requestAnimationFrame(step)
        return
      }

      const delta = timestamp - previousTimestamp

      const value = Math.round(
        inOutQuad(delta / duration) * (endValue - startValue) + startValue,
      )

      if (delta < duration) {
        if (value !== previousValue) {
          setValue(value)
          previousValue = value
        }
        count++
        requestAnimationFrame(step)
      } else {
        cancelAnimationFrame(requestId)
        console.log(count)
        resolve(undefined)
      }
    }

    requestId = requestAnimationFrame(step)
  })
