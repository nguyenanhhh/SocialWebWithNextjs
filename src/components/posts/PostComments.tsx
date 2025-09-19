"use client";
import { useState, useEffect } from 'react';
import { Comment, Reaction } from '@/types';
import { commentsApi, reactionsApi } from '@/lib/api';
import useAuthStore from '@/store/authStore';
import { socketEvents, getSocket } from '@/socket/client';
import Colors from '@/constants/color';
import TextStyles from '@/constants/textStyle';
import { Heart, Reply, MoreHorizontal } from 'lucide-react';

interface PostCommentsProps {
    postID: string;
    onCommentAdded?: () => void;
}

export default function PostComments({ postID, onCommentAdded }: PostCommentsProps) {
    const { user } = useAuthStore();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});

    useEffect(() => {
        loadComments();
        
        // Listen for real-time comment updates
        const handleAddComment = (data: { postID: string; comment: Comment }) => {
            if (data.postID === postID) {
                setComments(prev => [data.comment, ...prev]);
                if (onCommentAdded) {
                    onCommentAdded();
                }
            }
        };

        const handleEditComment = (data: { postID: string; comment: Comment }) => {
            if (data.postID === postID) {
                setComments(prev => prev.map(c => c._id === data.comment._id ? data.comment : c));
            }
        };

        const handleDeleteComment = (data: { postID: string; commentID: string }) => {
            if (data.postID === postID) {
                setComments(prev => prev.filter(c => c._id !== data.commentID));
            }
        };

        const socket = getSocket();
        
        socket.on('emitAddComment', handleAddComment);
        socket.on('emitEditComment', handleEditComment);
        socket.on('emitDeleteComment', handleDeleteComment);

        return () => {
            socket.off('emitAddComment', handleAddComment);
            socket.off('emitEditComment', handleEditComment);
            socket.off('emitDeleteComment', handleDeleteComment);
        };
    }, [postID, onCommentAdded]); // Thêm dependencies để tránh closure issues

    const loadComments = async () => {
        try {
            const response = await commentsApi.getPostComments(postID);
            setComments(response.data.data);
        } catch (error) {
            console.error('Failed to load comments:', error);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newComment.trim() || !user?._id) return;

        setLoading(true);
        try {
            const response = await commentsApi.createComment({
                postID,
                content: newComment,
                parentID: undefined
            });

            setComments(prev => [response.data.data, ...prev]);
            setNewComment('');
            
            // Emit socket event
            socketEvents.updateCommentCount({ postID, number: 1 });
            
            if (onCommentAdded) {
                onCommentAdded();
            }
        } catch (error) {
            console.error('Failed to create comment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = (parentID: string) => {
        // TODO: Implement reply functionality
        console.log('Reply to comment:', parentID);
    };

    const handleReaction = async (commentID: string) => {
        if (!user?._id) return;

        try {
            // TODO: Implement comment reactions
            console.log('React to comment:', commentID);
        } catch (error) {
            console.error('Failed to toggle comment reaction:', error);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Vừa xong';
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} giờ trước`;
        
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div>
            {/* Comment Input */}
            <div style={{ marginBottom: '16px' }}>
                <form onSubmit={handleSubmitComment}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        {user?.avatar && (
                            <img
                                src={user.avatar}
                                alt={user.userName}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }}
                            />
                        )}
                        
                        <div style={{ flex: 1 }}>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Viết bình luận..."
                                style={{
                                    width: '100%',
                                    minHeight: '40px',
                                    padding: '8px 12px',
                                    border: `1px solid ${Colors.borderPrimary}`,
                                    borderRadius: '20px',
                                    resize: 'none',
                                    fontSize: '14px',
                                    fontFamily: 'inherit',
                                    backgroundColor: Colors.bgSecondary,
                                    color: Colors.textPrimary,
                                    outline: 'none'
                                }}
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={!newComment.trim() || loading}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: newComment.trim() ? Colors.primary : Colors.borderPrimary,
                                color: newComment.trim() ? Colors.textInverse : Colors.textSecondary,
                                border: 'none',
                                borderRadius: '20px',
                                cursor: newComment.trim() ? 'pointer' : 'not-allowed',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            {loading ? 'Đang gửi...' : 'Gửi'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Comments List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {comments.map((comment) => (
                    <div key={comment._id} style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '12px',
                        backgroundColor: Colors.bgSecondary,
                        borderRadius: '8px'
                    }}>
                        {comment.avatar && (
                            <img
                                src={comment.avatar}
                                alt={comment.userName}
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }}
                            />
                        )}
                        
                        <div style={{ flex: 1 }}>
                            <div style={{ marginBottom: '4px' }}>
                                <span style={{
                                    ...TextStyles.bodyMedium,
                                    color: Colors.textPrimary,
                                    fontWeight: '600',
                                    marginRight: '8px'
                                }}>
                                    {comment.userName}
                                </span>
                                <span style={{
                                    ...TextStyles.bodySmall,
                                    color: Colors.textSecondary
                                }}>
                                    {formatTime(comment.createdAt)}
                                </span>
                            </div>
                            
                            <p style={{
                                ...TextStyles.bodyMedium,
                                color: Colors.textPrimary,
                                margin: '0 0 8px 0',
                                lineHeight: '1.4'
                            }}>
                                {comment.content}
                            </p>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <button
                                    onClick={() => handleReaction(comment._id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        background: 'none',
                                        border: 'none',
                                        color: Colors.textSecondary,
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        padding: '4px'
                                    }}
                                >
                                    <Heart size={14} />
                                    Thích
                                </button>
                                
                                <button
                                    onClick={() => handleReply(comment._id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        background: 'none',
                                        border: 'none',
                                        color: Colors.textSecondary,
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        padding: '4px'
                                    }}
                                >
                                    <Reply size={14} />
                                    Trả lời
                                </button>
                            </div>
                        </div>
                        
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                color: Colors.textSecondary,
                                cursor: 'pointer',
                                padding: '4px'
                            }}
                        >
                            <MoreHorizontal size={16} />
                        </button>
                    </div>
                ))}
                
                {comments.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        color: Colors.textSecondary,
                        fontSize: '14px'
                    }}>
                        Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                    </div>
                )}
            </div>
        </div>
    );
}
