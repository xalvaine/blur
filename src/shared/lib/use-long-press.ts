import React, { useRef, useState } from 'react'

const TIMEOUT_MS = 300

export const useLongPress = () => {
  const [isLongPressed, setIsLongPressed] = useState(false)
  const touchIdentifier = useRef<React.Touch['identifier']>()
  const timer = useRef<number>()

  const handleStart = () => {
    if (timer.current) {
      return
    }

    timer.current = +setTimeout(() => {
      setIsLongPressed(true)
    }, TIMEOUT_MS)
  }

  const handleMove = () => {
    if (isLongPressed) {
      return
    }
    clearTimeout(timer.current)
    delete timer.current
    delete touchIdentifier.current
  }

  const handleEnd = () => {
    setIsLongPressed(false)
    clearTimeout(timer.current)
    delete timer.current
    delete touchIdentifier.current
  }

  const handleTouch = (event: React.TouchEvent) => {
    touchIdentifier.current = event.changedTouches.item(0).identifier
    handleStart()
  }

  const isCurrentTouchChanged = (
    event: React.TouchEvent,
    callback: () => unknown,
  ) => {
    for (let index = 0; index < event.changedTouches.length; index++) {
      if (event.changedTouches[index].identifier === touchIdentifier.current) {
        callback()
      }
    }
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    isCurrentTouchChanged(event, handleMove)
  }

  const handleTouchEnd = (event: React.TouchEvent) => {
    isCurrentTouchChanged(event, handleEnd)
  }

  const elementProps: React.HTMLAttributes<HTMLElement> = {
    onTouchStart: handleTouch,
    onMouseDown: handleStart,
    onTouchMove: handleTouchMove,
    onMouseMove: handleMove,
    onTouchEnd: handleTouchEnd,
    onMouseUp: handleEnd,
  }

  return { isLongPressed, elementProps }
}
