import { create } from 'zustand'
import type { Post, Comment, Reaction } from '@/types'

interface PostsStoreState {
    posts: Post[]
    currentPost: Post | null
    loading: boolean
    error: string | null

    setPosts: (posts: Post[]) => void
    addPost: (post: Post) => void
    updatePost: (postId: string, updates: Partial<Post>) => void
    removePost: (postId: string) => void
    setCurrentPost: (post: Post | null) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    addReaction: (postId: string, reaction: Reaction) => void
    removeReaction: (postId: string, userId: string) => void
    updateReactionCount: (postId: string, delta: number) => void
    addComment: (postId: string, comment: Comment) => void
    updateComment: (postId: string, commentId: string, updates: Partial<Comment>) => void
    removeComment: (postId: string, commentId: string) => void
    updateCommentCount: (postId: string, delta: number) => void
}

export const usePostsStore = create<PostsStoreState>((set, get) => ({
    posts: [],
    currentPost: null,
    loading: false,
    error: null,

    setPosts: (posts) => set({ posts }),

    addPost: (post) => set((state) => ({
        posts: [post, ...state.posts]
    })),

    updatePost: (postId, updates) => set((state) => ({
        posts: state.posts.map(post =>
            post._id === postId ? { ...post, ...updates } : post
        ),
        currentPost: state.currentPost?._id === postId
            ? { ...state.currentPost, ...updates }
            : state.currentPost
    })),

    removePost: (postId) => set((state) => ({
        posts: state.posts.filter(post => post._id !== postId),
        currentPost: state.currentPost?._id === postId ? null : state.currentPost
    })),

    setCurrentPost: (post) => set({ currentPost: post }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    addReaction: (postId, reaction) => set((state) => ({
        posts: state.posts.map(post =>
            post._id === postId
                ? { ...post, reactionsCount: post.reactionsCount + 1 }
                : post
        )
    })),

    removeReaction: (postId, userId) => set((state) => ({
        posts: state.posts.map(post =>
            post._id === postId
                ? { ...post, reactionsCount: Math.max(0, post.reactionsCount - 1) }
                : post
        )
    })),

    updateReactionCount: (postId, delta) => set((state) => ({
        posts: state.posts.map(post =>
            post._id === postId
                ? { ...post, reactionsCount: Math.max(0, post.reactionsCount + delta) }
                : post
        )
    })),

    addComment: (postId, comment) => set((state) => ({
        posts: state.posts.map(post =>
            post._id === postId
                ? { ...post, commentsCount: post.commentsCount + 1 }
                : post
        )
    })),

    updateComment: (postId, commentId, updates) => {
       
    },

    removeComment: (postId, commentId) => set((state) => ({
        posts: state.posts.map(post =>
            post._id === postId
                ? { ...post, commentsCount: Math.max(0, post.commentsCount - 1) }
                : post
        )
    })),

    updateCommentCount: (postId, delta) => set((state) => ({
        posts: state.posts.map(post =>
            post._id === postId
                ? { ...post, commentsCount: Math.max(0, post.commentsCount + delta) }
                : post
        )
    }))
}))

export default usePostsStore
