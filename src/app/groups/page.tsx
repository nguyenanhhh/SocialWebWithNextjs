"use client";
import { useState, useEffect } from 'react';
import { Group } from '@/types';
import { groupsApi } from '@/lib/api';
import useAuthStore from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  Users, 
  Settings, 
  MessageCircle,
  Calendar,
  Globe,
  Lock,
  MoreHorizontal
} from 'lucide-react';

export default function GroupsPage() {
    const { user } = useAuthStore();
    const [groups, setGroups] = useState<Group[]>([]);
    const [myGroups, setMyGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        if (user?._id) {
            loadGroups();
        }
    }, [user?._id]);

    const loadGroups = async () => {
        try {
            setLoading(true);
            const [allGroupsRes, myGroupsRes] = await Promise.all([
                groupsApi.getAllGroups(),
                groupsApi.getUserGroups(user._id)
            ]);
            
            setGroups(allGroupsRes.data);
            setMyGroups(myGroupsRes.data);
        } catch (error) {
            console.error('Failed to load groups:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinGroup = async (groupId: string) => {
        try {
            await groupsApi.addMember(groupId, user._id);
            loadGroups();
        } catch (error) {
            console.error('Failed to join group:', error);
        }
    };

    const handleLeaveGroup = async (groupId: string) => {
        try {
            await groupsApi.leaveGroup(groupId, user._id);
            loadGroups();
        } catch (error) {
            console.error('Failed to leave group:', error);
        }
    };

    const filteredGroups = groups.filter(group =>
        group.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const tabs = [
        { id: 'all', label: 'Tất cả nhóm', count: groups.length },
        { id: 'my', label: 'Nhóm của tôi', count: myGroups.length },
        { id: 'joined', label: 'Đã tham gia', count: myGroups.filter(g => g.members?.includes(user._id)).length }
    ];

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
            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Nhóm</h1>
                        <Button className="flex items-center gap-2">
                            <Plus size={20} />
                            Tạo nhóm
                        </Button>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm nhóm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex space-x-1 mb-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeTab === 'all' && filteredGroups.map((group) => (
                            <div key={group._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                            <Users size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{group.name}</h3>
                                            <p className="text-sm text-gray-500">{group.members?.length || 0} thành viên</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {group.description || 'Không có mô tả'}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        {group.privacy === 'public' ? (
                                            <Globe size={16} />
                                        ) : (
                                            <Lock size={16} />
                                        )}
                                        <span>{group.privacy === 'public' ? 'Công khai' : 'Riêng tư'}</span>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            <MessageCircle size={16} />
                                        </Button>
                                        <Button 
                                            size="sm"
                                            onClick={() => handleJoinGroup(group._id)}
                                        >
                                            Tham gia
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {activeTab === 'my' && myGroups.map((group) => (
                            <div key={group._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                                            <Users size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{group.name}</h3>
                                            <p className="text-sm text-gray-500">{group.members?.length || 0} thành viên</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <Settings size={20} />
                                    </button>
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {group.description || 'Không có mô tả'}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar size={16} />
                                        <span>Tạo {new Date(group.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            <MessageCircle size={16} />
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleLeaveGroup(group._id)}
                                        >
                                            Rời nhóm
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {activeTab === 'joined' && myGroups.filter(g => g.members?.includes(user._id)).map((group) => (
                            <div key={group._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                            <Users size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{group.name}</h3>
                                            <p className="text-sm text-gray-500">{group.members?.length || 0} thành viên</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {group.description || 'Không có mô tả'}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar size={16} />
                                        <span>Tham gia {new Date(group.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            <MessageCircle size={16} />
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleLeaveGroup(group._id)}
                                        >
                                            Rời nhóm
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredGroups.length === 0 && (
                        <div className="text-center py-12">
                            <Users size={48} className="text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {searchQuery ? 'Không tìm thấy nhóm nào' : 'Chưa có nhóm nào'}
                            </h3>
                            <p className="text-gray-500">
                                {searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Hãy tạo nhóm đầu tiên hoặc tham gia nhóm khác!'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
