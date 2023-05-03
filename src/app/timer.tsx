'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useCountdown } from '@/hooks/use-countdown'
import { useIsMounted } from '@/hooks/use-is-mounted'
import { cn } from '@/utils/cn'

const convertSecondsToTimeUnits = (initialSeconds: number) => {
  const days = Math.floor(initialSeconds / (3600 * 24))
  const hours = Math.floor((initialSeconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((initialSeconds % 3600) / 60)
  const seconds = Math.floor(initialSeconds % 60)

  return { days, hours, minutes, seconds }
}

export function CountdownTimer() {
  const { count } = useCountdown({
    countStart: 500_000
  })

  const { days, hours, minutes, seconds } = convertSecondsToTimeUnits(count)

  return (
    <div className="flex items-center gap-4">
      <CountdownUnit time={days} unit="d" />
      <CountdownUnit time={hours} unit="h" />
      <CountdownUnit time={minutes} unit="m" />
      <CountdownUnit time={seconds} unit="s" />
    </div>
  )
}

const CountdownUnit = ({ time, unit }: { time: number; unit: string }) => {
  const tens = Math.floor(time / 10)
  const units = time % 10

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center border rounded">
        <CountdownDigit time={tens} className="border-r" />
        <CountdownDigit time={units} />
      </div>

      <p>{unit}</p>
    </div>
  )
}

const CountdownDigit = ({
  time,
  className
}: {
  time: number
  className?: string
}) => {
  return (
    <div
      className={cn(
        'w-5 h-5 overflow-hidden relative flex items-center justify-center font-mono',
        className
      )}>
      <AnimatePresence>
        <motion.span
          key={time}
          exit={{ y: 12, opacity: 0, position: 'absolute' }}
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            ease: 'easeOut',
            duration: 0.4
          }}>
          {time}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
