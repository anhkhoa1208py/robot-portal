"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, User, Mail, Building, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface EnrollmentSuccessProps {
  userData: any
  onReset: () => void
}

export function EnrollmentSuccess({ userData, onReset }: EnrollmentSuccessProps) {
  return (
    <div className="space-y-6 text-center">
      <div className="flex flex-col items-center">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-green-700 mb-2">Enrollment Successful!</h3>
        <p className="text-gray-600">User has been successfully enrolled in the facial recognition system</p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            {userData.imageData && (
              <Image
                src={userData.imageData || "/placeholder.svg"}
                alt="User"
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-full"
              />
            )}
            <div className="text-left">
              <h4 className="font-semibold text-lg">
                {userData.full_name}
              </h4>
              <p className="text-sm text-gray-600">CCCD: {userData.cccd_number}</p>
            </div>
          </div>

          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Gender: {userData.gender}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Born: {new Date(userData.birth_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-3">
              <Building className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Address: {userData.permanent_address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Enrolled: {userData.enrollmentDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onReset}>Enroll Another User</Button>
        <Button variant="outline" asChild>
          <Link href="/manage">View All Users</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}
