"use client"
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '@/redux/store'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function AppProviders({ children }: { children: React.ReactNode }) {
	return (
		<ErrorBoundary>
			<ReduxProvider store={store}>
				{children}
			</ReduxProvider>
		</ErrorBoundary>
	)
}
