"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Progress } from "../../components/ui/progress";
import { useSocket, useRoom } from "../Context/SocketContext";

const Page = () => {
  const router = useRouter();
  const { room, setRoom } = useRoom();
  const { socket } = useSocket();
  
  const [storedUserId, setStoredUserId] = useState(null);
  const [matchmakingComplete, setMatchmakingComplete] = useState(false);

  // Get userId from localStorage only on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('userId');
      setStoredUserId(userId);
    }
  }, []);

  // Redirect to login if no stored user ID is found
  // useEffect(() => {
  //   if (!storedUserId) {
  //     router.push('/login');
  //   }
  // }, [storedUserId, router,setStoredUserId]);

  // Socket events
  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log("Connected to Server");
        socket.emit('addUser', { playerId: storedUserId, username: 'soham' });
      });

      socket.on('battle-started', (res) => {
        setRoom(res.room);
        sessionStorage.setItem('room', res.room);
        console.log(res);
        console.log(socket);
        setMatchmakingComplete(true);
      });

      return () => {
        socket.off('connect');
        socket.off('battle-started');
      };
    }
  }, [socket, storedUserId, setRoom]);

  // Redirect to match page when matchmaking is complete
  useEffect(() => {
    if (matchmakingComplete) {
      router.push('/battle/match');
    }
  }, [matchmakingComplete, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center relative">
      <img
        className="absolute inset-0 z-0 object-cover w-full h-full"
        src="/pokemon-battle.jpg"
        alt="Background"
      />
      <div className="relative z-10">
        <div className="w-full max-w-sm space-y-2">
          <div className="text-4xl font-bold text-black">Matchmaking in Queue...</div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="font-semibold">Finding a match</span>
          </div>
          <Progress className="h-4 w-96" value={45} />
        </div>
      </div>
    </div>
  );
};

export default Page;
