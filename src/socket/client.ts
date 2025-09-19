import { io, Socket } from 'socket.io-client'
import { config } from '@/lib/config'
import type { SocketEvents } from '@/types'

// Tạo socket instance duy nhất
const socket: Socket<SocketEvents> = io(config.socketUrl, {
    transports: ['websocket'],
    withCredentials: true,
    autoConnect: true, // Tự động kết nối
    timeout: 20000,
    forceNew: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
})

export function getSocket(): Socket<SocketEvents> {
    return socket
}

export function connectSocket(userID: string): Socket<SocketEvents> {
    const socketInstance = getSocket()

    // setup listeners một lần
    if (!socketInstance.hasListeners('connect')) {
        socketInstance.on('connect', () => {
            console.log('Socket connected:', socketInstance.id)
            console.log('Socket transport:', socketInstance.io.engine.transport.name)
        })

        socketInstance.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason)
        })

        socketInstance.on('connect_error', (error) => {
            console.error('Socket connection error:', error)
        })

        socketInstance.on('error' as any, (error: any) => {
            console.error('Socket error:', error)
        })

        // Debug: Log tất cả events được emit
        socketInstance.onAny((eventName, ...args) => {
            console.log('Socket event received:', eventName, args)
        })
    }

    // Kết nối nếu chưa connected
    if (!socketInstance.connected) {
        console.log('Connecting socket for user:', userID)
        socketInstance.connect()
    }

    // Emit connection event sau khi kết nối
    if (socketInstance.connected) {
        console.log('Socket already connected, emitting connection event')
        socketInstance.emit('connection', { data: { userID } } as any)
    } else {
        // Nếu chưa connected, đợi event connect
        socketInstance.once('connect', () => {
            socketInstance.emit('connection', { data: { userID } } as any)
        })
    }

    return socketInstance
}

export function disconnectSocket(): void {
    if (socket && socket.connected) {
        console.log('Disconnecting socket')
        socket.disconnect()
    }
}

export function resetSocket(): void {
    if (socket) {
        console.log('Resetting socket')
        socket.disconnect()

    }
}

export const socketEvents = {
    connect: (userID: string) => connectSocket(userID),
    disconnect: () => disconnectSocket(),

    joinChatRoom: (roomID: string) => {
        const socket = getSocket()
        socket.emit('joinChatRoom', roomID)
    },

    joinChatRooms: (roomIDs: string[]) => {
        const socket = getSocket()
        socket.emit('joinChatRooms', roomIDs)
    },

    exitRooms: (roomIDs: string[]) => {
        const socket = getSocket()
        socket.emit('exitRooms', roomIDs)
    },

    sendMessage: (data: any) => {
        const socket = getSocket()
        socket.emit('convention', data)
    },

    messageStored: (data: any) => {
        const socket = getSocket()
        socket.emit('conventionStored', data)
    },

    reactToPost: (data: { type: string; targetID: string; status: boolean }) => {
        const socket = getSocket()
        socket.emit('reaction', data)
    },

    updateCommentCount: (data: { postID: string; number: number }) => {
        const socket = getSocket()
        socket.emit('comment_count', data)
    },

    makeCall: (data: any) => {
        const socket = getSocket()
        socket.emit('call', data)
    },

    createPost: (data: any) => {
        const socket = getSocket()
        console.log('Socket createPost - connected:', socket.connected)
        console.log('Socket createPost - emitting data:', data)
        socket.emit('createPost', data)
    }
}

export default getSocket;


