"use client";
import { useState, useEffect } from 'react';
import { Post } from '@/types';
import { postsApi } from '@/api/posts';
import useAuthStore from '@/store/authStore';
import { getSocket, socketEvents } from '@/socket/client';
import { Button } from '@/components/ui/button';
import Colors from '@/constants/color';
import TextStyles from '@/constants/textStyle';
import PostCard from '@/components/posts/PostCard';
import CreatePost from '@/components/posts/CreatePost';
import { 
  RefreshCw, 
  TrendingUp, 
  Search, 
  MessageCircle, 
  Bell, 
  User, 
  Home, 
  Users, 
  Settings,
  Heart,
  Share2,
  MoreHorizontal,
  Camera,
  Image,
  Smile,
  MapPin,
  Globe,
  Lock,
  UserPlus,
  Plus
} from 'lucide-react';

export default function FeedPage() {
    const { user, isAuthenticated } = useAuthStore();
    const [posts, setPosts] = useState<Post[]>([]);
    
    // Debug posts state
    console.log('FeedPage - Current posts state:', {
        postsLength: posts.length,
        posts: posts.map(p => ({ id: p._id, content: p.content?.substring(0, 50) }))
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [activeTab, setActiveTab] = useState('home');
    const [showCreatePost, setShowCreatePost] = useState(false);

    useEffect(() => {
        console.log('Feed useEffect - isAuthenticated:', isAuthenticated, 'user:', user);
        console.log('User ID from store:', user?._id);
        console.log('User object keys:', user ? Object.keys(user) : 'No user');
        console.log('Auth token:', localStorage.getItem('authToken'));
        console.log('LocalStorage auth data:', localStorage.getItem('auth-storage'));
        
        if (!isAuthenticated || !user?._id) {
            console.log('Feed useEffect - not authenticated or no user ID, skipping');
            console.log('isAuthenticated:', isAuthenticated);
            console.log('user._id:', user?._id);
            return;
        }

        console.log('Feed useEffect - calling loadPosts for user:', user._id);
        console.log('About to call loadPosts with userID:', user._id);
        loadPosts(user._id);
        
        // Setup socket listeners for real-time updates
        const socket = getSocket();
        
        // Kết nối socket nếu chưa connected
        if (!socket.connected) {
            console.log('Feed - Connecting socket for user:', user._id);
            socketEvents.connect(user._id);
        } else {
            console.log('Feed - Socket already connected:', socket.id);
        }
        
        const handleNewPost = (data: { post: Post }) => {
            console.log('Received new post via socket:', data);
            setPosts(prev => {
                const updated = [data.post, ...(prev || [])];
                console.log('Posts updated, new count:', updated.length);
                return updated;
            });
        };

        const handlePostUpdate = (data: { post: Post }) => {
            setPosts(prev => prev.map(p => p._id === data.post._id ? data.post : p));
        };

        const handlePostDelete = (data: { postID: string }) => {
            setPosts(prev => prev.filter(p => p._id !== data.postID));
        };

        console.log('Setting up socket listeners...');
        console.log('Socket connected:', socket.connected);
        console.log('Socket ID:', socket.id);
        
        // Sửa event name để match với backend
        socket.on('emitAddPost', handleNewPost);
        socket.on('emitEditPost', handlePostUpdate);
        socket.on('emitRemovePost', handlePostDelete);
        
        console.log('Socket listeners registered');

        return () => {
            console.log('Cleaning up socket listeners...');
            socket.off('emitAddPost', handleNewPost);
            socket.off('emitEditPost', handlePostUpdate);
            socket.off('emitRemovePost', handlePostDelete);
            console.log('Socket listeners cleaned up');
        };
    }, [isAuthenticated, user?._id]);

    const loadPosts = async (userId?: string) => {
        const userID = userId || user?._id;
        console.log('loadPosts called, user:', user);
        console.log('loadPosts userID:', userID);
        
        if (!userID) {
            console.log('No user ID, skipping loadPosts');
            return;
        }
        try {
            setLoading(true);
            console.log('Loading posts for user:', userID);
            console.log('API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
            console.log('Making API call to:', `/post/newfeed/${userID}`);
            
            const response = await postsApi.getNewfeed(userID);
            console.log('Posts API response:', response);
            console.log('Response type:', typeof response);
            console.log('Response keys:', Object.keys(response || {}));
            console.log('Response length:', Array.isArray(response) ? response.length : 'Not an array');
            console.log('Full response object:', JSON.stringify(response, null, 2));
           
            const posts = Array.isArray(response) ? response : (response?.data || []);
            console.log('Processed posts:', posts);
            console.log('Posts count:', posts.length);
            console.log('Posts type:', typeof posts);
            console.log('Is array:', Array.isArray(posts));
            
            if (posts.length > 0) {
                console.log('First post sample:', {
                    id: posts[0]._id,
                    content: posts[0].content?.substring(0, 50),
                    userName: posts[0].userName
                });
            }
            
            console.log('Setting posts state...');
            setPosts(posts);
            console.log('Posts state set successfully');
        } catch (error: any) {
            console.error('Failed to load posts:', error);
            console.error('Error details:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            setPosts([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadPosts();
    };

    const handlePostCreated = () => {
        setShowCreatePost(false);
        handleRefresh();
    };

    const handlePostUpdate = (updatedPost: Post) => {
        setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
    };

    const handlePostDelete = (postId: string) => {
        setPosts(prev => prev.filter(p => p._id !== postId));
    };

    const handleLoadMore = async () => {
        if (loading || !hasMore) return;
        
        try {
            setLoading(true);
            const nextPage = page + 1;
            const response = await postsApi.getUserPosts({
                userId: user?._id,
                page: nextPage,
                limit: 10
            });
            
            // Response đã là dữ liệu trực tiếp từ backend (do http interceptor)
            if (response.data && response.data.data && response.data.data.length > 0) {
                setPosts(prev => [...prev, ...response.data.data]);
                setPage(nextPage);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Failed to load more posts:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Vui lòng đăng nhập</h1>
                    <p className="text-gray-600">Bạn cần đăng nhập để xem feed</p>
                </div>
            </div>
        );
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
                                    { id: 'settings', label: 'Cài đặt', icon: Settings }
                                ].map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
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
                                                marginBottom: "4px"
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
                                                color={item.active ? Colors.primary : Colors.textSecondary}
                                            />
                                            <span style={{
                                                fontSize: "14px",
                                                fontWeight: item.active ? "600" : "400",
                                                color: item.active ? Colors.primary : Colors.textPrimary
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
                                {/* TODO: Lấy trending topics từ API */}
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
                            <CreatePost 
                                onPostCreated={handlePostCreated} 
                                onPostCreatedImmediate={(newPost) => {
                                    console.log('onPostCreatedImmediate called with:', newPost);
                                    console.log('Current posts before update:', posts.length);
                                    setPosts(prev => {
                                        const updated = [newPost, ...(prev || [])];
                                        console.log('Posts after update:', updated.length);
                                        return updated;
                                    });
                                }}
                            />
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
                            {loading && posts.length === 0 ? (
                                <div style={{
                                    textAlign: "center",
                                    padding: "40px",
                                    color: Colors.textSecondary,
                                    backgroundColor: Colors.bgPrimary,
                                    borderRadius: "12px",
                                    boxShadow: `0 2px 4px ${Colors.shadowLight}`
                                }}>
                                    <RefreshCw size={32} style={{ animation: "spin 1s linear infinite" }} />
                                    <p style={{ marginTop: "16px", ...TextStyles.bodyMedium }}>
                                        Đang tải bài viết...
                                    </p>
                                </div>
                            ) : posts.length === 0 ? (
                                <div style={{
                                    textAlign: "center",
                                    padding: "40px",
                                    backgroundColor: Colors.bgPrimary,
                                    borderRadius: "12px",
                                    boxShadow: `0 2px 4px ${Colors.shadowLight}`
                                }}>
                                    <div style={{
                                        width: "64px",
                                        height: "64px",
                                        backgroundColor: Colors.bgSecondary,
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 16px"
                                    }}>
                                        <TrendingUp size={32} color={Colors.textSecondary} />
                                    </div>

                                    <h3 style={{
                                        ...TextStyles.headingMedium,
                                        color: Colors.textPrimary,
                                        marginBottom: "8px"
                                    }}>
                                        Chưa có bài viết nào
                                    </h3>

                                    <p style={{
                                        ...TextStyles.bodyMedium,
                                        color: Colors.textSecondary,
                                        marginBottom: "20px"
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
                                <div>
                                    {posts.map((post) => (
                                        <PostCard
                                            key={post._id}
                                            post={post}
                                            onUpdate={handlePostUpdate}
                                            onDelete={handlePostDelete}
                                        />
                                    ))}

                                    {/* Load More Button */}
                                    {hasMore && (
                                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                                            <Button
                                                variant="outline"
                                                onClick={handleLoadMore}
                                                disabled={!hasMore || loading}
                                            >
                                                {loading ? "Đang tải..." : "Tải thêm"}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </main>

                    {/* Right Sidebar */}
                    <aside style={{
                        width: "280px",
                        flexShrink: 0
                    }}>
                        {/* Quick Actions */}
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
                                Thao tác nhanh
                            </h3>

                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                <Button variant="outline" className="w-full">
                                    <Users size={16} style={{ marginRight: "8px" }} />
                                    Tìm bạn bè
                                </Button>

                                <Button variant="outline" className="w-full">
                                    <MessageCircle size={16} style={{ marginRight: "8px" }} />
                                    Nhắn tin
                                </Button>

                                <Button variant="outline" className="w-full">
                                    <Settings size={16} style={{ marginRight: "8px" }} />
                                    Cài đặt
                                </Button>
                            </div>
                        </div>

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
                                {/* TODO: Lấy danh sách bạn bè online từ API */}
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
