"use client";
import { Heart } from 'lucide-react';

interface PostStatsProps {
    likesCount: number;
    commentsCount: number;
    onShowComments?: () => void;
}

export default function PostStats({ likesCount, commentsCount, onShowComments }: PostStatsProps) {
    return (
        <div className="px-4 py-2">
            {likesCount > 0 && (
                <div className="mb-2">
                    <span className="text-sm font-semibold text-gray-900">
                        {likesCount} lượt thích
                    </span>
                </div>
            )}

            {commentsCount > 0 && (
                <div>
                    <button
                        onClick={onShowComments}
                        className="text-gray-500 hover:text-gray-700 text-sm transition-colors cursor-pointer"
                    >
                        Xem tất cả {commentsCount} bình luận
                    </button>
                </div>
            )}

            {likesCount === 0 && commentsCount === 0 && (
                <div className="text-gray-500 text-sm">
                    Hãy là người đầu tiên thích hoặc bình luận bài viết này
                </div>
            )}
        </div>
    );
}
