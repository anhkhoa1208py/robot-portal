"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Camera, X, CheckCircle, AlertCircle, Loader2, Video, RotateCcw } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { FaceRecognitionAPI } from "@/lib/api"

interface ImageUploadProps {
  onImageUpload: (image: string, file: File) => void
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [faceDetected, setFaceDetected] = useState<boolean | null>(null)
  const [detectionResult, setDetectionResult] = useState<any>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  const { toast } = useToast()

  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Debug function to check video state
  const debugVideoState = () => {
    if (videoRef.current) {
      console.log('Video debug info:', {
        videoWidth: videoRef.current.videoWidth,
        videoHeight: videoRef.current.videoHeight,
        readyState: videoRef.current.readyState,
        paused: videoRef.current.paused,
        ended: videoRef.current.ended,
        srcObject: !!videoRef.current.srcObject
      })
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please select an image smaller than 10MB",
            variant: "destructive",
          })
          return
        }

        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result as string
          setPreview(result)
          setSelectedFile(file)
          setFaceDetected(null)
          setDetectionResult(null)
        }
        reader.readAsDataURL(file)
      }
    },
    [toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
  })

  // Camera functionality
  const startCamera = async () => {
    // Check if camera is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera not supported in this browser.')
      toast({
        title: "Camera Not Supported",
        description: "Your browser doesn't support camera access. Please use file upload instead.",
        variant: "destructive",
      })
      return
    }

    // Show camera interface immediately
    setShowCamera(true)
    setCameraError(null)
    setIsCameraActive(false) // Reset camera state
    
    try {
      // Try with ideal constraints first
      let constraints = {
        video: {
          width: { ideal: 640, min: 480 },
          height: { ideal: 480, min: 360 },
          facingMode: 'user'
        }
      }

      let stream: MediaStream
      
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints)
      } catch (firstError) {
        console.log('Trying with simpler constraints:', firstError)
        // Fallback to simpler constraints
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }
        })
      }
      
      streamRef.current = stream
      
      // Ensure video element exists and set up properly
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        
        // Handle video events
        const onMetadataLoaded = () => {
          console.log('Video metadata loaded, dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight)
          if (videoRef.current) {
            videoRef.current.play().then(() => {
              setIsCameraActive(true)
              console.log('Camera started successfully')
              setTimeout(debugVideoState, 1000) // Debug after 1 second
            }).catch((playError) => {
              console.error('Error playing video:', playError)
              setCameraError('Video playback failed. Please refresh the page and try again.')
            })
          }
        }

        const onCanPlay = () => {
          console.log('Video can play')
          if (!isCameraActive) {
            setIsCameraActive(true)
          }
        }

        videoRef.current.onloadedmetadata = onMetadataLoaded
        videoRef.current.oncanplay = onCanPlay
        
        // Force play attempt
        if (videoRef.current.readyState >= 2) {
          onCanPlay()
        }
      }
      
    } catch (error: any) {
      console.error('Camera access error:', error)
      let errorMessage = 'Unable to access camera. Please try again.'
      
      switch (error.name) {
        case 'NotAllowedError':
          errorMessage = 'Camera access denied. Please allow camera permissions and refresh the page.'
          break
        case 'NotFoundError':
          errorMessage = 'No camera found. Please check if your device has a camera.'
          break
        case 'NotReadableError':
          errorMessage = 'Camera is being used by another application. Please close other apps and try again.'
          break
        case 'OverconstrainedError':
          errorMessage = 'Camera settings not supported. Please try again.'
          break
        case 'SecurityError':
          errorMessage = 'Camera access blocked by security policy. Please check your browser settings.'
          break
      }
      
      setCameraError(errorMessage)
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCameraActive(false)
    setShowCamera(false)
    setCameraError(null)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) {
      toast({
        title: "Capture Failed",
        description: "Camera is not ready. Please try again.",
        variant: "destructive",
      })
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) {
      toast({
        title: "Capture Failed", 
        description: "Canvas not supported. Please try a different browser.",
        variant: "destructive",
      })
      return
    }

    // Check if video has valid dimensions
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      toast({
        title: "Capture Failed",
        description: "Video not ready. Please wait a moment and try again.",
        variant: "destructive",
      })
      return
    }

    try {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Flip the image horizontally (since we show mirrored view)
      context.save()
      context.scale(-1, 1)
      context.translate(-canvas.width, 0)
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      context.restore()

      // Convert canvas to blob and then to file
      canvas.toBlob((blob) => {
        if (blob) {
          const timestamp = Date.now()
          const file = new File([blob], `camera-capture-${timestamp}.png`, {
            type: 'image/png'
          })

          // Convert to data URL for preview
          const reader = new FileReader()
          reader.onload = () => {
            const result = reader.result as string
            setPreview(result)
            setSelectedFile(file)
            setFaceDetected(null)
            setDetectionResult(null)
            stopCamera()

            toast({
              title: "Photo captured!",
              description: "Photo captured successfully from camera",
            })
          }
          reader.onerror = () => {
            toast({
              title: "Capture Failed",
              description: "Failed to process captured image.",
              variant: "destructive",
            })
          }
          reader.readAsDataURL(file)
        } else {
          toast({
            title: "Capture Failed",
            description: "Failed to create image from camera.",
            variant: "destructive",
          })
        }
      }, 'image/png', 0.95) // High quality
      
    } catch (error) {
      console.error('Capture error:', error)
      toast({
        title: "Capture Failed",
        description: "An error occurred while capturing the photo.",
        variant: "destructive",
      })
    }
  }

  const handleConfirm = async () => {
    if (preview && selectedFile) {
      setIsProcessing(true)

      try {
        // Call the real face detection API
        const result = await FaceRecognitionAPI.detectFace(selectedFile)
        setDetectionResult(result)
        setFaceDetected(result.faces_detected > 0)

        if (result.faces_detected > 0) {
          const firstFace = result.faces[0]
          const confidence = firstFace?.confidence || 0
          
          toast({
            title: "Face detected successfully!",
            description: `Confidence: ${(confidence).toFixed(1)}% • ${result.faces_detected} face(s) found`,
          })

          // Show success state for a moment before proceeding
          setTimeout(() => {
            onImageUpload(preview, selectedFile)
          }, 1000)
        } else {
          toast({
            title: "No face detected",
            description: result.message || "Please upload a clear image with a visible face",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Face detection error:", error)
        toast({
          title: "Detection failed",
          description: "Unable to process image. Please try again.",
          variant: "destructive",
        })
        setFaceDetected(false)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleReset = () => {
    setPreview(null)
    setSelectedFile(null)
    setFaceDetected(null)
    setDetectionResult(null)
    stopCamera() // Stop camera when resetting
  }

  // Camera UI component
  const CameraCapture = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Camera Capture</h3>
        <p className="text-slate-600">Position your face in the camera frame and capture your photo</p>
      </div>

      <Card className="max-w-lg mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="relative bg-slate-900 rounded-xl overflow-hidden">
            {isCameraActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-80 object-cover rounded-xl bg-black"
                  style={{ 
                    transform: 'scaleX(-1)', // Mirror effect for selfie
                    WebkitTransform: 'scaleX(-1)'
                  }}
                  onLoadedMetadata={() => {
                    console.log('Video metadata loaded')
                    debugVideoState()
                  }}
                  onCanPlay={() => {
                    console.log('Video can play')
                    debugVideoState()
                  }}
                  onError={(e) => {
                    console.error('Video error:', e)
                    setCameraError('Video playback error occurred.')
                  }}
                />
                {/* Camera overlay guide */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-6 border-2 border-white/50 rounded-full"></div>
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    Position your face in the circle
                  </div>
                  {/* Debug info in development */}
                  {process.env.NODE_ENV === 'development' && (
                    <button
                      onClick={debugVideoState}
                      className="absolute bottom-4 left-4 bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Debug Video
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="w-full h-80 flex items-center justify-center bg-slate-100 rounded-xl">
                <div className="text-center">
                  <Video className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600">
                    {cameraError ? 'Camera Error' : 'Starting camera...'}
                  </p>
                  {cameraError && (
                    <p className="text-red-500 text-sm mt-2 max-w-xs">{cameraError}</p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={stopCamera}>
          <X className="w-4 h-4 mr-2" />
          Back to Upload
        </Button>
        
        {!isCameraActive ? (
          <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700">
            <Video className="w-4 h-4 mr-2" />
            {cameraError ? 'Retry Camera' : 'Start Camera'}
          </Button>
        ) : (
          <Button onClick={capturePhoto} className="bg-green-600 hover:bg-green-700">
            <Camera className="w-4 h-4 mr-2" />
            Capture Photo
          </Button>
        )}
      </div>
    </motion.div>
  )

  if (preview) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-800 mb-2">Image Preview</h3>
          <p className="text-slate-600">AI-powered face detection will analyze this image</p>
        </div>

        <Card className="max-w-md mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="relative">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  width={300}
                  height={300}
                  className="w-full h-64 object-cover rounded-xl"
                />
              </motion.div>
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-3 right-3 rounded-full w-8 h-8 p-0"
                onClick={handleReset}
              >
                <X className="w-4 h-4" />
              </Button>

              {/* Face detection overlay */}
              <AnimatePresence>
                {faceDetected !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`absolute inset-0 rounded-xl flex items-center justify-center ${
                      faceDetected ? "bg-green-500/20" : "bg-red-500/20"
                    }`}
                  >
                    <div className={`p-3 rounded-full ${faceDetected ? "bg-green-500" : "bg-red-500"}`}>
                      {faceDetected ? (
                        <CheckCircle className="w-8 h-8 text-white" />
                      ) : (
                        <AlertCircle className="w-8 h-8 text-white" />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="relative w-16 h-16 mx-auto mb-4">
                <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
              </div>
              <p className="text-slate-600 font-medium">Analyzing facial features...</p>
              <p className="text-sm text-slate-500 mt-1">Using AI-powered face detection</p>
            </motion.div>
          ) : faceDetected === true ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-green-700 font-semibold mb-2">Face detected successfully!</p>
              {detectionResult?.faces && detectionResult.faces.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm text-slate-600">
                    Confidence: {(detectionResult.faces[0].confidence).toFixed(1)}%
                  </p>
                  <p className="text-sm text-slate-600">
                    Faces detected: {detectionResult.faces_detected}
                  </p>
                  {detectionResult.recommendations && detectionResult.recommendations.length > 0 && (
                    <p className="text-xs text-amber-600 bg-amber-50 rounded px-2 py-1 mt-2">
                      {detectionResult.recommendations[0]}
                    </p>
                  )}
                </div>
              )}
              <p className="text-sm text-slate-600 mt-2">Proceeding to next step...</p>
            </motion.div>
          ) : faceDetected === false ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-700 font-semibold mb-2">No face detected</p>
              <p className="text-sm text-slate-600 mb-2">
                {detectionResult?.message || "Please try with a clearer image showing a face"}
              </p>
              {detectionResult?.recommendations && detectionResult.recommendations.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <p className="text-xs font-medium text-blue-800 mb-2">Recommendations:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    {detectionResult.recommendations.map((rec: string, index: number) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleReset}>
                  Try Again
                </Button>
                <Button 
                  onClick={() => {
                    if (preview && selectedFile) {
                      toast({
                        title: "Proceeding without face detection",
                        description: "Image uploaded but no face was detected",
                        variant: "default",
                      })
                      onImageUpload(preview, selectedFile)
                    }
                  }}
                  variant="secondary"
                >
                  Continue Anyway
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-center"
            >
              <Button variant="outline" onClick={handleReset} className="bg-white/80 backdrop-blur-sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                variant="outline"
                onClick={startCamera}
                className="bg-white/80 backdrop-blur-sm"
              >
                <Camera className="w-4 h-4 mr-2" />
                Retake with Camera
              </Button>
              <Button
                onClick={handleConfirm}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Analyze Face
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  // Show camera capture view if camera is active
  if (showCamera) {
    return <CameraCapture />
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Upload Profile Image</h3>
        <p className="text-slate-600">
          Drag & drop an image or use your camera. Our AI will verify face detection before enrollment.
        </p>
      </div>

      {/* Camera option - only show if camera is supported */}
      {typeof navigator !== 'undefined' && navigator.mediaDevices && 'getUserMedia' in navigator.mediaDevices && (
        <div className="flex justify-center mb-6">
          <Button
            variant="outline"
            onClick={startCamera}
            className="bg-white/80 backdrop-blur-sm border-slate-300 hover:bg-white hover:border-slate-400"
          >
            <Camera className="w-4 h-4 mr-2" />
            Use Camera Instead
          </Button>
        </div>
      )}

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card
          {...getRootProps()}
          className={`border-2 border-dashed cursor-pointer transition-all duration-300 bg-white/60 backdrop-blur-sm ${
            isDragActive
              ? "border-blue-500 bg-blue-50/80 shadow-lg scale-105"
              : "border-slate-300 hover:border-slate-400 hover:shadow-md"
          }`}
        >
          <CardContent className="flex flex-col items-center justify-center py-16">
            <input {...getInputProps()} />
            <motion.div animate={isDragActive ? { scale: 1.1 } : { scale: 1 }} className="text-center">
              <div className="relative mb-6">
                <Upload
                  className={`w-16 h-16 mx-auto transition-colors ${isDragActive ? "text-blue-500" : "text-slate-400"}`}
                />
                {isDragActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"
                  />
                )}
              </div>
              <p className="text-xl font-semibold text-slate-800 mb-2">
                {isDragActive ? "Drop the image here" : "Drag & drop an image here"}
              </p>
              <p className="text-slate-600 mb-6">or click to select from your device</p>
              <Button
                variant="outline"
                className="bg-white/80 backdrop-blur-sm border-slate-300 hover:bg-white hover:border-slate-400"
              >
                <Camera className="w-5 h-5 mr-2" />
                Select Image
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-slate-100/80 rounded-full px-4 py-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          Supported formats: JPEG, PNG, GIF (Max size: 10MB)
        </div>
      </div>
    </motion.div>
  )
}
