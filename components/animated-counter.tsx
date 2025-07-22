"use client"

import { useEffect, useState } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { useRef } from "react"

interface AnimatedCounterProps {
  value: number
  suffix?: string
  duration?: number
}

export function AnimatedCounter({ value, suffix = "", duration = 2 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref)

  useEffect(() => {
    if (inView) {
      const timer = setInterval(() => {
        setCount((prevCount) => {
          const increment = value / (duration * 60) // 60fps
          const nextCount = prevCount + increment

          if (nextCount >= value) {
            clearInterval(timer)
            return value
          }

          return nextCount
        })
      }, 1000 / 60)

      return () => clearInterval(timer)
    }
  }, [inView, value, duration])

  const displayValue = value < 10 ? count.toFixed(1) : Math.floor(count).toLocaleString()

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {displayValue}
      {suffix}
    </motion.span>
  )
}
