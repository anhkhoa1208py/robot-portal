"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Upload, Shield, Database, ArrowRight, Zap, Award, Globe } from "lucide-react"
import { AnimatedCounter } from "@/components/animated-counter"
import { FloatingElements } from "@/components/floating-elements"
import { GradientText } from "@/components/gradient-text"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

const features = [
  {
    icon: Upload,
    title: "Smart Upload",
    description: "AI-powered image processing with instant quality validation",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption with compliance certifications",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: Users,
    title: "Advanced Management",
    description: "Comprehensive user lifecycle and access control",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Database,
    title: "AI Recognition",
    description: "99.9% accuracy with real-time processing capabilities",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
]

const stats = [
  { value: 99.9, suffix: "%", label: "Recognition Accuracy" },
  { value: 0.3, suffix: "s", label: "Processing Time" },
  { value: 256, suffix: "-bit", label: "Encryption Security" },
  { value: 50000, suffix: "+", label: "Users Enrolled" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <FloatingElements />

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="text-center mb-20">
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-blue-700 border border-blue-200 mb-8">
              <Zap className="w-4 h-4" />
              Enterprise-Grade Facial Recognition
            </div>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <GradientText>Face Recognition</GradientText>
            <br />
            <span className="text-slate-800">Portal</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Advanced AI-powered facial recognition system designed for enterprise security, user management, and
            seamless authentication workflows.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/enroll">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Upload className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Start Enrollment
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/manage">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/80 backdrop-blur-sm border-slate-300 hover:bg-white hover:border-slate-400 px-8 py-4 text-lg font-semibold transition-all duration-300"
              >
                <Users className="w-5 h-5 mr-2" />
                Manage Users
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm hover:bg-white hover:-translate-y-2">
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 mx-auto rounded-2xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 md:p-12 mb-20 border border-white/20 shadow-xl"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-slate-600">Delivering exceptional performance and reliability at scale</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div key={index} variants={itemVariants} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="text-center">
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-slate-700">ISO 27001 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-slate-700">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">GDPR Ready</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
