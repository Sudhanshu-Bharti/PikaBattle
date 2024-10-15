"use client"
import React, { createContext, useContext, useState,useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();
const RoomContext = createContext();

export const useSocket = () => useContext(SocketContext);
export const useRoom = () => useContext(RoomContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{socket,setSocket}}>
      
        {children}
      
    </SocketContext.Provider>
  );
};

export const RoomProvider = ({ children }) => {
  const [room, setRoom] = useState(null);

  return (
    <RoomContext.Provider value={{ room, setRoom }}>
      {children}
    </RoomContext.Provider>
  );
};