export const qk = {
    user: (id?: string) => ['user', id] as const,
    users: ['users', 'all'] as const,
    posts: {
        newfeed: (userID?: string) => ['posts', 'newfeed', userID] as const,
        byId: (id?: string) => ['post', id] as const,
    },
    comments: (postID?: string) => ['comments', postID] as const,
    search: {
        posts: (userID?: string, q?: string) => ['search', 'posts', userID, q] as const,
        users: (userID?: string, q?: string) => ['search', 'users', userID, q] as const,
        groups: (userID?: string, q?: string) => ['search', 'groups', userID, q] as const,
        history: (userID?: string) => ['search', 'history', userID] as const,
    },
    friends: {
        list: (userID?: string) => ['friends', userID] as const,
        suggest: (userID?: string) => ['friends', 'suggest', userID] as const,
        accepting: (userID?: string) => ['friends', 'accepting', userID] as const,
        pending: (userID?: string) => ['friends', 'pending', userID] as const,
    },
    groups: {
        all: ['groups', 'all'] as const,
        byUser: (userID?: string) => ['groups', 'user', userID] as const,
        byId: (groupID?: string) => ['group', groupID] as const,
        posts: (groupID?: string) => ['group', groupID, 'posts'] as const,
        members: (groupID?: string) => ['group', groupID, 'members'] as const,
    },
    reactions: (targetID?: string) => ['reactions', targetID] as const,
    reactionOfUser: (targetID?: string, userID?: string) => ['reactions', targetID, userID] as const,
    notifications: (userID?: string) => ['notifications', userID] as const,
    poll: (pollID?: string) => ['poll', pollID] as const,
    resources: {
        convention: (id?: string) => ['resources', 'convention', id] as const,
        group: (groupID?: string, type: string = 'image') => ['resources', 'group', groupID, type] as const,
    },
}


