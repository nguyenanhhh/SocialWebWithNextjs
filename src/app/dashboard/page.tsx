"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import AppLayout from '@/components/layout/AppLayout'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Dashboard
        </h1>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            Chào mừng, {user?.userName}!
          </h2>
          
          <p className="text-gray-600 mb-4">
            Email: {user?.email}
          </p>
          
          <div className="flex gap-4 mt-6">
            <div className="p-4 bg-gray-100 rounded-lg flex-1">
              <h3 className="text-base font-semibold mb-2 text-gray-700">
                Bạn bè
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {user?.followerNum || 0}
              </p>
            </div>
            
            <div className="p-4 bg-gray-100 rounded-lg flex-1">
              <h3 className="text-base font-semibold mb-2 text-gray-700">
                Đang theo dõi
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {user?.followingNum || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
