import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | null>(null)

type SocketProviderProps = {
    children: React.ReactNode;
    customerID?: string | null;
    salonID?: string | null;
    employeeID?: string | null;
}

export const SocketProvider = ({ children, customerID, salonID, employeeID }: SocketProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
        if (!customerID && !salonID && !employeeID) {
            console.warn('No IDs provided for socket connection');
            return;
        };
        console.log('Connecting to socket with:', { customerID, salonID, employeeID });
        const newSocket = io('http://192.168.1.2:3000', {
            transports: ['websocket'],
            query: {
                ...(customerID ? { customerID } : {}),
                ...(salonID ? { salonID } : {}),
                ...(employeeID ? { employeeID } : {})
            }
        });
        setSocket(newSocket);
        return () => {
            newSocket.disconnect();
            setSocket(null);
        }
    }, [customerID, salonID, employeeID])
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext)