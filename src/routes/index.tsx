"use client"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'

function Placeholder({ title }: { title: string }) {
	return (
		<div style={{ padding: 24 }}>
			<h1>{title}</h1>
			<p>Coming soon.</p>
		</div>
	)
}

export default function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Placeholder title="Home Feed" />} />
				<Route path="/post/:id" element={<Placeholder title="Post Detail" />} />
				<Route path="/profile/:userId" element={<Placeholder title="Profile" />} />
				<Route path="/friends" element={<Placeholder title="Friends" />} />
				<Route path="/groups" element={<Placeholder title="Groups" />} />
				<Route path="/groups/:groupId" element={<Placeholder title="Group Detail" />} />
				<Route path="/chat" element={<Placeholder title="Chat" />} />
				<Route path="/chat/:conventionId" element={<Placeholder title="Chat Room" />} />
				<Route path="/search" element={<Placeholder title="Search" />} />
				<Route path="/notifications" element={<Placeholder title="Notifications" />} />
				<Route path="/settings" element={<Placeholder title="Settings" />} />
				<Route path="*" element={<Placeholder title="Not Found" />} />
			</Routes>
		</BrowserRouter>
	)
}


