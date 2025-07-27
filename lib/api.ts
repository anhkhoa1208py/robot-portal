const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Validate API base URL on module load
if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  console.warn('NEXT_PUBLIC_API_BASE_URL is not set in environment variables. Using default URL.')
}

// API Response Types
export interface FaceData {
  confidence: number
  bounding_box: {
    Width: number
    Height: number
    Left: number
    Top: number
  }
  landmarks: number
  pose: {
    Roll: number
    Yaw: number
    Pitch: number
  }
  quality: {
    Brightness: number
    Sharpness: number
  }
  age_range: {
    Low: number
    High: number
  }
  smile: boolean
  emotions: Array<{
    Type: string
    Confidence: number
  }>
}

export interface DetectFaceResponse {
  success: boolean
  message: string
  faces_detected: number
  faces: FaceData[]
  recommendations: string[]
}

export interface EnrollResponse {
  success: boolean
  message: string
  user_id: number
  face_id: string
}

export interface DeleteUserResponse {
  success: boolean
  message: string
}

export interface User {
  id: number
  cccd_number: string
  full_name: string
  gender: string
  birth_date: string
  permanent_address: string
  image_url?: string
  created_at: string
  updated_at: string
  // Computed fields for UI compatibility
  employee_id?: string
  position?: string
  notes?: string
  enrollment_date?: string
  status?: string
  last_access?: string
}

export interface GetUsersResponse {
  success: boolean
  users: User[]
  count: number
}

// API Functions
export class FaceRecognitionAPI {
  private static async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw error
    }
  }

  // Detect face in uploaded image
  static async detectFace(imageFile: File): Promise<DetectFaceResponse> {
    const formData = new FormData()
    formData.append("image", imageFile)

    try {
      const response = await fetch(`${API_BASE_URL}/api/detect-faces`, {
        method: "POST",
        headers: {
          'Accept': 'application/json'
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Face detection failed:", error)
      throw error
    }
  }

  // Enroll a new user with face data
  static async enrollUser(userData: {
    cccd_number: string
    full_name: string
    gender: string
    birth_date: string
    permanent_address: string
    image: File
  }): Promise<EnrollResponse> {
    const formData = new FormData()

    // Append user data - matching the new backend structure
    formData.append("cccd_number", userData.cccd_number)
    formData.append("full_name", userData.full_name)
    formData.append("gender", userData.gender)
    formData.append("birth_date", userData.birth_date)
    formData.append("permanent_address", userData.permanent_address)
    formData.append("image", userData.image)

    try {
      const response = await fetch(`${API_BASE_URL}/api/enroll`, {
        method: "POST",
        headers: {
          'Accept': 'application/json'
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("User enrollment failed:", error)
      throw error
    }
  }

  // Get list of all enrolled users - exactly like curl command
  static async getUsers(): Promise<GetUsersResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Transform users to add computed fields for UI compatibility
      const transformedUsers = data.users.map((user: any) => ({
        ...user,
        employee_id: user.id.toString(), // Use ID as employee_id for compatibility
        enrollment_date: user.created_at.split("T")[0], // Extract date part
        status: "active", // Default status since API doesn't provide it
      }))

      return {
        success: data.success,
        users: transformedUsers,
        count: data.count,
      }
    } catch (error) {
      console.error("API request failed for getUsers:", error)
      throw error
    }
  }

  // Delete a user by ID
  static async deleteUser(userId: string): Promise<DeleteUserResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Failed to delete user:", error)
      throw error
    }
  }

  // Update user status
  static async updateUserStatus(
    userId: string,
    status: "active" | "inactive",
  ): Promise<{
    success: boolean
    message: string
  }> {
    return this.makeRequest(`/api/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  }

  // Get user details by ID
  static async getUserById(userId: string): Promise<{
    success: boolean
    user: User
  }> {
    return this.makeRequest(`/api/users/${userId}`, {
      method: "GET",
    })
  }
}
