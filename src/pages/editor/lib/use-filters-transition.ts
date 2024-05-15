import { ComponentProps, useEffect, useRef, useState } from 'react'

import { Scene } from '../ui/scene'
import { animateIntegerTransition } from './animate-integer-transition'

type UseFiltersTransitionParams = Pick<
  ComponentProps<typeof Scene>,
  `blurType` | `radius`
>

export const useFiltersTransition = ({
  blurType,
  radius,
}: UseFiltersTransitionParams) => {
  const [isTransiting, setIsTransiting] = useState(false)
  const [isLongPressed, setIsLongPressed] = useState(false)
  const [transitedRadius, setTransitedRadius] = useState(radius)
  const [transitedBlurType, setTransitedBlurType] =
    useState<typeof blurType>(blurType)
  const lastBlurType = useRef<typeof blurType>()
  const lastIsLongPressed = useRef(isLongPressed)

  useEffect(() => {
    if (isTransiting || lastBlurType.current === blurType) {
      return
    }

    // Не анимируем блюр в только что прикрепленном изображении
    if (!lastBlurType.current) {
      lastBlurType.current = blurType
      return
    }

    setIsTransiting(true)
    animateIntegerTransition(radius, 0, 150, setTransitedRadius)
      .then(() => {
        lastBlurType.current = blurType
        setTransitedBlurType(blurType)
        return animateIntegerTransition(0, radius, 150, setTransitedRadius)
      })
      .then(() => setIsTransiting(false))
  }, [blurType, isTransiting, radius])

  useEffect(() => {
    if (isTransiting || lastIsLongPressed.current === isLongPressed) {
      return
    }

    setIsTransiting(true)
    animateIntegerTransition(
      isLongPressed ? radius : 0,
      isLongPressed ? 0 : radius,
      150,
      setTransitedRadius,
    ).then(() => {
      setIsTransiting(false)
      lastIsLongPressed.current = isLongPressed
    })
  }, [isLongPressed, isTransiting, radius])

  useEffect(() => {
    if (
      !isTransiting &&
      radius !== transitedRadius &&
      !isLongPressed &&
      lastIsLongPressed.current === isLongPressed
    ) {
      setTransitedRadius(radius)
    }
  }, [isLongPressed, isTransiting, radius, transitedRadius])

  return {
    handleLongPressChange: setIsLongPressed,
    transitedRadius,
    transitedBlurType,
  }
}
