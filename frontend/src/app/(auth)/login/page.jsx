"use client"
import React, { useState } from 'react'
import {Label} from "../../../components/ui/label"
import {Input} from "../../../components/ui/input"
import {Button} from "../../../components/ui/button"

const Page = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const data = await response.json();
      window.location.href="/"
    } else {
      console.log(error);
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
        </div>
      </div>
    </div>
  )
}

export default Page;