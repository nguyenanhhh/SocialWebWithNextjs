"use client";
import { useEffect, useState } from 'react';
import useSocket from '@/hooks/useSocket';
import { Post, Comment } from '@/types';
import { Heart, MessageCircle, UserPlus, X } from 'lucide-react';

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

        const handlePostCreated = (data: Post) => {
            const notification: NotificationData = {
                id: `post_${data._id}`,
                type: 'new_post',
                title: 'Bài viết mới',
                message: `${data.userName} vừa đăng bài viết`,
                userAvatar: data.avatar,
                timestamp: new Date()
            };
            addNotification(notification);
        };
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
        socket.on('postCreated', handlePostCreated);
        socket.on('POSTreaction', handleNewReaction);
        socket.on('emitAddComment', handleNewComment);

        return () => {
            socket.off('emitAddPost', handleNewPost);
            socket.off('postCreated', handlePostCreated);
            socket.off('POSTreaction', handleNewReaction);
            socket.off('emitAddComment', handleNewComment);
        };
    }, [socket]);

    const addNotification = (notification: NotificationData) => {
        setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep only 5 latest
        
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
                return <MessageCircle size={16} className="text-blue-600" />;
            case 'new_reaction':
                return <Heart size={16} className="text-red-600" />;
            case 'new_comment':
                return <MessageCircle size={16} className="text-green-600" />;
            case 'new_friend':
                return <UserPlus size={16} className="text-blue-600" />;
            default:
                return <MessageCircle size={16} />;
        }
    };

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-5 right-5 z-[1000] flex flex-col gap-2 max-w-[350px]">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-lg border border-gray-200 animate-slideInRight cursor-pointer"
                    onClick={() => removeNotification(notification.id)}
                >
                    {notification.userAvatar && (
                        <img
                            src={notification.userAvatar}
                            alt="User"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    )}
                    
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            {getNotificationIcon(notification.type)}
                            <span className="text-base text-gray-900 font-semibold">
                                {notification.title}
                            </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 m-0 leading-tight">
                            {notification.message}
                        </p>
                        
                        <span className="text-xs text-gray-600">
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
                        className="bg-transparent border-none text-gray-600 cursor-pointer p-0.5 rounded hover:bg-gray-100"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
}
