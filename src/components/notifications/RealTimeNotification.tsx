"use client";
import { useEffect, useState } from 'react';
import useSocket from '@/hooks/useSocket';
import { Post, Comment } from '@/types';
import Colors from '@/constants/color';
import TextStyles from '@/constants/textStyle';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';

interface NotificationData {
    id: string;
    type: 'new_post' | 'new_reaction' | 'new_comment' | 'new_friend';
    title: string;
    message: string;
    userAvatar?: string;
    timestamp: Date;
}

export default function RealTimeNotification() {
    const socket = useSocket();
    const [notifications, setNotifications] = useState<NotificationData[]>([]);

    useEffect(() => {
        if (!socket) return;

        // Listen for new posts
        const handleNewPost = (data: { post: Post }) => {
            const notification: NotificationData = {
                id: `post_${data.post._id}`,
                type: 'new_post',
                title: 'Bài viết mới',
                message: `${data.post.userName} vừa đăng bài viết`,
                userAvatar: data.post.avatar,
                timestamp: new Date()
            };
            addNotification(notification);
        };

        // Listen for new reactions
        const handleNewReaction = (data: { postID: string; userID: string; userName: string }) => {
            const notification: NotificationData = {
                id: `reaction_${data.postID}_${data.userID}`,
                type: 'new_reaction',
                title: 'Thích bài viết',
                message: `${data.userName} đã thích bài viết của bạn`,
                timestamp: new Date()
            };
            addNotification(notification);
        };

        // Listen for new comments
        const handleNewComment = (data: { postID: string; comment: Comment }) => {
            const notification: NotificationData = {
                id: `comment_${data.comment._id}`,
                type: 'new_comment',
                title: 'Bình luận mới',
                message: `${data.comment.userName} đã bình luận bài viết của bạn`,
                userAvatar: data.comment.avatar,
                timestamp: new Date()
            };
            addNotification(notification);
        };

        socket.on('emitAddPost', handleNewPost);
        socket.on('POSTreaction', handleNewReaction);
        socket.on('emitAddComment', handleNewComment);

        return () => {
            socket.off('emitAddPost', handleNewPost);
            socket.off('POSTreaction', handleNewReaction);
            socket.off('emitAddComment', handleNewComment);
        };
    }, [socket]);

    const addNotification = (notification: NotificationData) => {
        setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep only 5 latest
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 5000);
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const getNotificationIcon = (type: NotificationData['type']) => {
        switch (type) {
            case 'new_post':
                return <MessageCircle size={16} color={Colors.primary} />;
            case 'new_reaction':
                return <Heart size={16} color={Colors.danger} />;
            case 'new_comment':
                return <MessageCircle size={16} color={Colors.success} />;
            case 'new_friend':
                return <UserPlus size={16} color={Colors.info} />;
            default:
                return <MessageCircle size={16} />;
        }
    };

    if (notifications.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxWidth: '350px'
        }}>
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '12px',
                        backgroundColor: Colors.bgPrimary,
                        borderRadius: '8px',
                        boxShadow: `0 4px 12px ${Colors.shadowMedium}`,
                        border: `1px solid ${Colors.borderPrimary}`,
                        animation: 'slideInRight 0.3s ease-out'
                    }}
                    onClick={() => removeNotification(notification.id)}
                >
                    {notification.userAvatar && (
                        <img
                            src={notification.userAvatar}
                            alt="User"
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }}
                        />
                    )}
                    
                    <div style={{ flex: 1 }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '4px'
                        }}>
                            {getNotificationIcon(notification.type)}
                            <span style={{
                                ...TextStyles.bodyMedium,
                                color: Colors.textPrimary,
                                fontWeight: '600'
                            }}>
                                {notification.title}
                            </span>
                        </div>
                        
                        <p style={{
                            ...TextStyles.bodySmall,
                            color: Colors.textSecondary,
                            margin: '0',
                            lineHeight: '1.3'
                        }}>
                            {notification.message}
                        </p>
                        
                        <span style={{
                            ...TextStyles.bodySmall,
                            color: Colors.textSecondary,
                            fontSize: '11px'
                        }}>
                            {notification.timestamp.toLocaleTimeString('vi-VN', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}
                        </span>
                    </div>
                    
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: Colors.textSecondary,
                            cursor: 'pointer',
                            padding: '2px',
                            borderRadius: '4px'
                        }}
                    >
                        ×
                    </button>
                </div>
            ))}
            
            <style jsx>{`
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}
