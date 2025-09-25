"use client";
import { useState, useEffect } from 'react';
import { Post, Reaction, Comment, SCOPE } from '@/types';
import { postsApi, reactionsApi, commentsApi } from '@/lib/api';
import useAuthStore from '@/store/authStore';
import { socketEvents, getSocket } from '@/socket/client';
import { Heart, MessageCircle, Share, MoreHorizontal, Globe, Users, Lock, Paperclip, Bookmark, Trash2, Edit3 } from 'lucide-react';
import PostComments from './PostComments';
import PostStats from './PostStats';

interface PostCardProps {
    post: Post;
    onUpdate?: (updatedPost: Post) => void;
    onDelete?: (postId: string) => void;
}

export default function PostCard({ post, onUpdate, onDelete }: PostCardProps) {
    const { user } = useAuthStore();
    const [showComments, setShowComments] = useState(false);
    const [reactions, setReactions] = useState<Reaction[]>([]);
    const [userReaction, setUserReaction] = useState<Reaction | null>(null);
    const [loading, setLoading] = useState(false);
    const [showDeleteMenu, setShowDeleteMenu] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content || '');
    const [editScope, setEditScope] = useState(post.scope || SCOPE.PUBLIC);
    const [editLoading, setEditLoading] = useState(false);

    useEffect(() => {
        loadReactions();

        const socket = getSocket();

        const handleReactionUpdate = (data: { postID: string; userID: string; userName: string }) => {
            if (data.postID === post._id) {
                loadReactions();
            }
        };

        const handleCommentUpdate = (data: { postID: string; number: number }) => {
            if (data.postID === post._id) {
                if (onUpdate) {
                    onUpdate({ ...post, commentsCount: post.commentsCount + data.number });
                }
            }
        };

        const handlePostUpdate = (data: { post: Post }) => {
            if (data.post._id === post._id) {
                if (onUpdate) {
                    onUpdate(data.post);
                }
            }
        };

        const handlePostDelete = (data: { postID: string }) => {
            if (data.postID === post._id) {
                if (onDelete) {
                    onDelete(post._id);
                }
            }
        };

        socketEvents.joinChatRoom(post._id);

        socket.on('POSTreaction', handleReactionUpdate);
        socket.on('comment_count', handleCommentUpdate);
        socket.on('emitEditPost', handlePostUpdate);
        socket.on('emitRemovePost', handlePostDelete);

        return () => {
            socket.off('POSTreaction', handleReactionUpdate);
            socket.off('comment_count', handleCommentUpdate);
            socket.off('emitEditPost', handlePostUpdate);
            socket.off('emitRemovePost', handlePostDelete);
        };
    }, [post._id, onUpdate, onDelete])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showDeleteMenu) {
                setShowDeleteMenu(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showDeleteMenu])

    const loadReactions = async () => {
        try {
            const response = await reactionsApi.getPostReactions(post._id);
            const reactions = response.data?.data || [];
            setReactions(reactions);

            if (user?._id) {
                const userReact = reactions.find(r => r.userID === user._id);
                setUserReaction(userReact || null);
            }
        } catch (error) {
            setReactions([]);
            setUserReaction(null);
        }
    };

    const handleReaction = async () => {
        if (!user?._id || loading) return;

        setLoading(true);
        
        const newReactionCount = userReaction ? post.reactionsCount - 1 : post.reactionsCount + 1;
        const newUserReaction = userReaction ? null : { 
            _id: 'temp', 
            userID: user._id, 
            targetID: post._id, 
            type: 'POST', 
            emoji: 'like',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        } as Reaction;

        if (onUpdate) {
            onUpdate({
                ...post,
                reactionsCount: newReactionCount
            });
        }
        
        setUserReaction(newUserReaction);
        setReactions(prev => {
            if (userReaction) {
                return prev.filter(r => r.userID !== user._id);
            } else {
                return newUserReaction ? [...prev, newUserReaction] : prev;
            }
        });

        try {
            if (userReaction) {
                await reactionsApi.deleteReaction(post._id, 'POST', user._id);
            } else {
                const response = await reactionsApi.createReaction({
                    targetID: post._id,
                    userID: user._id,
                    userName: user.userName || 'Unknown User',
                    avatar: user.avatar || '',
                    type: 'POST',
                    emoji: 'like'
                });
                
                setUserReaction(response.data.data);
                setReactions(prev => {
                    const filtered = prev.filter(r => r.userID !== user._id);
                    return [...filtered, response.data.data];
                });
                
                socketEvents.reactToPost({ type: 'POST', targetID: post._id, status: false });
            }
        } catch (error) {
            console.error('Error handling reaction:', error);
        
            if (onUpdate) {
                onUpdate({
                    ...post,
                    reactionsCount: post.reactionsCount
                });
            }
            
            setUserReaction(userReaction);
            setReactions(prev => {
                if (userReaction) {
                    return [...prev, userReaction];
                } else {
                    return prev.filter(r => r.userID !== user._id);
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleShare = () => {
        console.log('Share post:', post._id);
    };

    const handleDeletePost = async () => {
        if (!user?._id || deleteLoading) return;
        
        const confirmed = window.confirm('Bạn có chắc chắn muốn xóa bài viết này?');
        if (!confirmed) return;

        setDeleteLoading(true);
        try {
            await postsApi.moveToTrash(post._id);
            if (onDelete) {
                onDelete(post._id);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Có lỗi xảy ra khi xóa bài viết. Vui lòng thử lại.');
        } finally {
            setDeleteLoading(false);
            setShowDeleteMenu(false);
        }
    };

    const handleEditPost = () => {
        setEditContent(post.content || '');
        setEditScope(post.scope || SCOPE.PUBLIC);
        setIsEditing(true);
        setShowDeleteMenu(false);
    };

    const handleSaveEdit = async () => {
        if (!editContent.trim() || editLoading) return;

        setEditLoading(true);
        try {
            const response = await postsApi.edit(post._id, { 
                content: editContent.trim(),
                scope: editScope
            });
            if (onUpdate && response.data?.data) {
                onUpdate(response.data.data);
            }
            setIsEditing(false);
        } catch (error) {
            console.error('Error editing post:', error);
            alert('Có lỗi xảy ra khi chỉnh sửa bài viết. Vui lòng thử lại.');
        } finally {
            setEditLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditContent(post.content || '');
        setEditScope(post.scope || SCOPE.PUBLIC);
        setIsEditing(false);
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Vừa xong';
        if (diffInHours < 24) return `${diffInHours} giờ trước`;
        return date.toLocaleDateString('vi-VN');
    };

    const getScopeIcon = (scope: keyof typeof SCOPE) => {
        switch (scope) {
            case SCOPE.PUBLIC: return <Globe size={14} className="text-text-secondary" />;
            case SCOPE.FRIEND: return <Users size={14} className="text-text-secondary" />;
            case SCOPE.PRIVATE: return <Lock size={14} className="text-text-secondary" />;
            default: return <Globe size={14} className="text-text-secondary" />;
        }
    };

    return (
        <article className="bg-white border border-border-primary rounded-lg mb-3 shadow-sm hover:shadow-md transition-shadow duration-200 max-w-full overflow-hidden">
            <header className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    {post.avatar ? (
                        <img
                            src={post.avatar}
                            alt={post.userName}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center text-text-secondary text-sm font-semibold flex-shrink-0">
                            {post.userName?.charAt(0) || 'U'}
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-text-primary truncate">
                            {post.userName}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                            <span className="truncate">{formatTime(post.createdAt)}</span>
                            <span className="flex items-center">
                                {getScopeIcon(post.scope)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <button 
                        onClick={() => setShowDeleteMenu(!showDeleteMenu)}
                        className="p-2 rounded-full flex-shrink-0 ml-2 hover:bg-bg-secondary transition-colors"
                    >
                        <MoreHorizontal size={20} className="text-text-secondary" />
                    </button>
                    
                    {showDeleteMenu && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-border-primary rounded-lg shadow-lg z-10">
                            {user?._id === post.userID && (
                                <>
                                    <button
                                        onClick={handleEditPost}
                                        className="w-full px-4 py-3 text-left text-sm text-text-primary hover:bg-bg-secondary flex items-center gap-2 transition-colors"
                                    >
                                        <Edit3 size={16} />
                                        Chỉnh sửa bài viết
                                    </button>
                                    <button
                                        onClick={handleDeletePost}
                                        disabled={deleteLoading}
                                        className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 size={16} />
                                        {deleteLoading ? 'Đang xóa...' : 'Xóa bài viết'}
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {post.content && (
                <div className="px-4 pb-3">
                    {isEditing ? (
                        <div className="space-y-3">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                placeholder="Bạn đang nghĩ gì?"
                                className="w-full min-h-[60px] p-3 bg-white text-black border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 text-sm leading-relaxed"
                                disabled={editLoading}
                                autoFocus
                            />
                            
                            <div className="flex items-center gap-2">
                                <select
                                    value={editScope}
                                    onChange={(e) => setEditScope(e.target.value as keyof typeof SCOPE)}
                                    className="text-xs text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={editLoading}
                                >
                                    <option value={SCOPE.PUBLIC}>Công khai</option>
                                    <option value={SCOPE.FRIEND}>Bạn bè</option>
                                    <option value={SCOPE.PRIVATE}>Chỉ mình tôi</option>
                                </select>
                            </div>
                            
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={handleCancelEdit}
                                    disabled={editLoading}
                                    className="px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors disabled:opacity-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={!editContent.trim() || editLoading}
                                    className="px-4 py-2 text-xs font-medium text-white bg-blue-500 border border-blue-500 rounded-lg hover:bg-blue-600 hover:border-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {editLoading ? 'Đang lưu...' : 'Lưu'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-text-primary leading-relaxed break-words">
                            {post.content}
                        </div>
                    )}
                </div>
            )}

            {post.attachments && post.attachments.length > 0 && (
                <div>
                    {post.attachments.map((attachment, index) => {
                        console.log(`Attachment ${index}:`, attachment);
                        return (
                        <div key={index} className="relative group">
                            {attachment.type === 'IMAGE' || attachment.type.startsWith('image/') ? (
                                <img
                                    src={attachment.url}
                                    alt={`Attachment ${index + 1}`}
                                    className="w-full max-h-[614px] object-cover block"
                                />
                            ) : attachment.type === 'VIDEO' || attachment.type.startsWith('video/') ? (
                                <video
                                    src={attachment.url}
                                    controls
                                    className="w-full max-h-[614px] block"
                                />
                            ) : (
                                <div className="px-4 py-3 bg-bg-secondary border-t border-b border-border-secondary">
                                    <a
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:text-primary-hover flex items-center gap-2 text-sm font-medium transition-colors"
                                    >
                                        <Paperclip size={16} />
                                        {attachment.url.split('/').pop()}
                                    </a>
                                </div>
                            )}
                            
                            {isEditing && (attachment.type === 'IMAGE' || attachment.type === 'VIDEO' || attachment.type.startsWith('image/') || attachment.type.startsWith('video/')) && (
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-black bg-opacity-75 rounded-lg p-2 flex gap-2">
                                        <button className="text-white text-xs hover:text-gray-300 transition-colors">
                                            Thay ảnh
                                        </button>
                                        <button className="text-red-400 text-xs hover:text-red-300 transition-colors">
                                            Xóa ảnh
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        );
                    })}
                </div>
            )}

            {!isEditing && (
                <div className="flex items-center justify-between px-4 py-2 border-t border-border-secondary">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <button
                            onClick={handleReaction}
                            disabled={loading}
                            className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 touch-manipulation ${
                                userReaction 
                                    ? 'text-red-500' 
                                    : 'text-text-secondary hover:text-red-500'
                            } ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        >
                            <Heart 
                                size={20} 
                                className={`transition-all duration-200 ${
                                    userReaction 
                                        ? 'fill-current' 
                                        : 'group-hover:scale-110'
                                }`}
                            />
                            <span className="text-sm font-medium hidden sm:block">
                                {post.reactionsCount > 0 ? post.reactionsCount : 'Thích'}
                            </span>
                        </button>

                        <button
                            onClick={() => setShowComments(!showComments)}
                            className={`group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer touch-manipulation ${
                                showComments 
                                    ? 'text-primary' 
                                    : 'text-text-secondary hover:text-primary'
                            }`}
                        >
                            <MessageCircle 
                                size={20} 
                                className={`transition-all duration-200 ${
                                    showComments 
                                        ? 'scale-110' 
                                        : 'group-hover:scale-110'
                                }`}
                            />
                            <span className="text-sm font-medium hidden sm:block">
                                {post.commentsCount > 0 ? post.commentsCount : 'Bình luận'}
                            </span>
                        </button>

                        <button
                            onClick={handleShare}
                            className="group flex items-center gap-2 px-3 py-2 rounded-lg text-text-secondary hover:text-success transition-all duration-200 cursor-pointer touch-manipulation"
                        >
                            <Share 
                                size={20} 
                                className="transition-all duration-200 group-hover:scale-110"
                            />
                            <span className="text-sm font-medium hidden sm:block">Chia sẻ</span>
                        </button>
                    </div>

                    <button className="group flex items-center gap-2 px-3 py-2 rounded-lg text-text-secondary transition-all duration-200 cursor-pointer touch-manipulation">
                        <Bookmark 
                            size={20} 
                            className="transition-all duration-200 group-hover:scale-110"
                        />
                        <span className="text-sm font-medium hidden sm:block">Lưu</span>
                    </button>
                </div>
            )}

            <PostStats
                likesCount={post.reactionsCount}
                commentsCount={post.commentsCount}
                onShowComments={() => setShowComments(!showComments)}
            />

            {showComments && (
                <div className="border-t border-border-secondary px-4 py-3 bg-bg-secondary/20">
                    <PostComments
                        postID={post._id}
                        onCommentAdded={() => {
                            if (onUpdate) {
                                onUpdate({ ...post, commentsCount: post.commentsCount + 1 });
                            }
                        }}
                    />
                </div>
            )}

        </article>
    );
}