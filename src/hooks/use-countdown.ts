import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback)

  // Remember the latest callback if it changes.
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (!delay && delay !== 0) {
      return
    }

    const id = setInterval(() => savedCallback.current(), delay)

    return () => clearInterval(id)
  }, [delay])
}

const useCounter = (initialValue?: number) => {
  const [count, setCount] = useState(initialValue || 0)

  const increment = () => setCount(prev => prev + 1)
  const decrement = () => setCount(prev => prev - 1)
  const reset = () => setCount(initialValue || 0)

  return {
    count,
    increment,
    decrement,
    reset,
    setCount
  }
}

interface CountdownOption {
  /**
   * the countdown's starting number, initial value of the returned number.
   */
  countStart: number
  /**
   * the countdown's stopping number. Pass `-Infinity` to decrease forever.
   * @default 0
   */
  countStop?: number
  /**
   * the countdown's interval, in milliseconds.
   * @default 1000
   */
  intervalMs?: number
  /**
   * `false` by default, true if the countdown is increment.
   * @default false
   */
  isIncrement?: boolean
  /**
   * true if the countdown is running.
   * @default true
   */
  initialIsRunning?: boolean
}

export const useCountdown = ({
  countStart,
  countStop = 0,
  intervalMs = 1000,
  isIncrement = false,
  initialIsRunning = true
}: CountdownOption) => {
  const [isCountdownRunning, setIsCountdownRunning] = useState(initialIsRunning)

  const startCountdown = useCallback(() => {
    setIsCountdownRunning(true)
  }, [])

  const stopCountdown = useCallback(() => {
    setIsCountdownRunning(false)
  }, [])

  const {
    count,
    increment,
    decrement,
    reset: resetCounter
  } = useCounter(countStart)

  /**
   * Will set running false and reset the seconds to initial value
   */
  const resetCountdown = useCallback(() => {
    stopCountdown()
    resetCounter()
  }, [resetCounter, stopCountdown])

  const countdownCallback = useCallback(() => {
    if (count === countStop) {
      stopCountdown()
      return
    }

    if (isIncrement) {
      increment()
    } else {
      decrement()
    }
  }, [count, countStop, decrement, increment, isIncrement, stopCountdown])

  useInterval(countdownCallback, isCountdownRunning ? intervalMs : null)

  return useMemo(
    () => ({
      count,
      startCountdown,
      stopCountdown,
      resetCountdown
    }),
    [count, resetCountdown, startCountdown, stopCountdown]
  )
}
