"use client";
import { useState, useEffect } from 'react';
import { userApi } from '@/lib/api';
import useAuthStore from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Lock,
  Eye,
  EyeOff,
  Save,
  Upload,
  Trash2
} from 'lucide-react';

export default function SettingsPage() {
    const { user, logout } = useAuthStore();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    // Profile settings
    const [profileData, setProfileData] = useState({
        userName: user?.userName || '',
        email: user?.email || '',
        bio: user?.bio || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Notification settings
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        friendRequests: true,
        comments: true,
        likes: true,
        shares: true
    });

    // Privacy settings
    const [privacySettings, setPrivacySettings] = useState({
        profileVisibility: 'public',
        showEmail: false,
        showOnlineStatus: true,
        allowFriendRequests: true,
        allowMessages: 'everyone'
    });

    const tabs = [
        { id: 'profile', label: 'Hồ sơ', icon: User },
        { id: 'notifications', label: 'Thông báo', icon: Bell },
        { id: 'privacy', label: 'Quyền riêng tư', icon: Shield },
        { id: 'appearance', label: 'Giao diện', icon: Palette },
        { id: 'account', label: 'Tài khoản', icon: Lock }
    ];

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?._id) return;

        try {
            setLoading(true);
            
            if (profileData.userName !== user.userName) {
                await userApi.updateUserName(user._id, profileData.userName);
            }
            
            if (profileData.bio !== user.bio) {
                await userApi.updateBio(user._id, profileData.bio);
            }

            // Handle password change if provided
            if (profileData.newPassword && profileData.confirmPassword) {
                if (profileData.newPassword !== profileData.confirmPassword) {
                    alert('Mật khẩu xác nhận không khớp');
                    return;
                }
            }

            alert('Cập nhật thành công!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Cập nhật thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user?._id) return;

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('avatar', file);
            await userApi.updateAvatar(user._id, formData);
            alert('Cập nhật ảnh đại diện thành công!');
        } catch (error) {
            console.error('Failed to update avatar:', error);
            alert('Cập nhật ảnh đại diện thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = () => {
        if (confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.')) {
            logout();
        }
    };

    const renderProfileTab = () => (
        <div className="space-y-6">
            <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User size={48} className="text-gray-400" />
                </div>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    id="avatar-upload"
                />
                <label
                    htmlFor="avatar-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
                >
                    <Upload size={16} />
                    Thay đổi ảnh đại diện
                </label>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên người dùng
                    </label>
                    <input
                        type="text"
                        value={profileData.userName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, userName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giới thiệu bản thân
                    </label>
                    <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Viết một chút về bản thân..."
                    />
                </div>

                <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thay đổi mật khẩu</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu hiện tại
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={profileData.currentPassword}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu mới
                            </label>
                            <input
                                type="password"
                                value={profileData.newPassword}
                                onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Xác nhận mật khẩu mới
                            </label>
                            <input
                                type="password"
                                value={profileData.confirmPassword}
                                onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                    <Save size={16} className="mr-2" />
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
            </form>
        </div>
    );

    const renderNotificationsTab = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Cài đặt thông báo</h3>
            
            <div className="space-y-4">
                {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">
                                {key === 'emailNotifications' && 'Thông báo email'}
                                {key === 'pushNotifications' && 'Thông báo đẩy'}
                                {key === 'friendRequests' && 'Lời mời kết bạn'}
                                {key === 'comments' && 'Bình luận'}
                                {key === 'likes' && 'Thích'}
                                {key === 'shares' && 'Chia sẻ'}
                            </h4>
                            <p className="text-sm text-gray-500">
                                {key === 'emailNotifications' && 'Nhận thông báo qua email'}
                                {key === 'pushNotifications' && 'Nhận thông báo trên trình duyệt'}
                                {key === 'friendRequests' && 'Thông báo khi có lời mời kết bạn'}
                                {key === 'comments' && 'Thông báo khi có bình luận mới'}
                                {key === 'likes' && 'Thông báo khi có người thích bài viết'}
                                {key === 'shares' && 'Thông báo khi có người chia sẻ bài viết'}
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => setNotificationSettings(prev => ({
                                    ...prev,
                                    [key]: e.target.checked
                                }))}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPrivacyTab = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Cài đặt quyền riêng tư</h3>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hiển thị hồ sơ
                    </label>
                    <select
                        value={privacySettings.profileVisibility}
                        onChange={(e) => setPrivacySettings(prev => ({
                            ...prev,
                            profileVisibility: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                        <option value="public">Công khai</option>
                        <option value="friends">Chỉ bạn bè</option>
                        <option value="private">Riêng tư</option>
                    </select>
                </div>

                <div className="space-y-4">
                    {Object.entries(privacySettings).slice(1).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                                <h4 className="font-medium text-gray-900">
                                    {key === 'showEmail' && 'Hiển thị email'}
                                    {key === 'showOnlineStatus' && 'Hiển thị trạng thái online'}
                                    {key === 'allowFriendRequests' && 'Cho phép lời mời kết bạn'}
                                    {key === 'allowMessages' && 'Cho phép tin nhắn'}
                                </h4>
                                <p className="text-sm text-gray-500">
                                    {key === 'showEmail' && 'Hiển thị địa chỉ email trong hồ sơ'}
                                    {key === 'showOnlineStatus' && 'Hiển thị khi bạn đang online'}
                                    {key === 'allowFriendRequests' && 'Cho phép người khác gửi lời mời kết bạn'}
                                    {key === 'allowMessages' && 'Cho phép ai có thể gửi tin nhắn cho bạn'}
                                </p>
                            </div>
                            {key === 'allowMessages' ? (
                                <select
                                    value={value as string}
                                    onChange={(e) => setPrivacySettings(prev => ({
                                        ...prev,
                                        [key]: e.target.value
                                    }))}
                                    className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                >
                                    <option value="everyone">Mọi người</option>
                                    <option value="friends">Chỉ bạn bè</option>
                                    <option value="none">Không ai</option>
                                </select>
                            ) : (
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={value as boolean}
                                        onChange={(e) => setPrivacySettings(prev => ({
                                            ...prev,
                                            [key]: e.target.checked
                                        }))}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderAccountTab = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Quản lý tài khoản</h3>
            
            <div className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <h4 className="font-medium text-red-900 mb-2">Vùng nguy hiểm</h4>
                    <p className="text-sm text-red-700 mb-4">
                        Xóa tài khoản sẽ xóa vĩnh viễn tất cả dữ liệu của bạn. Hành động này không thể hoàn tác.
                    </p>
                    <Button
                        variant="outline"
                        onClick={handleDeleteAccount}
                        className="text-red-600 border-red-300 hover:bg-red-100"
                    >
                        <Trash2 size={16} className="mr-2" />
                        Xóa tài khoản
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="flex">
                        {/* Sidebar */}
                        <div className="w-64 border-r border-gray-200 p-6">
                            <h1 className="text-xl font-bold text-gray-900 mb-6">Cài đặt</h1>
                            <nav className="space-y-2">
                                {tabs.map((tab) => {
                                    const IconComponent = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                                                activeTab === tab.id
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            <IconComponent size={20} />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6">
                            {activeTab === 'profile' && renderProfileTab()}
                            {activeTab === 'notifications' && renderNotificationsTab()}
                            {activeTab === 'privacy' && renderPrivacyTab()}
                            {activeTab === 'appearance' && (
                                <div className="text-center py-12">
                                    <Palette size={48} className="text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Cài đặt giao diện</h3>
                                    <p className="text-gray-500">Tính năng đang phát triển</p>
                                </div>
                            )}
                            {activeTab === 'account' && renderAccountTab()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
