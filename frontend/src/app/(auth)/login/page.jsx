"use client"
import React, { useState } from 'react'
import {Label} from "../../../components/ui/label"
import {Input} from "../../../components/ui/input"
import {Button} from "../../../components/ui/button"
import Link from "next/link";
import axios from "axios"

const Page = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [id, setID] = useState('');

   const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:4000/login', { username, password });
      const { accessToken, user } = response.data;
      setID(user._id);
      localStorage.setItem('userId', user._id);
      localStorage.setItem('username', user.username)
      console.log('User logged in:', user.username);
      window.location.href="/"
    } catch (error) {
      console.error('Login failed: ', error);
    }
  };

  return (
    <div className="flex items-center min-h-screen px-4 w-full mx-auto justify-center py-6">
      <div className="w-full max-w-sm space-y-4">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-gray-500 dark:text-gray-400">Enter your Credentials</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Username</Label>
            <Input id="email" placeholder="abcd1234" required type="text" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" required type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <Button className="w-full" onClick={handleLogin}>Login</Button>
          <span className='text-sm'>Not Registered? <Button variant="link"><Link  className='hover:text-orange-400' href= "/register">Register</Link></Button> </span>
        </div>
      </div>
    </div>
  )
}

export default Page;