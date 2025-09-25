"use client";
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showSuccess, showError } from '@/utils/toast';
import { socketEvents, getSocket } from '@/socket/client';
import useAuthStore from '@/store/authStore';
import Colors from '@/constants/color';
import TextStyles from '@/constants/textStyle';
import { SCOPE } from '@/types';
import { Image, Video, Smile, MapPin, Tag } from 'lucide-react';

interface CreatePostProps {
    onPostCreated?: () => void;
    onPostCreatedImmediate?: (newPost: any) => void;
    groupID?: string;
}

export default function CreatePost({ onPostCreated, onPostCreatedImmediate, groupID }: CreatePostProps) {
    const { user } = useAuthStore();
    const [content, setContent] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [scope, setScope] = useState<keyof typeof SCOPE>(SCOPE.PUBLIC);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim() && attachments.length === 0) {
            showError('Vui lòng nhập nội dung hoặc chọn file');
            return;
        }

        if (!user?._id) {
            showError('Vui lòng đăng nhập');
            return;
        }


        setLoading(true);

        try {

            const formData = new FormData();
            formData.append('content', content);
            formData.append('scope', scope);
            formData.append('userID', user._id);

            if (groupID) {
                formData.append('groupID', groupID);
            }

            attachments.forEach(file => {
                formData.append('attachments', file);
            });
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/post/store`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Tạo bài viết thất bại');
            }

            const result = await response.json();
            showSuccess('Tạo bài viết thành công!');

            if (result.success && result.data && onPostCreatedImmediate) {
                onPostCreatedImmediate(result.data);
            }

            const socket = getSocket();
            if (socket && socket.connected) {
                socket.emit('postCreated', result.data);
            }
            setContent('');
            setAttachments([]);
            setScope(SCOPE.PUBLIC);

            if (onPostCreated) {
                onPostCreated();
            }
        } catch (error: any) {
            showError(error?.message || 'Đăng bài thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const validFiles = files.filter(file => {
            // Kiểm tra loại file
            if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
                showError('Chỉ cho phép file ảnh và video');
                return false;
            }
            // Kiểm tra kích thước
            if (file.size > 10 * 1024 * 1024) {
                showError('File quá lớn (tối đa 10MB)');
                return false;
            }
            return true;
        });

        setAttachments(prev => [...prev, ...validFiles]);
        // Reset input để có thể chọn cùng file lần nữa
        if (e.target) {
            e.target.value = '';
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) return <Image size={20} />;
        if (file.type.startsWith('video/')) return <Video size={20} />;
        return <Tag size={20} />;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div style={{
            backgroundColor: Colors.bgPrimary,
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: `0 2px 4px ${Colors.shadowLight}`
        }}>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: Colors.primary,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: Colors.textInverse,
                            fontWeight: 'bold'
                        }}
                    >
                        T
                    </div>

                    <div style={{ flex: 1 }}>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Bạn đang nghĩ gì?"
                            style={{
                                width: '100%',
                                minHeight: '100px',
                                padding: '12px',
                                border: `1px solid ${Colors.borderPrimary}`,
                                borderRadius: '8px',
                                resize: 'vertical',
                                fontSize: '16px',
                                fontFamily: 'inherit',
                                backgroundColor: Colors.bgSecondary,
                                color: Colors.textPrimary,
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                {attachments.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {attachments.map((file, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 12px',
                                        backgroundColor: Colors.bgSecondary,
                                        borderRadius: '6px',
                                        border: `1px solid ${Colors.borderPrimary}`,
                                        minWidth: '200px'
                                    }}
                                >
                                    {getFileIcon(file)}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontSize: '14px',
                                            color: Colors.textPrimary,
                                            fontWeight: '500',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {file.name}
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: Colors.textSecondary,
                                            marginTop: '2px'
                                        }}>
                                            {formatFileSize(file.size)}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeAttachment(index)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: Colors.textSecondary,
                                            cursor: 'pointer',
                                            padding: '4px',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = Colors.bgPrimary;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 12px',
                                backgroundColor: 'transparent',
                                border: `1px solid ${Colors.borderPrimary}`,
                                borderRadius: '6px',
                                color: Colors.primary,
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            <Image size={16} />
                            Ảnh/Video
                        </button>

                        <button
                            type="button"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 12px',
                                backgroundColor: 'transparent',
                                border: `1px solid ${Colors.borderPrimary}`,
                                borderRadius: '6px',
                                color: Colors.primary,
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            <Smile size={16} />
                            Cảm xúc
                        </button>

                        <button
                            type="button"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 12px',
                                backgroundColor: 'transparent',
                                border: `1px solid ${Colors.borderPrimary}`,
                                borderRadius: '6px',
                                color: Colors.primary,
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            <MapPin size={16} />
                            Vị trí
                        </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <select
                            value={scope}
                            onChange={(e) => setScope(e.target.value as keyof typeof SCOPE)}
                            style={{
                                padding: '6px 8px',
                                border: `1px solid ${Colors.borderPrimary}`,
                                borderRadius: '4px',
                                backgroundColor: Colors.bgSecondary,
                                color: Colors.textPrimary,
                                fontSize: '14px'
                            }}
                        >
                            <option value={SCOPE.PUBLIC}>Công khai</option>
                            <option value={SCOPE.FRIEND}>Bạn bè</option>
                            <option value={SCOPE.PRIVATE}>Chỉ mình tôi</option>
                        </select>

                        <Button
                            type="submit"
                            variant="default"
                            disabled={!content.trim() && attachments.length === 0}
                        >
                            {loading ? 'Đang đăng...' : 'Đăng'}
                        </Button>
                    </div>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
            </form>
        </div>
    );
}
