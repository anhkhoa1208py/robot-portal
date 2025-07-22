"use client"

import { motion } from "framer-motion"

interface LoadingSkeletonProps {
  count?: number
}

export function LoadingSkeleton({ count = 3 }: LoadingSkeletonProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-slate-200 rounded-full animate-pulse" />
            <div className="flex-1">
              <div className="h-4 bg-slate-200 rounded animate-pulse mb-2" />
              <div className="h-3 bg-slate-200 rounded animate-pulse w-2/3" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-3 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 bg-slate-200 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
