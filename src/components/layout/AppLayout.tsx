"use client";
import Link from 'next/link'
import { ReactNode } from 'react'
import { 
    Home, 
    MessageCircle, 
    Users, 
    Building2, 
    UserPlus, 
    Bell, 
    Search, 
    User,
    Heart,
    Plus,
    LogOut
} from 'lucide-react'
import Colors from '@/constants/color'
import useAuthStore from '@/store/authStore'
import { useGoogleAuth } from '@/hooks/useGoogleAuth'

export default function AppLayout({ children }: { children: ReactNode }) {
    const { user, isAuthenticated } = useAuthStore()
    const { signOutGoogle } = useGoogleAuth()

    const handleLogout = () => {
        signOutGoogle()
    }

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-screen bg-gray-100 items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">
                        Vui lòng đăng nhập
                    </h2>
                    <Link 
                        href="/login"
                        className="inline-block px-6 py-3 bg-blue-600 text-white no-underline rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Đăng nhập
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {/* Left Sidebar */}
            <aside className="w-[280px] bg-white border-r border-gray-200 fixed h-screen overflow-y-auto z-[100]">
                <div className="p-6 px-5">
                    {/* Logo */}
                    <div className="mb-8 flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-lg flex items-center justify-center text-white font-bold text-base">
                            S
                        </div>
                        <span className="font-bold text-xl text-gray-900 tracking-tight">
                            Social UTE
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-1">
                        <Link href="/" className="px-4 py-3 rounded-lg no-underline text-gray-900 flex items-center gap-4 text-base font-semibold hover:bg-gray-100 transition-colors">
                            <Home size={24} />
                            Trang chủ
                        </Link>
                        <Link href="/search" className="px-4 py-3 rounded-lg no-underline text-gray-600 flex items-center gap-4 text-base font-medium hover:bg-gray-100 transition-colors">
                            <Search size={24} />
                            Khám phá
                        </Link>
                        <Link href="/messages" className="px-4 py-3 rounded-lg no-underline text-gray-600 flex items-center gap-4 text-base font-medium hover:bg-gray-100 transition-colors">
                            <MessageCircle size={24} />
                            Tin nhắn
                        </Link>
                        <Link href="/notifications" className="px-4 py-3 rounded-lg no-underline text-gray-600 flex items-center gap-4 text-base font-medium hover:bg-gray-100 transition-colors">
                            <Heart size={24} />
                            Thông báo
                        </Link>
                        <Link href="/users" className="px-4 py-3 rounded-lg no-underline text-gray-600 flex items-center gap-4 text-base font-medium hover:bg-gray-100 transition-colors">
                            <Users size={24} />
                            Người dùng
                        </Link>
                        <Link href="/groups" className="px-4 py-3 rounded-lg no-underline text-gray-600 flex items-center gap-4 text-base font-medium hover:bg-gray-100 transition-colors">
                            <Building2 size={24} />
                            Nhóm
                        </Link>
                        <Link href="/friends" className="px-4 py-3 rounded-lg no-underline text-gray-600 flex items-center gap-4 text-base font-medium hover:bg-gray-100 transition-colors">
                            <UserPlus size={24} />
                            Bạn bè
                        </Link>
                        <Link href="/profile" className="px-4 py-3 rounded-lg no-underline text-gray-600 flex items-center gap-4 text-base font-medium hover:bg-gray-100 transition-colors">
                            <User size={24} />
                            Hồ sơ
                        </Link>
                    </nav>

                    {/* Create Post Button */}
                    <div className="mt-6">
                        <button className="w-full px-4 py-3 bg-blue-600 text-white border-none rounded-lg text-base font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-700 transition-colors">
                            <Plus size={20} />
                            Tạo bài viết
                        </button>
                    </div>

                    {/* User Profile Section */}
                    <div className="mt-auto pt-6 border-t border-gray-200">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-base">
                                {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
                                    {user?.userName || 'User'}
                                </div>
                                <div className="text-xs text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
                                    {user?.email || ''}
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleLogout}
                            className="w-full px-4 py-3 bg-transparent text-gray-600 border-none rounded-lg text-sm font-medium flex items-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                            <LogOut size={18} />
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 ml-[280px] flex justify-center">
                <div className="w-full max-w-[614px] bg-white min-h-screen">
                    {children}
                </div>
            </div>
        </div>
    )
}


