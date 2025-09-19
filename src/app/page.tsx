"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from '@/types';
import useAuthStore from '@/store/authStore';
import { useNewfeedPosts } from '@/hooks';
import { useSocket } from '@/hooks/useSocket';
import Colors from '@/constants/color';
import TextStyles from '@/constants/textStyle';
import { Button } from '@/components/ui/button';
import CreatePost from '@/components/posts/CreatePost';
import PostCard from '@/components/posts/PostCard';
import { 
  RefreshCw, 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal, 
  Globe, 
  Users, 
  Lock,
  Search,
  Bell,
  User,
  Home,
  Settings,
  Plus,
  TrendingUp,
  LogOut
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

export default function HomePage() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();
    const userID = user?._id;
    const { data, isLoading, error, refetch } = useNewfeedPosts(userID);
    const socket = useSocket();
    const [posts, setPosts] = useState<Post[]>([]);
    const [showCreatePost, setShowCreatePost] = useState(false);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (data) {
            setPosts(data.data);
        }
    }, [data]);

    useEffect(() => {
        if (!socket) return;

        const handleNewPost = (data: { post: Post }) => {
            setPosts(prev => [data.post, ...(prev || [])]);
        };

        const handlePostUpdate = (data: { post: Post }) => {
            setPosts(prev => (prev || []).map(p => p._id === data.post._id ? data.post : p));
        };

        const handlePostDelete = (data: { postID: string }) => {
            setPosts(prev => (prev || []).filter(p => p._id !== data.postID));
        };

        socket.on('emitAddPost', handleNewPost);
        socket.on('emitEditPost', handlePostUpdate);
        socket.on('emitRemovePost', handlePostDelete);

        return () => {
            socket.off('emitAddPost', handleNewPost);
            socket.off('emitEditPost', handlePostUpdate);
            socket.off('emitRemovePost', handlePostDelete);
        };
    }, [socket]);

    const handleRefresh = async () => {
        await refetch();
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const handlePostCreated = () => {
        setShowCreatePost(false);
        refetch();
    };

    const handlePostUpdate = (updatedPost: Post) => {
        setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
    };

    const handlePostDelete = (postId: string) => {
        setPosts(prev => prev.filter(p => p._id !== postId));
    };

    const getScopeIcon = (scope: string) => {
        switch (scope) {
            case 'PUBLIC':
                return <Globe size={16} />;
            case 'FRIEND':
                return <Users size={16} />;
            case 'PRIVATE':
                return <Lock size={16} />;
            default:
                return <Globe size={16} />;
        }
    };

    const getScopeText = (scope: string) => {
        switch (scope) {
            case 'PUBLIC':
                return 'Công khai';
            case 'FRIEND':
                return 'Bạn bè';
            case 'PRIVATE':
                return 'Riêng tư';
            default:
                return 'Công khai';
        }
    };

    if (!isAuthenticated) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: Colors.bgSecondary,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}>
                {/* Header */}
            <header style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                backgroundColor: Colors.bgPrimary,
                borderBottom: `1px solid ${Colors.borderPrimary}`,
                boxShadow: `0 2px 8px ${Colors.shadowLight}`
            }}>
                <div style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 20px"
                }}>
                    {/* Logo */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px"
                    }}>
                        <div style={{
                            width: "32px",
                            height: "32px",
                            backgroundColor: Colors.primary,
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: Colors.white,
                            fontWeight: "700",
                            fontSize: "16px"
                        }}>
                            S
                        </div>
                        <h1 style={{
                            ...TextStyles.headingMedium,
                            color: Colors.textPrimary,
                            margin: "0"
                        }}>
                            SocialWeb
                        </h1>
                    </div>

                    {/* Search Bar */}
                    <div style={{
                        flex: "1",
                        maxWidth: "400px",
                        margin: "0 20px",
                        position: "relative"
                    }}>
                        <div style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center"
                        }}>
                            <Search
                                size={20}
                                style={{
                                    position: "absolute",
                                    left: "12px",
                                    color: Colors.textSecondary
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                style={{
                                    width: "100%",
                                    padding: "10px 12px 10px 40px",
                                    border: `1px solid ${Colors.borderSecondary}`,
                                    borderRadius: "20px",
                                    backgroundColor: Colors.bgSecondary,
                                    fontSize: "14px",
                                    outline: "none",
                                    transition: "all 0.2s ease"
                                }}
                                onFocus={(e) => {
                                    (e.target as HTMLInputElement).style.borderColor = Colors.primary;
                                    (e.target as HTMLInputElement).style.backgroundColor = Colors.white;
                                }}
                                onBlur={(e) => {
                                    (e.target as HTMLInputElement).style.borderColor = Colors.borderSecondary;
                                    (e.target as HTMLInputElement).style.backgroundColor = Colors.bgSecondary;
                                }}
                            />
                        </div>
                    </div>

                    {/* Navigation Icons */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}>
                        <Button
                            variant="ghost"
                            size="icon"
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "20px"
                            }}
                        >
                            <Home size={20} color={Colors.textPrimary} />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "20px"
                            }}
                        >
                            <Users size={20} color={Colors.textSecondary} />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "20px"
                            }}
                        >
                            <MessageCircle size={20} color={Colors.textSecondary} />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "20px",
                                position: "relative"
                            }}
                        >
                            <Bell size={20} color={Colors.textSecondary} />
                            <div style={{
                                position: "absolute",
                                top: "8px",
                                right: "8px",
                                width: "8px",
                                height: "8px",
                                backgroundColor: Colors.danger,
                                borderRadius: "50%"
                            }}></div>
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "20px"
                            }}
                        >
                            <User size={20} color={Colors.textSecondary} />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLogout}
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "20px"
                            }}
                            title="Đăng xuất"
                        >
                            <LogOut size={20} color={Colors.textSecondary} />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div style={{
                maxWidth: "1200px",
                margin: "0 auto",
                display: "flex",
                gap: "20px",
                padding: "20px"
            }}>
                {/* Left Sidebar */}
                <aside style={{
                    width: "280px",
                    flexShrink: 0
                }}>
                    <div style={{
                        backgroundColor: Colors.bgPrimary,
                        borderRadius: "12px",
                        padding: "16px",
                        marginBottom: "20px",
                        boxShadow: `0 2px 4px ${Colors.shadowLight}`
                    }}>
                        <h3 style={{
                            ...TextStyles.headingSmall,
                            color: Colors.textPrimary,
                            margin: "0 0 12px 0"
                        }}>
                            Menu
                        </h3>

                        <nav>
                            {[
                                { id: 'home', label: 'Trang chủ', icon: Home, active: true },
                                { id: 'friends', label: 'Bạn bè', icon: Users },
                                { id: 'messages', label: 'Tin nhắn', icon: MessageCircle },
                                { id: 'notifications', label: 'Thông báo', icon: Bell },
                                { id: 'settings', label: 'Cài đặt', icon: Settings },
                                { id: 'logout', label: 'Đăng xuất', icon: LogOut, onClick: handleLogout }
                            ].map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={item.onClick || (() => {})}
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "12px",
                                            padding: "10px 12px",
                                            border: "none",
                                            backgroundColor: item.active ? Colors.bgSecondary : "transparent",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                            marginBottom: "4px",
                                            color: item.id === 'logout' ? Colors.danger : 'inherit'
                                        }}
                                        onMouseEnter={(e) => {
                                            const button = e.target as HTMLButtonElement;
                                            button.style.backgroundColor = Colors.bgSecondary;
                                        }}
                                        onMouseLeave={(e) => {
                                            const button = e.target as HTMLButtonElement;
                                            button.style.backgroundColor = "transparent";
                                        }}
                                    >
                                        <IconComponent
                                            size={20}
                                            color={item.id === 'logout' ? Colors.danger : (item.active ? Colors.primary : Colors.textSecondary)}
                                        />
                                        <span style={{
                                            fontSize: "14px",
                                            fontWeight: item.active ? "600" : "400",
                                            color: item.id === 'logout' ? Colors.danger : (item.active ? Colors.primary : Colors.textPrimary)
                                        }}>
                                            {item.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Trending Topics */}
                    <div style={{
                        backgroundColor: Colors.bgPrimary,
                        borderRadius: "12px",
                        padding: "16px",
                        boxShadow: `0 2px 4px ${Colors.shadowLight}`
                    }}>
                        <h3 style={{
                            ...TextStyles.headingSmall,
                            color: Colors.textPrimary,
                            margin: "0 0 12px 0"
                        }}>
                            Xu hướng
                        </h3>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <div style={{
                                textAlign: "center",
                                padding: "20px",
                                color: Colors.textSecondary,
                                fontSize: "14px"
                            }}>
                                Chưa có xu hướng nào
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Feed */}
                <main style={{
                    flex: "1",
                    maxWidth: "680px"
                }}>
                    {/* Create Post */}
                    {showCreatePost ? (
                        <CreatePost onPostCreated={handlePostCreated} />
                    ) : (
                        <div style={{
                            backgroundColor: Colors.bgPrimary,
                            borderRadius: "12px",
                            padding: "16px",
                            marginBottom: "20px",
                            boxShadow: `0 2px 4px ${Colors.shadowLight}`,
                            cursor: "pointer"
                        }}
                        onClick={() => setShowCreatePost(true)}
                        >
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px"
                            }}>
                                <div style={{
                                    width: "40px",
                                    height: "40px",
                                    backgroundColor: Colors.bgSecondary,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <Plus size={20} color={Colors.textSecondary} />
                                </div>
                                <span style={{
                                    ...TextStyles.bodyMedium,
                                    color: Colors.textSecondary
                                }}>
                                    Bạn đang nghĩ gì?
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Posts Feed */}
                    <div style={{ marginTop: "20px" }}>
                        {/* Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px'
                        }}>
                            <h2 style={{
                                ...TextStyles.headingLarge,
                                color: Colors.textPrimary,
                                margin: "0"
                            }}>
                                Trang chủ
                            </h2>
                            <button
                                onClick={handleRefresh}
                                disabled={isLoading}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: Colors.primary,
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    opacity: isLoading ? 0.7 : 1,
                                    transition: "all 0.2s ease",
                                    fontSize: "14px",
                                    fontWeight: "500"
                                }}
                            >
                                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                                Làm mới
                            </button>
                </div>

                {/* Posts */}
                {isLoading ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '200px'
                    }}>
                        <RefreshCw size={24} className="animate-spin" />
                        <span style={{ marginLeft: '8px' }}>Đang tải...</span>
                    </div>
                ) : error ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: Colors.textSecondary
                    }}>
                        Có lỗi xảy ra khi tải dữ liệu
                    </div>
                ) : !posts || posts.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        backgroundColor: Colors.bgPrimary,
                        borderRadius: '12px',
                        boxShadow: `0 2px 4px ${Colors.shadowLight}`
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            backgroundColor: Colors.bgSecondary,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px'
                        }}>
                            <TrendingUp size={32} color={Colors.textSecondary} />
                        </div>
                        <h3 style={{
                            ...TextStyles.headingMedium,
                            color: Colors.textPrimary,
                            marginBottom: '8px'
                        }}>
                            Chưa có bài viết nào
                        </h3>
                        <p style={{
                            ...TextStyles.bodyMedium,
                            color: Colors.textSecondary,
                            marginBottom: '20px'
                        }}>
                            Hãy theo dõi bạn bè hoặc tạo bài viết đầu tiên!
                        </p>
                        <Button
                            variant="default"
                            onClick={() => setShowCreatePost(true)}
                        >
                            Tạo bài viết
                        </Button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {posts?.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                onUpdate={handlePostUpdate}
                                onDelete={handlePostDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
                </main>

                {/* Right Sidebar */}
                <aside style={{
                    width: "280px",
                    flexShrink: 0
                }}>
                    {/* Online Friends */}
                    <div style={{
                        backgroundColor: Colors.bgPrimary,
                        borderRadius: "12px",
                        padding: "16px",
                        boxShadow: `0 2px 4px ${Colors.shadowLight}`
                    }}>
                        <h3 style={{
                            ...TextStyles.headingSmall,
                            color: Colors.textPrimary,
                            margin: "0 0 12px 0"
                        }}>
                            Bạn bè đang online
                        </h3>

                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <div style={{
                                textAlign: "center",
                                padding: "20px",
                                color: Colors.textSecondary,
                                fontSize: "14px"
                            }}>
                                Chưa có bạn bè online
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Bottom Spacer */}
            <div style={{ height: "40px" }} />
        </div>
    );
}
