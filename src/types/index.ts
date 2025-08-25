export interface User {
  id: string
  userName: string
  email?: string
  avatar?: string
  createdAt?: string
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}
