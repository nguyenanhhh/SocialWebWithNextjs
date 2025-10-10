"use client";
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { commentsApi } from '@/api';
import useAuthStore from '@/store/authStore';

interface CommentLikeButtonProps {
    commentId: string;
    reactions: string[];
    onReactionUpdate: (reactions: string[]) => void;
    size?: 'sm' | 'md';
}

export default function CommentLikeButton({ 
    commentId, 
    reactions, 
    onReactionUpdate, 
    size = 'sm' 
}: CommentLikeButtonProps) {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const isLiked = user?._id ? reactions.includes(user._id) : false;
    const likeCount = reactions.length;

    const handleLike = async () => {
        if (!user?._id || loading) return;

        setLoading(true);
        
        const newReactions = isLiked 
            ? reactions.filter(id => id !== user._id)
            : [...reactions, user._id];
        
        onReactionUpdate(newReactions);

        try {
            await commentsApi.react(commentId, user._id);
        } catch (error) {
            console.error('Failed to toggle comment reaction:', error);
            onReactionUpdate(reactions);
        } finally {
            setLoading(false);
        }
    };

    const iconSize = size === 'sm' ? 12 : 14;
    const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

    return (
        <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center gap-1 transition-colors cursor-pointer ${
                isLiked
                    ? 'text-red-500'
                    : 'text-gray-500 hover:text-red-500'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <Heart 
                size={iconSize} 
                className={`transition-all duration-200 ${
                    isLiked ? 'fill-current scale-110' : 'hover:scale-110'
                }`}
            />
            {likeCount > 0 && (
                <span className={textSize}>
                    {likeCount}
                </span>
            )}
        </button>
    );
}
