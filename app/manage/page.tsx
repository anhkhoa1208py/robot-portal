"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Download, Plus, Filter, RefreshCw } from "lucide-react"
import { UserCard } from "@/components/user-card"
import { StatsCards } from "@/components/stats-cards"
import { PageTransition } from "@/components/page-transition"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { FaceRecognitionAPI, type User } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function ManagePage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  // Load users from API - no parameters, just like curl
  const loadUsers = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      // Call API exactly like curl command - no parameters
      const response = await FaceRecognitionAPI.getUsers()

      if (response.success) {
        setUsers(response.users)
        setFilteredUsers(response.users)

        if (showRefreshIndicator) {
          toast({
            title: "Users Refreshed",
            description: `Loaded ${response.count} users successfully`,
          })
        }
      } else {
        throw new Error("Failed to load users")
      }
    } catch (error: any) {
      console.error("Failed to load users:", error)
      toast({
        title: "Failed to Load Users",
        description: error.message || "Unable to fetch user data. Please try again.",
        variant: "destructive",
      })

      // Fallback to empty array on error
      setUsers([])
      setFilteredUsers([])
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.id.toString().includes(searchTerm),
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const handleDeleteUser = async (userId: string) => {
    try {
      const result = await FaceRecognitionAPI.deleteUser(userId)

      if (result.success) {
        setUsers(users.filter((user) => user.id.toString() !== userId))
        toast({
          title: "User Deleted",
          description: result.message || "User has been successfully deleted",
        })
      } else {
        throw new Error(result.message || "Failed to delete user")
      }
    } catch (error: any) {
      console.error("Failed to delete user:", error)
      toast({
        title: "Delete Failed",
        description: error.message || "Unable to delete user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (userId: string) => {
    try {
      const user = users.find((u) => u.id.toString() === userId)
      if (!user) return

      const newStatus = user.status === "active" ? "inactive" : "active"

      // Since the API might not support status updates, we'll just update locally for now
      setUsers(users.map((user) => (user.id.toString() === userId ? { ...user, status: newStatus } : user)))

      toast({
        title: "Status Updated",
        description: `User status changed to ${newStatus}`,
      })
    } catch (error: any) {
      console.error("Failed to update user status:", error)
      toast({
        title: "Update Failed",
        description: error.message || "Unable to update user status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRefresh = () => {
    loadUsers(true)
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
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
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 backdrop-blur-sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Link href="/enroll">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </Link>
            </div>
          </motion.div>

          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <StatsCards users={users} />
            </motion.div>

            {/* Main Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-800">User Management</CardTitle>
                  <CardDescription className="text-lg text-slate-600">
                    Manage enrolled users and their facial recognition data ({users.length} total users)
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Search Bar */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative mb-8"
                  >
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      placeholder="Search users by name, email, employee ID, or department..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-12 text-lg bg-white/60 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                  </motion.div>

                  {/* User Grid */}
                  {isLoading ? (
                    <LoadingSkeleton count={6} />
                  ) : (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    >
                      {filteredUsers.map((user, index) => (
                        <motion.div key={user.id} variants={itemVariants}>
                          <UserCard user={user} onDelete={handleDeleteUser} onToggleStatus={handleToggleStatus} />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {filteredUsers.length === 0 && !isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                      <div className="text-slate-500 mb-6 text-lg">
                        {searchTerm ? "No users found matching your search" : "No users enrolled yet"}
                      </div>
                      <Button
                        asChild
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        <Link href="/enroll">
                          <Plus className="w-4 h-4 mr-2" />
                          Enroll First User
                        </Link>
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
