"use client";
import { useState } from 'react';
import { User } from '@/types';
import useAuthStore from '@/store/authStore';
import { Button } from '@/components/ui/button';
import Avatar from '@/components/ui/Avatar';
import { 
  Search, 
  UserPlus, 
  Users, 
  Check, 
  X,
  UserCheck,
  Clock,
  UserMinus,
  Ban
} from 'lucide-react';
import {
    useFriends,
    useFriendRequests,
    useFriendSuggestions,
    usePendingRequests,
    useAcceptFriendRequest,
    useRejectFriendRequest,
    useSendFriendRequest,
    useCancelFriendRequest,
    useUnfriend,
    useBlockUser
} from '@/hooks/useFriends';

export default function FriendsPage() {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const { data: friends = [], isLoading: loadingFriends } = useFriends(user?._id);
    const { data: friendRequests = [], isLoading: loadingRequests } = useFriendRequests(user?._id);
    const { data: suggestions = [], isLoading: loadingSuggestions } = useFriendSuggestions(user?._id);
    const { data: pendingRequests = [], isLoading: loadingPending } = usePendingRequests(user?._id);

    const acceptRequest = useAcceptFriendRequest();
    const rejectRequest = useRejectFriendRequest();
    const sendRequest = useSendFriendRequest();
    const cancelRequest = useCancelFriendRequest();
    const unfriend = useUnfriend();
    const blockUser = useBlockUser();

    const handleAcceptRequest = async (friendId: string) => {
        if (!user?._id) return;
        try {
            await acceptRequest.mutateAsync({ ownerID: user._id, userID: friendId });
        } catch (error) {
            console.error('Failed to accept friend request:', error);
        }
    };

    const handleRejectRequest = async (friendId: string) => {
        if (!user?._id) return;
        try {
            await rejectRequest.mutateAsync({ ownerID: user._id, userID: friendId });
        } catch (error) {
            console.error('Failed to reject friend request:', error);
        }
    };

    const handleSendRequest = async (friendId: string) => {
        if (!user?._id) return;
        try {
            await sendRequest.mutateAsync({ ownerID: user._id, userID: friendId });
        } catch (error) {
            console.error('Failed to send friend request:', error);
        }
    };

    const handleCancelRequest = async (friendId: string) => {
        if (!user?._id) return;
        try {
            await cancelRequest.mutateAsync({ ownerID: user._id, userID: friendId });
        } catch (error) {
            console.error('Failed to cancel request:', error);
        }
    };

    const handleUnfriend = async (friendId: string) => {
        if (!user?._id) return;
        try {
            await unfriend.mutateAsync({ ownerID: user._id, userID: friendId });
        } catch (error) {
            console.error('Failed to unfriend:', error);
        }
    };

    const handleBlock = async (friendId: string) => {
        if (!user?._id) return;
        try {
            await blockUser.mutateAsync({ ownerID: user._id, userID: friendId });
        } catch (error) {
            console.error('Failed to block user:', error);
        }
    };

    const filterUsers = (users: User[]) => {
        if (!Array.isArray(users)) return [];
        if (!searchTerm) return users;
        return users.filter(u => 
            u.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const tabs = [
        { id: 'all', label: 'Tất cả bạn bè', count: Array.isArray(friends) ? friends.length : 0 },
        { id: 'requests', label: 'Lời mời kết bạn', count: Array.isArray(friendRequests) ? friendRequests.length : 0 },
        { id: 'pending', label: 'Đã gửi', count: Array.isArray(pendingRequests) ? pendingRequests.length : 0 },
        { id: 'suggestions', label: 'Gợi ý', count: Array.isArray(suggestions) ? suggestions.length : 0 }
    ];

    const loading = loadingFriends || loadingRequests || loadingSuggestions || loadingPending;

    const filteredFriends = filterUsers(friends || []);
    const filteredRequests = filterUsers(friendRequests || []);
    const filteredPending = filterUsers(pendingRequests || []);
    const filteredSuggestions = filterUsers(suggestions || []);

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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Bạn bè</h1>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm bạn bè..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors w-64 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex space-x-1 mb-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {activeTab === 'all' && (
                            filteredFriends.length === 0 ? (
                                <div className="text-center py-12">
                                    <Users size={48} className="text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có bạn bè'}
                                    </h3>
                                    <p className="text-gray-500">
                                        {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Hãy kết bạn với mọi người để bắt đầu!'}
                                    </p>
                                </div>
                            ) : (
                                filteredFriends.map((friend) => (
                                    <div key={friend._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Avatar 
                                                src={friend.avatar} 
                                                alt={friend.userName} 
                                                size="md"
                                            />
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{friend.userName}</h3>
                                                <p className="text-sm text-gray-500">{friend.email}</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            Nhắn tin
                                        </Button>
                                    </div>
                                ))
                            )
                        )}

                        {activeTab === 'requests' && (
                            filteredRequests.length === 0 ? (
                                <div className="text-center py-12">
                                    <UserPlus size={48} className="text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {searchTerm ? 'Không tìm thấy kết quả' : 'Không có lời mời kết bạn'}
                                    </h3>
                                    <p className="text-gray-500">
                                        {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Bạn sẽ thấy lời mời kết bạn ở đây.'}
                                    </p>
                                </div>
                            ) : (
                                filteredRequests.map((request) => (
                                    <div key={request._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Avatar 
                                                src={request.avatar} 
                                                alt={request.userName} 
                                                size="md"
                                            />
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{request.userName}</h3>
                                                <p className="text-sm text-gray-500">{request.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="default" 
                                                size="sm"
                                                onClick={() => handleAcceptRequest(request._id)}
                                                disabled={acceptRequest.isPending}
                                                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-lg px-4 py-2 font-medium transition-colors"
                                            >
                                                <Check size={16} />
                                                Chấp nhận
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => handleRejectRequest(request._id)}
                                                disabled={rejectRequest.isPending}
                                                className="flex items-center gap-1 bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200 rounded-lg px-4 py-2 font-medium transition-colors"
                                            >
                                                <X size={16} />
                                                Từ chối
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )
                        )}

                        {activeTab === 'pending' && (
                            filteredPending.length === 0 ? (
                                <div className="text-center py-12">
                                    <Clock size={48} className="text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa gửi lời mời nào'}
                                    </h3>
                                    <p className="text-gray-500">
                                        {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Các lời mời kết bạn bạn đã gửi sẽ hiển thị ở đây.'}
                                    </p>
                                </div>
                            ) : (
                                filteredPending.map((pending) => (
                                    <div key={pending._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Avatar 
                                                src={pending.avatar} 
                                                alt={pending.userName} 
                                                size="md"
                                            />
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{pending.userName}</h3>
                                                <p className="text-sm text-gray-500">{pending.email}</p>
                                                <p className="text-xs text-gray-400 mt-1">Đang chờ phản hồi</p>
                                            </div>
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleCancelRequest(pending._id)}
                                            disabled={cancelRequest.isPending}
                                            className="flex items-center gap-1 bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200 rounded-lg px-4 py-2 font-medium transition-colors"
                                        >
                                            <X size={16} />
                                            Hủy yêu cầu
                                        </Button>
                                    </div>
                                ))
                            )
                        )}

                        {activeTab === 'suggestions' && (
                            filteredSuggestions.length === 0 ? (
                                <div className="text-center py-12">
                                    <Users size={48} className="text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {searchTerm ? 'Không tìm thấy kết quả' : 'Không có gợi ý'}
                                    </h3>
                                    <p className="text-gray-500">
                                        {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Chúng tôi sẽ gợi ý bạn bè cho bạn dựa trên sở thích.'}
                                    </p>
                                </div>
                            ) : (
                                filteredSuggestions.map((suggestion) => (
                                    <div key={suggestion._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Avatar 
                                                src={suggestion.avatar} 
                                                alt={suggestion.userName} 
                                                size="md"
                                            />
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{suggestion.userName}</h3>
                                                        <p className="text-sm text-gray-500">{suggestion.email}</p>
                                                    </div>
                                                </div>
                                                <Button 
                                                    variant="default" 
                                                    size="sm"
                                                    onClick={() => handleSendRequest(suggestion._id)}
                                                    disabled={sendRequest.isPending}
                                                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-lg px-4 py-2 font-medium transition-colors"
                                                >
                                                    <UserPlus size={16} />
                                                    Kết bạn
                                                </Button>
                                    </div>
                                ))
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
