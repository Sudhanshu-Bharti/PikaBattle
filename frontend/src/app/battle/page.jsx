"use client"
import React, { useEffect, useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import {Progress} from "../../components/ui/progress"

const page = () => {
    const router = useRouter()

    const [matchmakingComplete , setMatchmakingComplete] = useState(false)
        useEffect(() => {
          const timer = setTimeout(()=> {
            setMatchmakingComplete(true)
          }, 30000000)

          return () => clearTimeout(timer)
        }, [])

        useEffect(() => {
          if (matchmakingComplete) {
            router.push('/battle/match')
          }

    }, [matchmakingComplete])


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
  )
}

export default page