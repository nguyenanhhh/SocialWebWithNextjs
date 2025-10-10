"use client";
import { useState, useEffect } from 'react';
import { Comment, Reaction } from '@/types';
import { commentsApi } from '@/api';
import useAuthStore from '@/store/authStore';
import { socketEvents, getSocket } from '@/socket/client';
import { Reply, MoreHorizontal, MessageCircle } from 'lucide-react';
import CommentLikeButton from './CommentLikeButton';

interface NestedReplyProps {
    reply: any;
    user: any;
    onReply: (parentId: string, userName: string) => void;
    onReactionUpdate: (commentId: string, newReactions: string[]) => void;
    replyingTo: string | null;
    replyContent: string;
    setReplyContent: (content: string) => void;
    onReplySubmit: (parentId: string) => void;
    onCancelReply: () => void;
    loading: boolean;
    formatTime: (dateString: string) => string;
}

interface PostCommentsProps {
    postID: string;
    onCommentAdded?: () => void;
}

function NestedReply({ 
    reply, 
    user, 
    onReply, 
    onReactionUpdate, 
    replyingTo, 
    replyContent, 
    setReplyContent, 
    onReplySubmit, 
    onCancelReply, 
    loading, 
    formatTime 
}: NestedReplyProps) {
    const marginLeft = reply.level * 16;
    
    return (
        <div className="space-y-2" style={{ marginLeft: `${marginLeft}px` }}>
            <div className="flex gap-2">
                {reply?.avatar ? (
                    <img
                        src={reply.avatar}
                        alt={reply?.userName || 'User'}
                        className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                    />
                ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {(reply?.userName || 'U').charAt(0).toUpperCase()}
                    </div>
                )}
                
                <div className="flex-1 min-w-0">
                    <div className="bg-gray-100 rounded-2xl p-2">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-gray-900">
                                {reply?.userName || 'Unknown User'}
                            </span>
                            <span className="text-xs text-gray-500">
                                {formatTime(reply?.createdAt || new Date().toISOString())}
                            </span>
                        </div>
                        
                        <p className="text-xs text-gray-900 mb-1 leading-relaxed break-words">
                            {reply?.content || ''}
                        </p>
                        
                        <div className="flex items-center gap-3">
                            <CommentLikeButton
                                commentId={reply._id}
                                reactions={reply?.reactions || []}
                                onReactionUpdate={(newReactions) => onReactionUpdate(reply._id, newReactions)}
                                size="sm"
                            />
                            
                            {user && (
                                <button
                                    onClick={() => onReply(reply._id, reply.userName)}
                                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                                >
                                    <Reply size={12} />
                                    Trả lời
                                </button>
                            )}
                        </div>
                    </div>

                    {replyingTo === reply._id && user && (
                        <div className="mt-2">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                onReplySubmit(reply._id);
                            }}>
                                <div className="flex gap-2 items-start">
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.userName || 'User'}
                                            className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                            {(user.userName || 'U').charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    
                                    <div className="flex-1 min-w-0">
                                        <textarea
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder="Viết phản hồi..."
                                            className="w-full min-h-[32px] p-2 border border-gray-200 rounded-xl resize-none text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            rows={1}
                                        />
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        disabled={!replyContent.trim() || loading}
                                        className={`px-3 py-1 rounded-xl text-xs font-medium transition-all duration-200 flex-shrink-0 ${
                                            replyContent.trim() && !loading
                                                ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        {loading ? 'Gửi...' : 'Gửi'}
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={onCancelReply}
                                        className="px-2 py-1 text-gray-500 hover:text-gray-700 text-xs"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {reply.nestedReplies && reply.nestedReplies.length > 0 && (
                <div className="space-y-2">
                    {reply.nestedReplies.map((nestedReply: any) => (
                        <NestedReply
                            key={nestedReply._id}
                            reply={nestedReply}
                            user={user}
                            onReply={onReply}
                            onReactionUpdate={onReactionUpdate}
                            replyingTo={replyingTo}
                            replyContent={replyContent}
                            setReplyContent={setReplyContent}
                            onReplySubmit={onReplySubmit}
                            onCancelReply={onCancelReply}
                            loading={loading}
                            formatTime={formatTime}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function PostComments({ postID, onCommentAdded }: PostCommentsProps) {
    const { user } = useAuthStore();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');

    useEffect(() => {
        loadComments();
        
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
    }, [postID, onCommentAdded]);

    const loadComments = async () => {
        try {
            const response = await commentsApi.getByPostId(postID);
            setComments(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error('Failed to load comments:', error);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newComment.trim() || !user?._id) return;

        setLoading(true);
        try {
            const response = await commentsApi.create({
                postID,
                userID: user._id,
                userName: user.userName,
                avatar: user.avatar,
                content: newComment,
                parentID: undefined
            });

            setComments(prev => [response as unknown as Comment, ...prev]);
            setNewComment('');
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

    const handleReply = (parentID: string, userName: string) => {
        setReplyingTo(parentID);
        setReplyContent(`@${userName} `);
    };

    const handleReplySubmit = async (parentID: string) => {
        if (!replyContent.trim() || !user?._id) return;

        setLoading(true);
        try {
            const response = await commentsApi.create({
                postID,
                userID: user._id,
                userName: user.userName,
                avatar: user.avatar,
                content: replyContent,
                parentID: parentID
            });

            setComments(prev => [response as unknown as Comment, ...prev]);
            setReplyContent('');
            setReplyingTo(null);
            socketEvents.updateCommentCount({ postID, number: 1 });
            
            if (onCommentAdded) {
                onCommentAdded();
            }
        } catch (error) {
            console.error('Failed to create reply:', error);
        } finally {
            setLoading(false);
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

    const handleReactionUpdate = (commentId: string, newReactions: string[]) => {
        setComments(prev => prev.map(c => 
            c._id === commentId 
                ? { ...c, reactions: newReactions }
                : c
        ));
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
        setReplyContent('');
    };

    const parentComments = comments.filter(comment => !comment.parentID);
    
    const getReplies = (parentId: string) => {
        return comments.filter(comment => comment.parentID === parentId);
    };
    
    const getNestedReplies = (parentId: string, level = 0): any[] => {
        const directReplies = getReplies(parentId);
        return directReplies.map((reply: any) => ({
            ...reply,
            level,
            nestedReplies: getNestedReplies(reply._id, level + 1)
        }));
    };

    return (
        <div className="space-y-4">
            {user ? (
                <div className="bg-gray-50 rounded-lg p-4">
                    <form onSubmit={handleSubmitComment}>
                        <div className="flex gap-3 items-start">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.userName || 'User'}
                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                    {(user.userName || 'U').charAt(0).toUpperCase()}
                                </div>
                            )}
                            
                            <div className="flex-1 min-w-0">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Viết bình luận..."
                                    className="w-full min-h-[40px] p-3 border border-gray-200 rounded-2xl resize-none text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    rows={1}
                                />
                            </div>
                            
                            <button
                                type="submit"
                                disabled={!newComment.trim() || loading}
                                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                                    newComment.trim() && !loading
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {loading ? 'Đang gửi...' : 'Gửi'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                        <MessageCircle size={20} />
                        <span className="text-sm">Đăng nhập để bình luận</span>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {parentComments.map((comment) => {
                    const nestedReplies = getNestedReplies(comment._id);
                    
                    return (
                        <div key={comment._id} className="space-y-3">
                            <div className="flex gap-3">
                                {comment?.avatar ? (
                                    <img
                                        src={comment.avatar}
                                        alt={comment?.userName || 'User'}
                                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                        {(comment?.userName || 'U').charAt(0).toUpperCase()}
                                    </div>
                                )}
                                
                                <div className="flex-1 min-w-0">
                                    <div className="bg-gray-50 rounded-2xl p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-semibold text-gray-900">
                                                {comment?.userName || 'Unknown User'}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {formatTime(comment?.createdAt || new Date().toISOString())}
                                            </span>
                                        </div>
                                        
                                        <p className="text-sm text-gray-900 mb-2 leading-relaxed break-words">
                                            {comment?.content || ''}
                                        </p>
                                        
                                        <div className="flex items-center gap-4">
                                            <CommentLikeButton
                                                commentId={comment._id}
                                                reactions={comment?.reactions || []}
                                                onReactionUpdate={(newReactions) => handleReactionUpdate(comment._id, newReactions)}
                                                size="sm"
                                            />
                                            
                                            {user && (
                                                <button
                                                    onClick={() => handleReply(comment._id, comment.userName)}
                                                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                                                >
                                                    <Reply size={14} />
                                                    Trả lời
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {replyingTo === comment._id && user && (
                                        <div className="mt-3 ml-4">
                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                handleReplySubmit(comment._id);
                                            }}>
                                                <div className="flex gap-2 items-start">
                                                    {user.avatar ? (
                                                        <img
                                                            src={user.avatar}
                                                            alt={user.userName || 'User'}
                                                            className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                                            {(user.userName || 'U').charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        <textarea
                                                            value={replyContent}
                                                            onChange={(e) => setReplyContent(e.target.value)}
                                                            placeholder="Viết phản hồi..."
                                                            className="w-full min-h-[32px] p-2 border border-gray-200 rounded-xl resize-none text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                            rows={1}
                                                        />
                                                    </div>
                                                    
                                                    <button
                                                        type="submit"
                                                        disabled={!replyContent.trim() || loading}
                                                        className={`px-3 py-1 rounded-xl text-xs font-medium transition-all duration-200 flex-shrink-0 ${
                                                            replyContent.trim() && !loading
                                                                ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                    >
                                                        {loading ? 'Gửi...' : 'Gửi'}
                                                    </button>
                                                    
                                                    <button
                                                        type="button"
                                                        onClick={handleCancelReply}
                                                        className="px-2 py-1 text-gray-500 hover:text-gray-700 text-xs"
                                                    >
                                                        Hủy
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    {nestedReplies.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {nestedReplies.map((reply: any) => (
                                                <NestedReply
                                                    key={reply._id}
                                                    reply={reply}
                                                    user={user}
                                                    onReply={handleReply}
                                                    onReactionUpdate={handleReactionUpdate}
                                                    replyingTo={replyingTo}
                                                    replyContent={replyContent}
                                                    setReplyContent={setReplyContent}
                                                    onReplySubmit={handleReplySubmit}
                                                    onCancelReply={handleCancelReply}
                                                    loading={loading}
                                                    formatTime={formatTime}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                
                {parentComments.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        <MessageCircle size={24} className="mx-auto mb-2 text-gray-300" />
                        <p>Chưa có bình luận nào. Hãy bình luận vào bên dươ</p>
                    </div>
                )}
            </div>
        </div>
    );
}
