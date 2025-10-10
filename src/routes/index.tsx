"use client"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'
import HomePage from '@/app/page'
import ProfilePage from '@/app/profile/[userId]/page'
import FriendsPage from '@/app/friends/page'
import SearchPage from '@/app/search/page'
import GroupsPage from '@/app/groups/page'
import ChatPage from '@/app/chat/page'
import NotificationsPage from '@/app/notifications/page'
import SettingsPage from '@/app/settings/page'

function Placeholder({ title }: { title: string }) {
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center">
			<div className="text-center">
				<h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
				<p className="text-gray-600">Coming soon.</p>
			</div>
		</div>
	)
}

export default function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/post/:id" element={<Placeholder title="Post Detail" />} />
				<Route path="/profile/:userId" element={<ProfilePage />} />
				<Route path="/friends" element={<FriendsPage />} />
				<Route path="/groups" element={<GroupsPage />} />
				<Route path="/groups/:groupId" element={<Placeholder title="Group Detail" />} />
				<Route path="/chat" element={<ChatPage />} />
				<Route path="/chat/:conventionId" element={<Placeholder title="Chat Room" />} />
				<Route path="/search" element={<SearchPage />} />
				<Route path="/notifications" element={<NotificationsPage />} />
				<Route path="/settings" element={<SettingsPage />} />
				<Route path="*" element={<Placeholder title="Not Found" />} />
			</Routes>
		</BrowserRouter>
	)
}


