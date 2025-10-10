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
            // kiểm tra loại file
            if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
                showError('Chỉ cho phép file ảnh và video');
                return false;
            }
            // kt kích thước
            if (file.size > 10 * 1024 * 1024) {
                showError('File quá lớn (tối đa 10MB)');
                return false;
            }
            return true;
        });

        setAttachments(prev => [...prev, ...validFiles]);
        // reset input để có thể chọn cùng file lần nữa
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
        <div className="bg-white rounded-xl p-5 mb-5 shadow-sm">
            <form onSubmit={handleSubmit}>
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        T
                    </div>

                    <div className="flex-1">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Bạn đang nghĩ gì?"
                            className="w-full min-h-[100px] p-3 border border-gray-200 rounded-lg resize-vertical text-base font-sans bg-gray-50 text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                        />
                    </div>
                </div>

                {attachments.length > 0 && (
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                            {attachments.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 min-w-[200px]"
                                >
                                    {getFileIcon(file)}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-gray-900 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                                            {file.name}
                                        </div>
                                        <div className="text-xs text-gray-600 mt-0.5">
                                            {formatFileSize(file.size)}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeAttachment(index)}
                                        className="bg-transparent border-none text-gray-600 cursor-pointer p-1 rounded flex items-center justify-center hover:bg-white transition-colors"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1.5 px-3 py-2 bg-transparent border border-gray-200 rounded-md text-blue-600 cursor-pointer text-sm hover:bg-gray-50 transition-colors"
                        >
                            <Image size={16} />
                            Ảnh/Video
                        </button>

                        <button
                            type="button"
                            className="flex items-center gap-1.5 px-3 py-2 bg-transparent border border-gray-200 rounded-md text-blue-600 cursor-pointer text-sm hover:bg-gray-50 transition-colors"
                        >
                            <Smile size={16} />
                            Cảm xúc
                        </button>

                        <button
                            type="button"
                            className="flex items-center gap-1.5 px-3 py-2 bg-transparent border border-gray-200 rounded-md text-blue-600 cursor-pointer text-sm hover:bg-gray-50 transition-colors"
                        >
                            <MapPin size={16} />
                            Vị trí
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={scope}
                            onChange={(e) => setScope(e.target.value as keyof typeof SCOPE)}
                            className="px-2 py-1.5 border border-gray-200 rounded bg-gray-50 text-gray-900 text-sm focus:outline-none focus:border-blue-600"
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
                    className="hidden"
                />
            </form>
        </div>
    );
}
