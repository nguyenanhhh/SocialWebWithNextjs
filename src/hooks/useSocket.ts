import { useEffect } from 'react';
import { getSocket, connectSocket } from '@/socket/client';
import useAuthStore from '@/store/authStore';

export const useSocket = () => {
    const { user, isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated || !user?._id) {
            return;
        }
        const socket = connectSocket(user._id);

        return () => { };
    }, [isAuthenticated, user?._id]);

    return getSocket();
};

export default useSocket;
