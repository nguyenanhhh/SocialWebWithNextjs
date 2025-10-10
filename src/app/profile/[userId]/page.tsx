"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { User, Post } from '@/types';
import { userApi, postsApi } from '@/lib/api';
import useAuthStore from '@/store/authStore';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/posts/PostCard';
import FriendButton from '@/components/friends/FriendButton';
import { 
  ArrowLeft, 
  Settings, 
  MessageCircle, 
  UserPlus, 
  Users,
  Calendar,
  MapPin,
  Link as LinkIcon,
  User as UserIcon
} from 'lucide-react';

export default function ProfilePage() {
    const params = useParams();
    const { user: currentUser } = useAuthStore();
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = params?.userId;
        if (userId) {
            loadProfileData(userId as string);
        }
    }, [params?.userId]);

    const loadProfileData = async (userId: string) => {
        try {
            setLoading(true);
            const [userResponse, postsResponse] = await Promise.all([
                userApi.getUser(userId),
                postsApi.getUserPosts({ userId })
            ]);
            
            setProfileUser(userResponse.data.data);
            setPosts(postsResponse.data.data || []);
        } catch (error) {
            console.error('Failed to load profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (!profileUser) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy người dùng</h1>
                    <p className="text-gray-600">Người dùng này có thể không tồn tại hoặc đã bị xóa.</p>
                </div>
            </div>
        );
    }

    const isOwnProfile = currentUser?._id === profileUser._id;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-sm">
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                    
                    <div className="px-6 pb-6">
                        <div className="flex items-end -mt-16 mb-4">
                            <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                <UserIcon size={48} className="text-gray-400" />
                            </div>
                            
                            <div className="ml-6 flex-1">
                                <h1 className="text-2xl font-bold text-gray-900">{profileUser.userName}</h1>
                                <p className="text-gray-600">{profileUser.email}</p>
                                
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={16} />
                                        <span>Tham gia {new Date(profileUser.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                {!isOwnProfile && (
                                    <>
                                        <FriendButton 
                                            friendId={profileUser._id} 
                                            size="md"
                                            showMenu={true}
                                        />
                                        
                                        <Button variant="outline" className="flex items-center gap-2 bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 rounded-lg px-4 py-2 font-medium transition-colors">
                                            <MessageCircle size={16} />
                                            Nhắn tin
                                        </Button>
                                    </>
                                )}
                                
                                {isOwnProfile && (
                                    <Button variant="outline" className="flex items-center gap-2 bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 rounded-lg px-4 py-2 font-medium transition-colors">
                                        <Settings size={16} />
                                        Chỉnh sửa
                                    </Button>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex gap-8 text-sm">
                            <div className="text-center">
                                <div className="font-semibold text-gray-900">{posts.length}</div>
                                <div className="text-gray-600">Bài viết</div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-gray-900">0</div>
                                <div className="text-gray-600">Bạn bè</div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-gray-900">0</div>
                                <div className="text-gray-600">Theo dõi</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Bài viết</h2>
                    
                    {posts.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Chưa có bài viết nào
                            </h3>
                            <p className="text-gray-500">
                                {isOwnProfile ? "Hãy tạo bài viết đầu tiên!" : "Người dùng này chưa có bài viết nào."}
                            </p>
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
            </div>
        </div>
    );
}
