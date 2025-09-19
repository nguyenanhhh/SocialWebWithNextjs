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
            <div style={{ 
                display: 'flex', 
                minHeight: '100vh', 
                backgroundColor: Colors.bgSecondary,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ 
                        fontSize: '24px', 
                        fontWeight: 'bold', 
                        marginBottom: '16px',
                        color: Colors.textPrimary
                    }}>
                        Vui lòng đăng nhập
                    </h2>
                    <Link 
                        href="/login"
                        style={{
                            display: 'inline-block',
                            padding: '12px 24px',
                            backgroundColor: Colors.primary,
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            fontWeight: '500'
                        }}
                    >
                        Đăng nhập
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div style={{ 
            display: 'flex', 
            minHeight: '100vh', 
            backgroundColor: Colors.bgSecondary,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* Left Sidebar */}
            <aside style={{ 
                width: '280px', 
                backgroundColor: Colors.bgPrimary, 
                borderRight: `1px solid ${Colors.borderPrimary}`,
                position: 'fixed',
                height: '100vh',
                overflowY: 'auto',
                zIndex: 100
            }}>
                <div style={{ padding: '24px 20px' }}>
                    {/* Logo */}
                    <div style={{ 
                        marginBottom: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: Colors.white,
                            fontWeight: 'bold',
                            fontSize: '16px'
                        }}>
                            S
                        </div>
                        <span style={{ 
                            fontWeight: '700', 
                            fontSize: '20px', 
                            color: Colors.textPrimary,
                            letterSpacing: '-0.5px'
                        }}>
                            Social UTE
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <Link href="/" style={{ 
                            padding: '12px 16px', 
                            borderRadius: '8px', 
                            textDecoration: 'none', 
                            color: Colors.textPrimary, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '16px',
                            fontSize: '16px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease',
                            backgroundColor: 'transparent'
                        }}>
                            <Home size={24} />
                            Trang chủ
                        </Link>
                        <Link href="/search" style={{ 
                            padding: '12px 16px', 
                            borderRadius: '8px', 
                            textDecoration: 'none', 
                            color: Colors.textSecondary, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '16px',
                            fontSize: '16px',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                        }}>
                            <Search size={24} />
                            Khám phá
                        </Link>
                        <Link href="/messages" style={{ 
                            padding: '12px 16px', 
                            borderRadius: '8px', 
                            textDecoration: 'none', 
                            color: Colors.textSecondary, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '16px',
                            fontSize: '16px',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                        }}>
                            <MessageCircle size={24} />
                            Tin nhắn
                        </Link>
                        <Link href="/notifications" style={{ 
                            padding: '12px 16px', 
                            borderRadius: '8px', 
                            textDecoration: 'none', 
                            color: Colors.textSecondary, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '16px',
                            fontSize: '16px',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                        }}>
                            <Heart size={24} />
                            Thông báo
                        </Link>
                        <Link href="/users" style={{ 
                            padding: '12px 16px', 
                            borderRadius: '8px', 
                            textDecoration: 'none', 
                            color: Colors.textSecondary, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '16px',
                            fontSize: '16px',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                        }}>
                            <Users size={24} />
                            Người dùng
                        </Link>
                        <Link href="/groups" style={{ 
                            padding: '12px 16px', 
                            borderRadius: '8px', 
                            textDecoration: 'none', 
                            color: Colors.textSecondary, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '16px',
                            fontSize: '16px',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                        }}>
                            <Building2 size={24} />
                            Nhóm
                        </Link>
                        <Link href="/friends" style={{ 
                            padding: '12px 16px', 
                            borderRadius: '8px', 
                            textDecoration: 'none', 
                            color: Colors.textSecondary, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '16px',
                            fontSize: '16px',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                        }}>
                            <UserPlus size={24} />
                            Bạn bè
                        </Link>
                        <Link href="/profile" style={{ 
                            padding: '12px 16px', 
                            borderRadius: '8px', 
                            textDecoration: 'none', 
                            color: Colors.textSecondary, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '16px',
                            fontSize: '16px',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                        }}>
                            <User size={24} />
                            Hồ sơ
                        </Link>
                    </nav>

                    {/* Create Post Button */}
                    <div style={{ marginTop: '24px' }}>
                        <button style={{
                            width: '100%',
                            padding: '12px 16px',
                            backgroundColor: Colors.primary,
                            color: Colors.white,
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}>
                            <Plus size={20} />
                            Tạo bài viết
                        </button>
                    </div>

                    {/* User Profile Section */}
                    <div style={{ 
                        marginTop: 'auto', 
                        paddingTop: '24px',
                        borderTop: `1px solid ${Colors.borderPrimary}`
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            borderRadius: '8px',
                            backgroundColor: Colors.bgSecondary,
                            marginBottom: '12px'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: Colors.primary,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '16px'
                            }}>
                                {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: Colors.textPrimary,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {user?.userName || 'User'}
                                </div>
                                <div style={{
                                    fontSize: '12px',
                                    color: Colors.textSecondary,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {user?.email || ''}
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleLogout}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                backgroundColor: 'transparent',
                                color: Colors.textSecondary,
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <LogOut size={18} />
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div style={{ 
                flex: 1, 
                marginLeft: '280px',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <div style={{ 
                    width: '100%', 
                    maxWidth: '614px',
                    backgroundColor: Colors.bgPrimary,
                    minHeight: '100vh'
                }}>
                    {children}
                </div>
            </div>
        </div>
    )
}


