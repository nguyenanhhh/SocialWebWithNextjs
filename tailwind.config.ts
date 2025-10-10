import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./src/app/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}',
		'./src/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				primary: {
					DEFAULT: '#1877F2',
					hover: '#166FE5',
					dark: '#0D47A1',
				},
				success: '#42B72A',
				warning: '#F7B928',
				danger: '#FA383E',
				info: '#1877F2',
				text: {
					primary: '#050505',
					secondary: '#65676B',
					tertiary: '#8E8E93',
				},
				bg: {
					primary: '#FFFFFF',
					secondary: '#F0F2F5',
					tertiary: '#E4E6EB',
				},
				border: {
					primary: '#DADDE1',
					secondary: '#E4E6EB',
				},
			},
			boxShadow: {
				'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
				'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
			},
			keyframes: {
				slideInRight: {
					'0%': { transform: 'translateX(100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' },
				},
			},
			animation: {
				slideInRight: 'slideInRight 0.3s ease-out',
			},
		},
	},
	plugins: [],
}
export default config
