// Application Constants
// Based on SocialApp and SocialServer constants

// ===== API CONSTANTS =====
export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8080',
    TIMEOUT: 10000,
};

// ===== MESSAGE TYPES =====
export const MESSAGE_TYPE = {
    TEXT: 'TEXT',
    IMAGE: 'IMAGE',
    VIDEO: 'VIDEO',
    NOTIFY: 'NOTIFY',
    POLL: 'POLL',
    MIX: 'MIX',
} as const;

// ===== MESSAGE ACTIONS =====
export const MESSAGE_ACTION = {
    ADD: 'ADD',
    EDIT: 'EDIT',
    REMOVE: 'REMOVE',
    DELETE: 'DELETE',
} as const;

// ===== POST TYPES =====
export const POST_TYPE = {
    PERSONAL: 'PERSONAL',
    SHARE: 'SHARE',
    GROUP: 'GROUP',
} as const;

// ===== POST SCOPE =====
export const POST_SCOPE = {
    PUBLIC: 'PUBLIC',
    FRIEND: 'FRIEND',
    PRIVATE: 'PRIVATE',
    OWNER: 'OWNER',
} as const;

// ===== POST STATUS =====
export const POST_STATUS = {
    ACTIVE: 'ACTIVE',
    TRASH: 'TRASH',
    DELETE: 'DELETE',
} as const;

// ===== POST ATTACHMENTS =====
export const POST_ATTACHMENT = {
    TEXT: 'TEXT',
    IMAGE: 'image/jpeg',
    VIDEO: 'video/mp4',
    NOTIFY: 'NOTIFY',
    MIX: 'MIX',
} as const;

// ===== FRIEND STATUS =====
export const FRIEND_STATUS = {
    NONE: 'NONE',
    PENDING: 'PENDING',
    ACCEPTING: 'ACCEPTING',
    REFUSING: 'REFUSING',
    CANCELING: 'CANCELING',
    FRIEND: 'FRIEND',
} as const;

// ===== MEMBER ROLE =====
export const MEMBER_ROLE = {
    ADMIN: 'ADMIN',
    CENSOR: 'CENSOR',
    MEMBER: 'MEMBER',
} as const;

// ===== MEMBER STATUS =====
export const MEMBER_STATUS = {
    PENDING: 'PENDING',
    BLOCK: 'BLOCK',
    ACCEPT: 'ACCEPT',
} as const;

// ===== RESPONSE STATUS =====
export const RESPONSE_STATUS = {
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
} as const;

// ===== REACTION TYPES =====
export const REACTION_TYPE = {
    LIKE: 'LIKE',
    LOVE: 'LOVE',
    HAHA: 'HAHA',
    WOW: 'WOW',
    SAD: 'SAD',
    ANGRY: 'ANGRY',
} as const;

// ===== NOTIFICATION TYPES =====
export const NOTIFICATION_TYPE = {
    FRIEND_REQUEST: 'FRIEND_REQUEST',
    POST_LIKE: 'POST_LIKE',
    POST_COMMENT: 'POST_COMMENT',
    GROUP_INVITE: 'GROUP_INVITE',
    GROUP_UPDATE: 'GROUP_UPDATE',
} as const;

// ===== UI CONSTANTS =====
export const UI_CONFIG = {
    POSTS_PER_PAGE: 10,
    COMMENTS_PER_PAGE: 20,
    SEARCH_DEBOUNCE: 300,
    IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
    VIDEO_MAX_SIZE: 50 * 1024 * 1024, // 50MB
};

// ===== ROUTES =====
export const ROUTES = {
    HOME: '/home',
    LOGIN: '/login',
    REGISTER: '/register',
    PROFILE: '/profile',
    FRIENDS: '/friends',
    GROUPS: '/groups',
    SEARCH: '/search',
    SETTINGS: '/settings',
} as const;

// ===== STORAGE KEYS =====
export const STORAGE_KEYS = {
    SESSION: 'session',
    AUTH_TOKEN: 'auth_token',
    USER_PREFERENCES: 'user_preferences',
    THEME: 'theme',
} as const;

// ===== THEME =====
export const THEME = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
} as const;

// ===== FILE TYPES =====
export const FILE_TYPES = {
    IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    VIDEO: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'],
    DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const;
