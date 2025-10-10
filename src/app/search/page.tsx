"use client";
import { useState, useEffect } from 'react';
import { Post, User } from '@/types';
import { searchApi } from '@/lib/api';
import useAuthStore from '@/store/authStore';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/posts/PostCard';
import FriendButton from '@/components/friends/FriendButton';
import { 
  Search, 
  Users, 
  FileText, 
  X
} from 'lucide-react';

export default function SearchPage() {
    const { user } = useAuthStore();
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [posts, setPosts] = useState<Post[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim() || !user?._id) return;
        
        try {
            setLoading(true);
            const response: any = await searchApi.search({
                query,
                type: activeTab,
                userID: user._id
            });
            
            if (activeTab === 'all') {
                const data = response.data;
                setPosts(Array.isArray(data.posts?.data?.data) ? data.posts.data.data : []);
                setUsers(Array.isArray(data.users?.data?.data) ? data.users.data.data : []);
            } else if (activeTab === 'posts') {
                setPosts(Array.isArray(response.data?.data) ? response.data.data : []);
            } else if (activeTab === 'users') {
                setUsers(Array.isArray(response.data?.data) ? response.data.data : []);
            }
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const clearSearch = () => {
        setQuery('');
        setPosts([]);
        setUsers([]);
    };

    const tabs = [
        { id: 'all', label: 'Tất cả', icon: Search },
        { id: 'posts', label: 'Bài viết', icon: FileText },
        { id: 'users', label: 'Người dùng', icon: Users }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm bài viết, người dùng..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                            {query && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                        <Button 
                            onClick={handleSearch} 
                            disabled={!query.trim() || loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-lg px-6 py-2 font-medium transition-colors"
                        >
                            {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                        {tabs.map((tab) => {
                            const IconComponent = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <IconComponent size={16} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Đang tìm kiếm...</p>
                        </div>
                    ) : query ? (
                        <div className="space-y-6">
                            {(activeTab === 'all' || activeTab === 'posts') && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <FileText size={20} />
                                        Bài viết ({posts.length})
                                    </h3>
                                    {posts.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            Không tìm thấy bài viết nào
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {posts.map((post) => (
                                                <PostCard
                                                    key={post._id}
                                                    post={post}
                                                    onUpdate={() => {}}
                                                    onDelete={() => {}}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {(activeTab === 'all' || activeTab === 'users') && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Users size={20} />
                                        Người dùng ({users.length})
                                    </h3>
                                    {users.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            Không tìm thấy người dùng nào
                                        </div>
                                    ) : (
                                        <div className="grid gap-4">
                                            {users.map((user) => (
                                                <div key={user._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        {user.avatar ? (
                                                            <img 
                                                                src={user.avatar} 
                                                                alt={user.userName} 
                                                                className="w-12 h-12 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                                                <Users size={24} className="text-gray-500" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">{user.userName}</h4>
                                                            <p className="text-sm text-gray-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FriendButton 
                                                            friendId={user._id}
                                                            size="sm"
                                                        />
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => window.location.href = `/profile/${user._id}`}
                                                            className="flex items-center gap-1 bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 rounded-lg px-3 py-1 font-medium transition-colors"
                                                        >
                                                            Xem trang
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Search size={48} className="text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tìm kiếm gì đó</h3>
                            <p className="text-gray-500">Nhập từ khóa để tìm kiếm bài viết hoặc người dùng</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
