"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, User, Loader2, CheckCircle } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { FaceRecognitionAPI } from "@/lib/api"

interface UserFormProps {
  imageData: string | null
  imageFile: File | null
  onSubmit: (data: any) => void
  onBack: () => void
}

export function UserForm({ imageData, imageFile, onSubmit, onBack }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false)
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.department) newErrors.department = "Department is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive",
      })
      return
    }

    if (!imageFile) {
      toast({
        title: "Image Required",
        description: "Please upload an image before submitting",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Call the real enrollment API with correct field structure
      const enrollmentData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        image: imageFile,
      }

      const result = await FaceRecognitionAPI.enrollUser(enrollmentData)

      if (result.success) {
        setEnrollmentSuccess(true)
        toast({
          title: "Enrollment Successful!",
          description: result.message || "User has been enrolled successfully",
        })

        // Pass the result data to parent component
        onSubmit({
          ...formData,
          imageData,
          enrollmentDate: new Date().toISOString().split("T")[0],
          userId: result.user_id,
          faceId: result.face_id,
          apiResponse: result,
        })
      } else {
        throw new Error(result.message || "Enrollment failed")
      }
    } catch (error: any) {
      console.error("Enrollment error:", error)
      toast({
        title: "Enrollment Failed",
        description: error.message || "Unable to enroll user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  if (enrollmentSuccess) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-green-700 mb-2">Processing Complete!</h3>
        <p className="text-slate-600">User enrollment is being finalized...</p>
      </motion.div>
    )
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8">
      <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={onBack} className="group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back
        </Button>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Enter User Details</h3>
          <p className="text-slate-600">Complete the enrollment by providing user information</p>
        </div>
      </motion.div>

      <div className="flex gap-8">
        {/* Image Preview */}
        <motion.div variants={itemVariants}>
          <Card className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              {imageData ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={imageData || "/placeholder.svg"}
                    alt="User preview"
                    width={150}
                    height={150}
                    className="w-40 h-40 object-cover rounded-xl shadow-md"
                  />
                  <div className="mt-3 text-center">
                    <div className="text-xs text-green-600 bg-green-50 rounded-full px-3 py-1">✓ Face Detected</div>
                  </div>
                </motion.div>
              ) : (
                <div className="w-40 h-40 bg-slate-100 rounded-xl flex items-center justify-center">
                  <User className="w-12 h-12 text-slate-400" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Form */}
        <motion.form variants={itemVariants} onSubmit={handleSubmit} className="flex-1 space-y-6">
          <div>
            <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
              Full Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`mt-2 h-12 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400 ${
                errors.name ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""
              }`}
              placeholder="Enter full name"
              disabled={isSubmitting}
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-1"
              >
                {errors.name}
              </motion.p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`mt-2 h-12 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400 ${
                errors.email ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""
              }`}
              placeholder="Enter email address"
              disabled={isSubmitting}
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-1"
              >
                {errors.email}
              </motion.p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="mt-2 h-12 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                placeholder="Enter phone number"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="department" className="text-sm font-semibold text-slate-700">
                Department *
              </Label>
              <Select onValueChange={(value) => handleChange("department", value)} disabled={isSubmitting}>
                <SelectTrigger
                  className={`mt-2 h-12 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400 ${
                    errors.department ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""
                  }`}
                >
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="DigitalBanking">Digital Banking</SelectItem>
                </SelectContent>
              </Select>
              {errors.department && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs mt-1"
                >
                  {errors.department}
                </motion.p>
              )}
            </div>
          </div>



          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 pt-6"
          >
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="bg-white/80 backdrop-blur-sm"
              disabled={isSubmitting}
            >
              Back to Image
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enrolling User...
                </>
              ) : (
                "Complete Enrollment"
              )}
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  )
}
