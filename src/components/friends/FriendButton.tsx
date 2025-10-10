"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck, Clock, UserMinus, Ban, X } from 'lucide-react';
import {
    useFriendStatus,
    useSendFriendRequest,
    useAcceptFriendRequest,
    useRejectFriendRequest,
    useCancelFriendRequest,
    useUnfriend,
    useBlockUser,
    useUnblockUser
} from '@/hooks/useFriends';
import useAuthStore from '@/store/authStore';

interface FriendButtonProps {
    friendId: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'outline' | 'ghost';
    showMenu?: boolean; 
}

export default function FriendButton({ 
    friendId, 
    size = 'md', 
    variant = 'default',
    showMenu = false 
}: FriendButtonProps) {
    const { user } = useAuthStore();
    const [showDropdown, setShowDropdown] = useState(false);
    const { data: status = 'NONE', isLoading } = useFriendStatus(user?._id, friendId);
    
    const sendRequest = useSendFriendRequest();
    const acceptRequest = useAcceptFriendRequest();
    const rejectRequest = useRejectFriendRequest();
    const cancelRequest = useCancelFriendRequest();
    const unfriend = useUnfriend();
    const blockUser = useBlockUser();
    const unblockUser = useUnblockUser();

    if (!user || user._id === friendId) return null;

    const handlePrimaryAction = async () => {
        if (!user?._id) return;

        try {
            if (status === 'NONE') {
                await sendRequest.mutateAsync({ ownerID: user._id, userID: friendId });
            } else if (status === 'ACCEPTING') {
                await acceptRequest.mutateAsync({ ownerID: user._id, userID: friendId });
            } else if (status === 'PENDING') {
                await cancelRequest.mutateAsync({ ownerID: user._id, userID: friendId });
            } else if (status === 'FRIEND' || status === 'ACCEPTED') {
                if (showMenu) {
                    setShowDropdown(!showDropdown);
                }
            } else if (status === 'BLOCKED') {
                await unblockUser.mutateAsync({ ownerID: user._id, userID: friendId });
            }
        } catch (error) {
            console.error('Friend action failed:', error);
        }
    };

    const handleUnfriend = async () => {
        if (!user?._id) return;
        try {
            await unfriend.mutateAsync({ ownerID: user._id, userID: friendId });
            setShowDropdown(false);
        } catch (error) {
            console.error('Unfriend failed:', error);
        }
    };

    const handleBlock = async () => {
        if (!user?._id) return;
        try {
            await blockUser.mutateAsync({ ownerID: user._id, userID: friendId });
            setShowDropdown(false);
        } catch (error) {
            console.error('Block failed:', error);
        }
    };

    const handleReject = async () => {
        if (!user?._id) return;
        try {
            await rejectRequest.mutateAsync({ ownerID: user._id, userID: friendId });
        } catch (error) {
            console.error('Reject failed:', error);
        }
    };

    const getButtonConfig = () => {
        switch (status) {
            case 'FRIEND':
            case 'ACCEPTED':
                return {
                    icon: <UserCheck size={16} />,
                    text: 'Bạn bè',
                    variant: 'outline' as const,
                    className: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 rounded-lg px-4 py-2 font-medium transition-colors'
                };
            case 'PENDING':
                return {
                    icon: <Clock size={16} />,
                    text: 'Hủy yêu cầu',
                    variant: 'outline' as const,
                    className: 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200 rounded-lg px-4 py-2 font-medium transition-colors'
                };
            case 'ACCEPTING':
                return {
                    icon: <UserPlus size={16} />,
                    text: 'Chấp nhận',
                    variant: 'default' as const,
                    className: 'bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-4 py-2 font-medium transition-colors'
                };
            case 'BLOCKED':
                return {
                    icon: <Ban size={16} />,
                    text: 'Bỏ chặn',
                    variant: 'outline' as const,
                    className: 'bg-red-50 text-red-600 border-red-300 hover:bg-red-100 rounded-lg px-4 py-2 font-medium transition-colors'
                };
            default:
                return {
                    icon: <UserPlus size={16} />,
                    text: 'Kết bạn',
                    variant: variant,
                    className: 'bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-4 py-2 font-medium transition-colors'
                };
        }
    };

    const config = getButtonConfig();
    const isPending = sendRequest.isPending || acceptRequest.isPending || 
                      rejectRequest.isPending || cancelRequest.isPending || 
                      unfriend.isPending || blockUser.isPending || unblockUser.isPending;

    return (
        <div className="relative">
            <Button
                size={size}
                variant={config.variant}
                onClick={handlePrimaryAction}
                disabled={isLoading || isPending}
                className={`flex items-center gap-2 ${config.className}`}
            >
                {config.icon}
                {config.text}
            </Button>

            
            {status === 'ACCEPTING' && (
                <Button
                    size={size}
                    variant="outline"
                    onClick={handleReject}
                    disabled={isPending}
                    className="ml-2 bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200 rounded-lg px-4 py-2 font-medium transition-colors"
                >
                    <X size={16} />
                    Từ chối
                </Button>
            )}

            {showMenu && showDropdown && (status === 'FRIEND' || status === 'ACCEPTED') && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                        onClick={handleUnfriend}
                        disabled={isPending}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                    >
                        <UserMinus size={16} />
                        Hủy kết bạn
                    </button>
                    <button
                        onClick={handleBlock}
                        disabled={isPending}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                    >
                        <Ban size={16} />
                        Chặn người dùng
                    </button>
                </div>
            )}

          
            {showDropdown && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </div>
    );
}

