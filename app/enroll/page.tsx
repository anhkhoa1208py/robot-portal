"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"
import { UserForm } from "@/components/user-form"
import { EnrollmentSuccess } from "@/components/enrollment-success"
import { ProgressSteps } from "@/components/progress-steps"
import { PageTransition } from "@/components/page-transition"

const steps = [
  { id: 1, title: "Upload Image", description: "Capture or upload a clear photo" },
  { id: 2, title: "Enter Details", description: "Provide user information" },
  { id: 3, title: "Complete", description: "Enrollment successful" },
]

export default function EnrollPage() {
  const [step, setStep] = useState(1)
  const [imageData, setImageData] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [userData, setUserData] = useState<any>(null)

  const handleImageUpload = (image: string, file: File) => {
    setImageData(image)
    setImageFile(file)
    setStep(2)
  }

  const handleUserSubmit = (data: any) => {
    setUserData(data)
    setStep(3)
  }

  const handleReset = () => {
    setStep(1)
    setImageData(null)
    setImageFile(null)
    setUserData(null)
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <Link href="/">
              <Button variant="ghost" size="sm" className="group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Button>
            </Link>
            <div className="text-sm text-slate-600">
              Step {step} of {steps.length}
            </div>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <ProgressSteps steps={steps} currentStep={step} />
            </motion.div>

            {/* Main Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-slate-800">{steps[step - 1].title}</CardTitle>
                  <CardDescription className="text-lg text-slate-600">{steps[step - 1].description}</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ImageUpload onImageUpload={handleImageUpload} />
                      </motion.div>
                    )}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <UserForm
                          imageData={imageData}
                          imageFile={imageFile}
                          onSubmit={handleUserSubmit}
                          onBack={() => setStep(1)}
                        />
                      </motion.div>
                    )}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        <EnrollmentSuccess userData={userData} onReset={handleReset} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
