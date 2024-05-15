import React, { useRef, useState } from 'react'

const TIMEOUT_MS = 150

interface LongPressProps {
  children: React.ReactNode
  onLongPressChange: (isLongPressed: boolean) => void
  className?: string
}

export const LongPress = ({ children, onLongPressChange, className }: LongPressProps) => {
  const [isLongPressed, setIsLongPressed] = useState(false)
  const touchIdentifier = useRef<React.Touch['identifier']>()
  const timer = useRef<number>()

  const handleStart = () => {
    timer.current = +setTimeout(() => {
      clearTimeout(timer.current)
      setIsLongPressed(true)
      onLongPressChange(true)
      delete timer.current
    }, TIMEOUT_MS)
  }

  const handleEnd = () => {
    setIsLongPressed(false)
    onLongPressChange(false)
    clearTimeout(timer.current)
    delete timer.current
    delete touchIdentifier.current
  }

  const handleTouch = (event: React.TouchEvent) => {
    if (touchIdentifier.current || isLongPressed) {
      return
    }
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

  const handleTouchEnd = (event: React.TouchEvent) => {
    isCurrentTouchChanged(event, handleEnd)
  }

  return (
    <div
      className={className}
      onTouchStart={timer.current ? undefined : handleTouch}
      onMouseDown={timer.current ? undefined : handleStart}
      onTouchMove={timer.current && !isLongPressed ? handleTouchEnd : undefined}
      onMouseMove={timer.current && !isLongPressed ? handleEnd : undefined}
      onTouchEnd={handleTouchEnd}
      onMouseUp={handleEnd}
    >
      {children}
    </div>
  )
}
