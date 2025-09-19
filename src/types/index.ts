export const MESSAGE_TYPE = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  NOTIFY: 'NOTIFY',
  POLL: 'POLL'
} as const

export const FRIEND_STATUS = {
  NONE: 'NONE',
  PENDING: 'PENDING',
  ACCEPTING: 'ACCEPTING',
  REFUSING: 'REFUSING',
  CANCELING: 'CANCELING',
  FRIEND: 'FRIEND'
} as const

export const SCOPE = {
  PUBLIC: 'PUBLIC',
  FRIEND: 'FRIEND',
  PRIVATE: 'PRIVATE',
  OWNER: 'OWNER'
} as const

export const POST_STATUS = {
  ACTIVE: 'ACTIVE',
  TRASH: 'TRASH',
  DELETE: 'DELETE'
} as const

export const POST_TYPE = {
  PERSONAL: 'PERSONAL',
  SHARE: 'SHARE',
  GROUP: 'GROUP'
} as const

export const NOTIFICATION_TYPE = {
  POST_REACTION: 'POST_REACTION',
  POST_COMMENT: 'POST_COMMENT',
  POST_TAG: 'POST_TAG',
  COMMENT_REACTION: 'COMMENT_REACTION',
  COMMENT_REPLY: 'COMMENT_REPLY',
  COMMENT_TAG: 'COMMENT_TAG',
  FRIEND_REQUEST: 'FRIEND_REQUEST',
  FRIEND_ACCEPT: 'FRIEND_ACCEPT',
  GROUP_REQUEST: 'GROUP_REQUEST',
  GROUP_ACCEPT: 'GROUP_ACCEPT'
} as const
export interface User {
  _id: string
  userName: string
  searchName: string
  email: string
  phone?: string
  avatar?: string
  bio?: string
  background?: string
  followerNum: number
  followingNum: number
  sex?: boolean
  age?: number
  active: boolean
  fcmToken?: string
  createdAt: string
  updatedAt: string
}

export interface Post {
  _id: string
  childrenID?: string
  groupID?: string
  userID: string
  userName?: string
  avatar?: string
  type: keyof typeof POST_TYPE
  attachments: PostAttachment[]
  content: string
  scope: keyof typeof SCOPE
  status: keyof typeof POST_STATUS
  sharesCount?: number
  reactionsCount: number
  commentsCount: number
  pollID?: string
  labels: string[]
  transLabels: string[]
  detectText: string
  createdAt: string
  updatedAt: string
}

export interface PostAttachment {
  type: string
  url: string
  thumbnail?: string
  size?: number
  duration?: number // for videos
}

export interface Comment {
  _id: string
  postID: string
  userID: string
  userName: string
  avatar?: string
  content: string
  parentID?: string // for replies
  reactionsCount: number
  createdAt: string
  updatedAt: string
}

export interface Reaction {
  _id: string
  userID: string
  targetID: string
  type: 'POST' | 'COMMENT'
  emoji: string
  createdAt: string
}

export interface Convention {
  _id: string
  type: 'private' | 'group'
  uids: string[]
  members: ConventionMember[]
  avatar?: string
  name?: string
  data: ChatMessage[]
  createdAt: string
  updatedAt: string
}

export interface ConventionMember {
  _id: string
  userID: string
  userName: string
  avatar?: string
  aka?: string
  role?: 'ADMIN' | 'CENSOR' | 'MEMBER'
  status: 'ACTIVE' | 'INACTIVE'
  notify: 'ALLOW' | 'NOT_ALLOW' | 'CUSTOM'
}

export interface ChatMessage {
  _id: string
  senderID: string
  senderName: string
  senderAvatar?: string
  type: keyof typeof MESSAGE_TYPE
  content: string
  attachments?: PostAttachment[]
  pollID?: string
  action?: 'EDIT' | 'REMOVE' | 'DELETE'
  createdAt: string
  updatedAt: string
}

export interface Friend {
  _id: string
  userID: string
  friendID: string
  status: keyof typeof FRIEND_STATUS
  createdAt: string
  updatedAt: string
}

export interface Notification {
  _id: string
  ownerID: string
  senderID: string
  senderName: string
  senderAvatar?: string
  type: keyof typeof NOTIFICATION_TYPE
  targetID: string
  content: string
  read: boolean
  createdAt: string
}

export interface Group {
  _id: string
  name: string
  description?: string
  avatar?: string
  ownerID: string
  memberCount: number
  createdAt: string
  updatedAt: string
}

// API Response Types
export interface ApiResponse<T> {
  state: 'SUCCESS' | 'ERROR'
  message?: string
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// Socket Event Types
export interface SocketEvents {
  connection: (data: { data: { userID: string } }) => void
  disconnect: () => void
  convention: (data: ChatMessage) => void
  conventionStored: (conventionID: string) => void
  emitAddPost: (data: { post: Post }) => void
  emitEditPost: (data: { post: Post }) => void
  emitRemovePost: (data: { postID: string }) => void
  emitReactionPostChange: (data: { post: Post }) => void
  emitCommentPostChange: (data: { post: Post }) => void
  emitAddComment: (data: { postID: string; comment: Comment }) => void
  emitEditComment: (data: { postID: string; comment: Comment }) => void
  emitDeleteComment: (data: { postID: string; commentID: string }) => void
  friendActive: (data: { userID: string; active: boolean; updatedAt: Date }) => void
  joinChatRoom: (roomID: string) => void
  joinChatRooms: (roomIDs: string[]) => void
  exitRooms: (roomIDs: string[]) => void
  reaction: (data: { type: string; targetID: string; status: boolean }) => void
  comment_count: (data: { postID: string; number: number }) => void
  call: (data: any) => void
  POSTreaction: (data: { postID: string; userID: string; userName: string }) => void
  createPost: (data: any) => void
  'post:success': (data: { message: string; post: Post }) => void
  'post:error': (data: { message: string }) => void
  postCreated: (data: Post) => void
}

// Form Types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  userName: string
  email: string
  password: string
  confirmPassword: string
}

export interface CreatePostForm {
  content: string
  attachments?: File[]
  scope: keyof typeof SCOPE
  groupID?: string
}

export interface UpdateProfileForm {
  userName?: string
  bio?: string
  avatar?: File
  background?: File
}
