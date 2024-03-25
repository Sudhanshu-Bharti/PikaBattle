"use client"
import {React, useState} from 'react'
import {Label} from "../../../components/ui/label"
import {Input} from "../../../components/ui/input"
import {Button} from "../../../components/ui/button"
import axios from 'axios';

const page = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:4000/register', { username, password }); 
          window.location.href = '/login';
            console.log(response.data);

        } catch (error) {
          console.error('Registration failed:', error.message); 
        }
      };

  return (
    <div className="flex items-center min-h-screen px-4 w-full mx-auto justify-center py-6">
      <div className="w-full max-w-sm space-y-4">
        <form onSubmit={handleSubmit}>
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Register</h1>
            <p className="text-gray-500 dark:text-gray-400">Enter your Credentials</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="abcd1234" required type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button className="w-full" type="submit">Register</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default page