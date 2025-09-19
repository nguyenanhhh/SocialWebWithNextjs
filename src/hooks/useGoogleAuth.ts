import { useState } from 'react'
import { usersApi } from '@/api/users'
import useAuthStore from '@/store/authStore'
import { User } from '@/types'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login, logout } = useAuthStore()

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Đăng nhập với Google thật
      const result = await signInWithPopup(auth, googleProvider)
      const firebaseUser = result.user
      const idToken = await firebaseUser.getIdToken()

      // Tạo user data từ Firebase user thật
      const userData = {
        id: firebaseUser.uid,
        _id: firebaseUser.uid,
        name: firebaseUser.displayName || '',
        email: firebaseUser.email || '',
        photo: firebaseUser.photoURL || '',
        fcmToken: undefined
      }

      console.log('Sending user data to backend:', userData)
      console.log('Backend URL:', 'http://172.18.23.6:8080')

      try {
        // Gọi API create user từ backend
        const response = await usersApi.create(userData)
        console.log('Backend response:', response)

        if (response) {
          console.log('Raw backend response:', response)

          const user: User = {
            _id: (response as any)._id,
            userName: (response as any).userName,
            searchName: (response as any).searchName,
            email: (response as any).email,
            phone: (response as any).phone,
            avatar: (response as any).avatar,
            bio: (response as any).bio,
            background: (response as any).background,
            followerNum: (response as any).followerNum,
            followingNum: (response as any).followingNum,
            sex: (response as any).sex,
            age: (response as any).age,
            active: (response as any).active,
            fcmToken: (response as any).fcmToken,
            createdAt: (response as any).createdAt,
            updatedAt: (response as any).updatedAt
          }

          console.log('Mapped user object:', user)
          console.log('User _id:', user._id)

          // Lưu vào store với Firebase token
          login(user, idToken)

          return { success: true, user }
        }
      } catch (apiError: any) {
        console.error('API Error:', apiError)

        // Nếu backend không hoạt động, tạo user từ Firebase data
        console.log('Backend unavailable, using Firebase user data')

        const userFromFirebase: User = {
          _id: firebaseUser.uid,
          userName: firebaseUser.displayName || '',
          searchName: (firebaseUser.displayName || '').toLowerCase(),
          email: firebaseUser.email || '',
          phone: '',
          avatar: firebaseUser.photoURL || '',
          bio: '',
          background: '',
          followerNum: 0,
          followingNum: 0,
          sex: false,
          age: 0,
          active: true,
          fcmToken: undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        login(userFromFirebase, idToken)

        return { success: true, user: userFromFirebase }
      }
    } catch (err: any) {
      console.error('Google sign in error:', err)
      setError(err.message || 'Đăng nhập thất bại')
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }

  const signOutGoogle = async () => {
    try {
      await auth.signOut()
      logout()
    } catch (err: any) {
      console.error('Sign out error:', err)
      setError(err.message || 'Đăng xuất thất bại')
    }
  }

  return {
    signInWithGoogle,
    signOutGoogle,
    isLoading,
    error
  }
}