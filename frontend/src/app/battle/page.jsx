"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Progress } from "../../components/ui/progress";
import { useSocket } from "../Context/SocketContext";

const Page = () => {
  const router = useRouter();
  const socketRef = useRef(null);
  const storedUserId = localStorage.getItem('userId');
  const socket = useSocket();
  const [matchmakingComplete, setMatchmakingComplete] = useState(false);

  useEffect(() => {
    if (!storedUserId) {
      router.push('/login');
    }
  }, [storedUserId, router]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setMatchmakingComplete(true);
  //   }, 30000);

  //   return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    if (socket) {
      socketRef.current = socket;
      if (socket.connected) {
        console.log("Socket connected.");
        socket.emit('addUser', { playerId: storedUserId, username: 'soham' });
      } else {
        console.log("Socket not connected. reconnecting");
        socket.connect(); // Attempt to reconnect
      }
      // Listen for battle-started event
      socket.on('battle-started', (res) => {
        // console.log(res);
        setMatchmakingComplete(true);
      });
    }
  }, [socket, storedUserId]);

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