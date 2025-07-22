"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

interface Step {
  id: number
  title: string
  description: string
}

interface ProgressStepsProps {
  steps: Step[]
  currentStep: number
}

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                step.id < currentStep
                  ? "bg-green-500 border-green-500 text-white"
                  : step.id === currentStep
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-slate-300 text-slate-400"
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {step.id < currentStep ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <span className="font-semibold">{step.id}</span>
              )}
            </motion.div>
            <div className="mt-2 text-center">
              <div className={`text-sm font-medium ${step.id <= currentStep ? "text-slate-800" : "text-slate-400"}`}>
                {step.title}
              </div>
              <div className={`text-xs ${step.id <= currentStep ? "text-slate-600" : "text-slate-400"}`}>
                {step.description}
              </div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <motion.div
              className={`w-16 h-0.5 mx-4 transition-all duration-300 ${
                step.id < currentStep ? "bg-green-500" : "bg-slate-300"
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
