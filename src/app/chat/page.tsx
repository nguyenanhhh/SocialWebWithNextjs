"use client";
import { useState, useEffect, useRef } from 'react';
import { Convention, Message } from '@/types';
import { conventionsApi } from '@/lib/api';
import useAuthStore from '@/store/authStore';
import { getSocket } from '@/socket/client';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Send, 
  Phone, 
  Video, 
  MoreHorizontal,
  Paperclip,
  Smile,
  Users,
  Settings
} from 'lucide-react';

export default function ChatPage() {
    const { user } = useAuthStore();
    const [conventions, setConventions] = useState<Convention[]>([]);
    const [selectedConvention, setSelectedConvention] = useState<Convention | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user?._id) {
            loadConventions();
        }
    }, [user?._id]);

    useEffect(() => {
        if (selectedConvention) {
            loadMessages(selectedConvention._id);
            setupSocketListeners();
        }
    }, [selectedConvention]);

    const loadConventions = async () => {
        try {
            setLoading(true);
            const response = await conventionsApi.getConventions(user._id);
            setConventions(response.data);
            if (response.data.length > 0) {
                setSelectedConvention(response.data[0]);
            }
        } catch (error) {
            console.error('Failed to load conventions:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async (conventionId: string) => {
        try {
            const response = await conventionsApi.getConventionById(conventionId);
            setMessages(response.data.messages || []);
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    };

    const setupSocketListeners = () => {
        const socket = getSocket();
        
        const handleNewMessage = (data: { conventionId: string; message: Message }) => {
            if (data.conventionId === selectedConvention?._id) {
                setMessages(prev => [...prev, data.message]);
            }
        };

        socket.on('newMessage', handleNewMessage);
        
        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedConvention) return;

        try {
            const response = await conventionsApi.sendMessage(selectedConvention._id, {
                content: newMessage,
                senderID: user._id,
                type: 'TEXT'
            });

            setMessages(prev => [...prev, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const filteredConventions = conventions.filter(convention =>
        convention.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        convention.participants?.some(p => p.userName?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto h-screen flex">
                {/* Sidebar */}
                <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                        <h1 className="text-xl font-bold text-gray-900 mb-4">Tin nhắn</h1>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm cuộc trò chuyện..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {filteredConventions.map((convention) => (
                            <div
                                key={convention._id}
                                onClick={() => setSelectedConvention(convention)}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                                    selectedConvention?._id === convention._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <Users size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">
                                            {convention.name || 'Cuộc trò chuyện'}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate">
                                            {convention.lastMessage?.content || 'Chưa có tin nhắn'}
                                        </p>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {convention.lastMessage?.createdAt && 
                                            new Date(convention.lastMessage.createdAt).toLocaleTimeString('vi-VN', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {selectedConvention ? (
                        <>
                            {/* Chat Header */}
                            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <Users size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-gray-900">
                                            {selectedConvention.name || 'Cuộc trò chuyện'}
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            {selectedConvention.participants?.length || 0} thành viên
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon">
                                        <Phone size={20} />
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <Video size={20} />
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <MoreHorizontal size={20} />
                                    </Button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message._id}
                                        className={`flex ${message.senderID === user._id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                message.senderID === user._id
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 text-gray-900'
                                            }`}
                                        >
                                            <p className="text-sm">{message.content}</p>
                                            <p className={`text-xs mt-1 ${
                                                message.senderID === user._id ? 'text-blue-100' : 'text-gray-500'
                                            }`}>
                                                {new Date(message.createdAt).toLocaleTimeString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <div className="bg-white border-t border-gray-200 p-4">
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon">
                                        <Paperclip size={20} />
                                    </Button>
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            placeholder="Nhập tin nhắn..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <Button variant="outline" size="icon">
                                        <Smile size={20} />
                                    </Button>
                                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                                        <Send size={20} />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <MessageCircle size={48} className="text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Chọn cuộc trò chuyện
                                </h3>
                                <p className="text-gray-500">
                                    Chọn một cuộc trò chuyện để bắt đầu nhắn tin
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
