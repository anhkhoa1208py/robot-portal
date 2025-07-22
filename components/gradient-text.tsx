"use client"

import type React from "react"

import { motion } from "framer-motion"

interface GradientTextProps {
  children: React.ReactNode
  className?: string
}

export function GradientText({ children, className = "" }: GradientTextProps) {
  return (
    <motion.span
      className={`text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.span>
  )
}
