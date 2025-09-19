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
      <div style={{ padding: '24px' }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '16px',
          color: '#1f2937'
        }}>
          Dashboard
        </h1>
        
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '12px',
            color: '#374151'
          }}>
            Chào mừng, {user?.userName}!
          </h2>
          
          <p style={{ 
            color: '#6b7280',
            marginBottom: '16px'
          }}>
            Email: {user?.email}
          </p>
          
          <div style={{
            display: 'flex',
            gap: '16px',
            marginTop: '24px'
          }}>
            <div style={{
              padding: '16px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              flex: 1
            }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600',
                marginBottom: '8px',
                color: '#374151'
              }}>
                Bạn bè
              </h3>
              <p style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: '#059669'
              }}>
                {user?.followerNum || 0}
              </p>
            </div>
            
            <div style={{
              padding: '16px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              flex: 1
            }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600',
                marginBottom: '8px',
                color: '#374151'
              }}>
                Đang theo dõi
              </h3>
              <p style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: '#059669'
              }}>
                {user?.followingNum || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
