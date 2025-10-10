"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import useAuthStore from '@/store/authStore'
import { Mail, Lock, Eye, EyeOff, Smartphone, Shield } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600"></div>

        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-300/20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-300/30 rounded-full blur-lg"></div>
        </div>

        <div className="relative z-10 w-full h-full flex flex-col justify-center items-center p-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="relative z-20">
                <div className="w-24 h-40 bg-white rounded-2xl shadow-2xl p-2 relative">
                  <div className="w-full h-full bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-3">
                    <div className="flex justify-between items-center mb-3">
                      <div className="w-12 h-1 bg-gray-300 rounded"></div>
                      <div className="w-4 h-2 bg-gray-300 rounded"></div>
                    </div>

                    <div className="space-y-2">
                      <div className="w-full h-6 bg-gray-300 rounded"></div>
                      <div className="w-3/4 h-3 bg-gray-300 rounded"></div>
                      <div className="w-full h-3 bg-gray-300 rounded"></div>
                      <div className="w-1/2 h-3 bg-gray-300 rounded"></div>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 flex justify-around">
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center shadow-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>

              <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center shadow-lg">
                <Smartphone className="w-4 h-4 text-white" />
              </div>

              <div className="absolute top-1/4 -left-8 w-6 h-6 bg-white/30 rounded-full"></div>
              <div className="absolute bottom-1/4 -right-10 w-4 h-4 bg-pink-300/40 rounded-full"></div>
            </div>
          </div>

          <div className="text-center mt-6 text-white max-w-sm">
            <h1 className="text-2xl font-bold mb-2 leading-tight">Social Media UTE</h1>
            <p className="text-base opacity-90 leading-relaxed">welcome</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Social Media UTE</h1>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to SOCIAL MEDIA UTE
              </h2>
            </div>

            <div className="space-y-6">
              <GoogleSignInButton
                onSuccess={() => router.push('/')}
                className="w-full"
              />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Remember me</span>
                </label>
                <a href="#" className="text-sm text-purple-600 hover:text-purple-500 font-medium">
                  Forgot Password?
                </a>
              </div>

              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                Login
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <a href="#" className="text-purple-600 hover:text-purple-500 font-medium">
                  Register
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
