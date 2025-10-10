"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { Post } from '@/types';
import useAuthStore from '@/store/authStore';
import { useInfiniteNewfeed } from '@/hooks';
import { useSocket } from '@/hooks/useSocket';
import { Button } from '@/components/ui/button';
import CreatePost from '@/components/posts/CreatePost';
import PostCard from '@/components/posts/PostCard';
import { 
  RefreshCw, 
  Search,
  Bell,
  User,
  Home,
  Users,
  MessageCircle,
  Settings,
  Plus,
  TrendingUp,
  LogOut,
  Loader2
} from 'lucide-react';

export default function HomePage() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();
    const userID = user?._id;
    const { 
        data, 
        isLoading, 
        error, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage
    } = useInfiniteNewfeed(userID);
    const socket = useSocket();
    const [posts, setPosts] = useState<Post[]>([]);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const { ref: loadMoreRef, inView } = useInView();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (data) {
            const allPosts = data.pages.flatMap(page => page.data || []);
            setPosts(allPosts);
        }
    }, [data]);

    useEffect(() => {
        if (inView && hasNextPage) fetchNextPage();
    }, [inView, hasNextPage, fetchNextPage]);

    useEffect(() => {
        if (!socket) return;

        const handleNewPost = (data: { post: Post }) => {
            setPosts(prev => prev.some(p => p._id === data.post._id) ? prev : [data.post, ...prev]);
        };

        const handlePostCreated = (data: Post) => {
            setPosts(prev => prev.some(p => p._id === data._id) ? prev : [data, ...prev]);
        };

        const handlePostUpdate = (data: { post: Post }) => {
            setPosts(prev => prev.map(p => p._id === data.post._id ? data.post : p));
        };

        const handlePostDelete = (data: { postID: string }) => {
            setPosts(prev => prev.filter(p => p._id !== data.postID));
        };

        socket.on('emitAddPost', handleNewPost);
        socket.on('postCreated', handlePostCreated);
        socket.on('emitEditPost', handlePostUpdate);
        socket.on('emitRemovePost', handlePostDelete);

        return () => {
            socket.off('emitAddPost', handleNewPost);
            socket.off('postCreated', handlePostCreated);
            socket.off('emitEditPost', handlePostUpdate);
            socket.off('emitRemovePost', handlePostDelete);
        };
    }, [socket]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const handlePostCreated = () => {
        setShowCreatePost(false);
    };

    const handlePostUpdate = (updatedPost: Post) => {
        if (!updatedPost?._id) return;
        setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
    };

    const handlePostDelete = (postId: string) => {
        setPosts(prev => prev.filter(p => p._id !== postId));
    };


    if (!isAuthenticated) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-base">
                            S
                        </div>
                        <h1 className="text-lg font-semibold text-gray-900 m-0">
                            SocialWeb
                        </h1>
                    </div>

                    <div className="flex-1 max-w-md mx-5 relative">
                        <div className="relative flex items-center">
                            <Search
                                size={20}
                                className="absolute left-3 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-full bg-gray-100 text-sm outline-none transition-all duration-200 focus:border-blue-600 focus:bg-white"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/')}
                            className="w-10 h-10 rounded-full"
                            title="Trang chủ"
                        >
                            <Home size={20} className="text-gray-900" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/friends')}
                            className="w-10 h-10 rounded-full"
                            title="Bạn bè"
                        >
                            <Users size={20} className="text-gray-500" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/chat')}
                            className="w-10 h-10 rounded-full"
                            title="Tin nhắn"
                        >
                            <MessageCircle size={20} className="text-gray-500" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/notifications')}
                            className="w-10 h-10 rounded-full relative"
                            title="Thông báo"
                        >
                            <Bell size={20} className="text-gray-500" />
                            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/profile/${user?._id}`)}
                            className="w-10 h-10 rounded-full"
                            title="Trang cá nhân"
                        >
                            <User size={20} className="text-gray-500" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleLogout}
                            className="w-10 h-10 rounded-full"
                            title="Đăng xuất"
                        >
                            <LogOut size={20} className="text-gray-500" />
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto flex gap-5 p-5">
                <aside className="w-70 flex-shrink-0">
                    <div className="bg-white rounded-xl p-4 mb-5 shadow-sm">
                        <h3 className="text-base font-semibold text-gray-900 mb-3 m-0">
                            Menu
                        </h3>

                        <nav>
                            {[
                                { id: 'home', label: 'Trang chủ', icon: Home, active: true, path: '/' },
                                { id: 'friends', label: 'Bạn bè', icon: Users, path: '/friends' },
                                { id: 'messages', label: 'Tin nhắn', icon: MessageCircle, path: '/chat' },
                                { id: 'notifications', label: 'Thông báo', icon: Bell, path: '/notifications' },
                                { id: 'settings', label: 'Cài đặt', icon: Settings, path: '/settings' },
                                { id: 'logout', label: 'Đăng xuất', icon: LogOut, onClick: handleLogout }
                            ].map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            if (item.onClick) {
                                                item.onClick();
                                            } else if (item.path) {
                                                router.push(item.path);
                                            }
                                        }}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 border-none rounded-lg cursor-pointer transition-all duration-200 mb-1 hover:bg-gray-100 ${
                                            item.active ? 'bg-gray-100' : 'bg-transparent'
                                        } ${item.id === 'logout' ? 'text-red-600' : ''}`}
                                    >
                                        <IconComponent
                                            size={20}
                                            className={item.id === 'logout' ? 'text-red-600' : (item.active ? 'text-blue-600' : 'text-gray-500')}
                                        />
                                        <span className={`text-sm ${
                                            item.active ? 'font-semibold text-blue-600' : 'font-normal text-gray-900'
                                        } ${item.id === 'logout' ? 'text-red-600' : ''}`}>
                                            {item.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <h3 className="text-base font-semibold text-gray-900 mb-3 m-0">
                            Xu hướng
                        </h3>

                        <div className="flex flex-col gap-2">
                            <div className="text-center py-5 text-gray-500 text-sm">
                                Chưa có xu hướng nào
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 max-w-2xl">
                    {showCreatePost ? (
                        <CreatePost onPostCreated={handlePostCreated} />
                    ) : (
                        <div 
                            className="bg-white rounded-xl p-4 mb-5 shadow-sm cursor-pointer"
                            onClick={() => setShowCreatePost(true)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Plus size={20} className="text-gray-500" />
                                </div>
                                <span className="text-sm text-gray-500">
                                    Bạn đang nghĩ gì?
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Posts Feed */}
                    <div className="mt-5">
                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 m-0">
                                Trang chủ
                            </h2>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center h-50">
                                <RefreshCw size={24} className="animate-spin" />
                                <span className="ml-2">Đang tải...</span>
                            </div>
                        ) : error ? (
                            <div className="text-center py-10 text-gray-500">
                                Có lỗi xảy ra khi tải dữ liệu
                            </div>
                        ) : !posts || posts.length === 0 ? (
                            <div className="text-center py-10 bg-white rounded-xl shadow-sm">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <TrendingUp size={32} className="text-gray-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Chưa có bài viết nào
                                </h3>
                                <p className="text-sm text-gray-500 mb-5">
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
                            <>
                                <div className="flex flex-col gap-4">
                                    {posts?.map((post) => (
                                        <PostCard
                                            key={post._id}
                                            post={post}
                                            onUpdate={handlePostUpdate}
                                            onDelete={handlePostDelete}
                                        />
                                    ))}
                                </div>

                                <div ref={loadMoreRef} className="flex justify-center py-4">
                                    {isFetchingNextPage ? (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Loader2 size={20} className="animate-spin" />
                                            <span className="text-sm">Đang tải...</span>
                                        </div>
                                    ) : !hasNextPage && posts.length > 0 ? (
                                        <div className="text-sm text-gray-500">Hết rồi!</div>
                                    ) : null}
                                </div>
                            </>
                        )}
                    </div>
                </main>

                <aside className="w-70 flex-shrink-0">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <h3 className="text-base font-semibold text-gray-900 mb-3 m-0">
                            Bạn bè đang online
                        </h3>

                        <div className="flex flex-col gap-3">
                            <div className="text-center py-5 text-gray-500 text-sm">
                                Chưa có bạn bè online
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            <div className="h-10" />
        </div>
    );
}
