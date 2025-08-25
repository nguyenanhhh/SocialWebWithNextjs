import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                userName: { label: "Username", type: "text" },
                action: { label: "Action", type: "text" },
            },
            async authorize(credentials) {
                try {
                    if (credentials?.action === 'register') {
                        // Handle registration
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                email: credentials.email,
                                password: credentials.password,
                                userName: credentials.userName,
                            }),
                        });

                        if (response.ok) {
                            const user = await response.json();
                            return {
                                id: user.id || user.userId,
                                email: user.email,
                                name: user.userName || user.name,
                                image: user.profileImage,
                            };
                        }
                        return null;
                    } else {
                        // Handle login
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                email: credentials.email,
                                password: credentials.password,
                            }),
                        });

                        if (response.ok) {
                            const user = await response.json();
                            return {
                                id: user.id || user.userId,
                                email: user.email,
                                name: user.userName || user.name,
                                image: user.profileImage,
                            };
                        }
                        return null;
                    }
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: '/auth/login',
        signUp: '/auth/register',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
});
