"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCheck, UserX, Clock } from "lucide-react"
import { AnimatedCounter } from "./animated-counter"
import type { User } from "@/lib/api"

interface StatsCardsProps {
  users: User[]
}

export function StatsCards({ users }: StatsCardsProps) {
  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status === "active" || !u.status).length // Default to active if no status
  const inactiveUsers = users.filter((u) => u.status === "inactive").length
  const recentEnrollments = users.filter((u) => {
    const createDate = new Date(u.created_at)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return createDate >= weekAgo
  }).length

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Inactive Users",
      value: inactiveUsers,
      icon: UserX,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      title: "Recent Enrollments",
      value: recentEnrollments,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card
            className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${stat.borderColor} border`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>
                    <AnimatedCounter value={stat.value} />
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
