"use client";
import { useState, useEffect } from 'react';
import { Post, Reaction, Comment, SCOPE } from '@/types';
import { postsApi, reactionsApi, commentsApi } from '@/lib/api';
import useAuthStore from '@/store/authStore';
import { socketEvents, getSocket } from '@/socket/client';
import Colors from '@/constants/color';
import TextStyles from '@/constants/textStyle';
import { Heart, MessageCircle, Share, MoreHorizontal, ThumbsUp, Globe, Users, Lock, Paperclip } from 'lucide-react';
import PostReactions from './PostReactions';
import PostComments from './PostComments';

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
        if (!user?._id) return;

        setLoading(true);
        try {
            if (userReaction) {
                await reactionsApi.deleteReaction(post._id, 'POST');
                setUserReaction(null);
                setReactions(prev => prev.filter(r => r.userID !== user._id));

                socketEvents.reactToPost({ type: 'POST', targetID: post._id, status: true });
            } else {
                const response = await reactionsApi.createReaction({
                    targetID: post._id,
                    type: 'POST',
                    emoji: 'like'
                });
                setUserReaction(response.data.data);
                setReactions(prev => [...prev, response.data.data]);

                socketEvents.reactToPost({ type: 'POST', targetID: post._id, status: false });
            }

            if (onUpdate) {
                onUpdate({
                    ...post,
                    reactionsCount: userReaction ? post.reactionsCount - 1 : post.reactionsCount + 1
                });
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleShare = () => {
        console.log('Share post:', post._id);
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
            case SCOPE.PUBLIC: return <Globe size={12} />;
            case SCOPE.FRIEND: return <Users size={12} />;
            case SCOPE.PRIVATE: return <Lock size={12} />;
            default: return <Globe size={12} />;
        }
    };

    return (
        <div style={{
            backgroundColor: Colors.bgPrimary,
            border: `1px solid ${Colors.borderPrimary}`,
            borderRadius: '8px',
            marginBottom: '24px'
        }}>
            {/* Post Header */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '16px 16px 0 16px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {post.avatar ? (
                        <img
                            src={post.avatar}
                            alt={post.userName}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }}
                        />
                    ) : (
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#8e8e8e',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}>
                            {post.userName?.charAt(0) || 'U'}
                        </div>
                    )}
                    <div>
                        <h4 style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: Colors.textPrimary,
                            margin: '0 0 2px 0'
                        }}>
                            {post.userName}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{
                                fontSize: '12px',
                                color: Colors.textSecondary
                            }}>
                                {formatTime(post.createdAt)}
                            </span>
                            <span style={{ color: Colors.textSecondary, fontSize: '12px' }}>•</span>
                            <span style={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}>
                                {getScopeIcon(post.scope)}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    style={{
                        background: 'none',
                        border: 'none',
                        color: Colors.textPrimary,
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Post Content */}
            {post.content && (
                <div style={{
                    padding: '12px 16px 0 16px',
                    fontSize: '14px',
                    color: Colors.textPrimary,
                    lineHeight: '1.4'
                }}>
                    {post.content}
                </div>
            )}

            {/* Post Attachments */}
            {post.attachments && post.attachments.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                    {post.attachments.map((attachment, index) => (
                        <div key={index}>
                            {attachment.type.startsWith('image/') ? (
                                <img
                                    src={attachment.url}
                                    alt={`Attachment ${index + 1}`}
                                    style={{
                                        width: '100%',
                                        maxHeight: '614px',
                                        objectFit: 'cover',
                                        display: 'block'
                                    }}
                                />
                            ) : attachment.type.startsWith('video/') ? (
                                <video
                                    src={attachment.url}
                                    controls
                                    style={{
                                        width: '100%',
                                        maxHeight: '614px',
                                        display: 'block'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    padding: '12px 16px',
                                    backgroundColor: '#f8f9fa',
                                    borderTop: `1px solid ${Colors.borderPrimary}`,
                                    borderBottom: `1px solid ${Colors.borderPrimary}`
                                }}>
                                    <a
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ 
                                            color: Colors.primary, 
                                            textDecoration: 'none', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <Paperclip size={16} />
                                        {attachment.url.split('/').pop()}
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Reactions Summary */}
            {post.reactionsCount > 0 && (
                <div style={{ padding: '0 16px', marginBottom: '8px' }}>
                    <PostReactions reactions={reactions} />
                </div>
            )}

            {/* Action Buttons */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 16px',
                borderTop: `1px solid ${Colors.borderPrimary}`
            }}>
                <button
                    onClick={handleReaction}
                    disabled={loading}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '4px',
                        color: userReaction ? Colors.danger : Colors.textPrimary,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                >
                    <ThumbsUp size={24} />
                </button>

                <button
                    onClick={() => setShowComments(!showComments)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '4px',
                        color: Colors.textPrimary,
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                >
                    <MessageCircle size={24} />
                </button>

                <button
                    onClick={handleShare}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '4px',
                        color: Colors.textPrimary,
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                >
                    <Share size={24} />
                </button>
            </div>

            {/* Like Count */}
            {post.reactionsCount > 0 && (
                <div style={{ padding: '0 16px 8px 16px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#262626' }}>
                        {post.reactionsCount} lượt thích
                    </span>
                </div>
            )}

            {/* Comments Count */}
            {post.commentsCount > 0 && (
                <div style={{ padding: '0 16px 8px 16px' }}>
                    <button
                        onClick={() => setShowComments(!showComments)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#8e8e8e',
                            cursor: 'pointer',
                            fontSize: '14px',
                            padding: 0
                        }}
                    >
                        Xem tất cả {post.commentsCount} bình luận
                    </button>
                </div>
            )}

            {/* Comments Section */}
            {showComments && (
                <div style={{ 
                    borderTop: `1px solid ${Colors.borderPrimary}`, 
                    padding: '16px'
                }}>
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
        </div>
    );
}
