"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Trash2, MoreVertical, Mail, Calendar, Building, Hash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import type { User } from "@/lib/api"

interface UserCardProps {
  user: User
  onDelete: (userId: string) => void
  onToggleStatus: (userId: string) => void
}

export function UserCard({ user, onDelete, onToggleStatus }: UserCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
        <CardHeader className="pb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Image
                  src={user.image_url || "/placeholder.svg?height=100&width=100"}
                  alt={user.name}
                  width={60}
                  height={60}
                  className="w-15 h-15 object-cover rounded-full border-2 border-white shadow-md"
                />
              </motion.div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">{user.name}</h4>
                <p className="text-sm text-slate-600 font-medium">ID: {user.id}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm">
                <DropdownMenuItem className="cursor-pointer">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleStatus(user.id.toString())} className="cursor-pointer">
                  {user.status === "active" ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(user.id.toString())} className="text-red-600 cursor-pointer">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 font-medium">Status</span>
            <Badge
              variant={user.status === "active" ? "default" : "secondary"}
              className={`${
                user.status === "active"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-orange-100 text-orange-700 border-orange-200"
              }`}
            >
              {user.status || "active"}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600 truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Building className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">{user.department}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-3">
                <Hash className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">{user.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600">Created: {new Date(user.created_at).toLocaleDateString()}</span>
            </div>
            <div className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
              Updated: {new Date(user.updated_at).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
