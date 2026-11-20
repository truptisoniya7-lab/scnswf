import { useState, useEffect, useCallback, useRef } from 'react'

export function useCountdown(initialSeconds = 30) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const [isActive, setIsActive] = useState(false)
  const timerRef = useRef<number | null>(null)

  const start = useCallback((secs?: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setSecondsLeft(secs !== undefined ? secs : initialSeconds)
    setIsActive(true)
  }, [initialSeconds])

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setSecondsLeft(initialSeconds)
    setIsActive(false)
  }, [initialSeconds])

  useEffect(() => {
    if (isActive && secondsLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current)
            setIsActive(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (secondsLeft === 0) {
      setIsActive(false)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isActive, secondsLeft])

  return {
    secondsLeft,
    isActive,
    isComplete: secondsLeft === 0,
    start,
    reset,
  }
}
