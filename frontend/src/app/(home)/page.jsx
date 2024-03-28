"use client"
import {React, useState, useEffect} from 'react'
import RecentBattles from '../../components/recent-battles/recent-battles'
import Explore from '../../components/explore/explore'
import {Plus} from "lucide-react"
import { Button } from '../../components/ui/button'
import MyPokemons from '../../components/my pokemons/my-pokemons'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { useRouter } from 'next/navigation'

const page = ({children}) => {
  
  const storedUserId = localStorage.getItem('userId');

  const router = useRouter()
  const onAddPokemonHandle =() => {
    router.push("/pokemons")
  }

  useEffect(() => {
    if (!storedUserId) {
      router.push('/login')
    }
  
  }, [storedUserId])
  

  return (
      <>
        <main className="container p-4 flex-1">
        {/* {id && (
        <div>
          <p>id: {id}</p>
        </div>
      )} */}
        <div className="grid gap-4 md:grid-rows-2 md:gap-4 lg:grid-rows-1">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-4">
          <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Recent Battles</CardTitle>
                    </CardHeader>
                      <CardContent className="p-0">
                          <RecentBattles Trainer={"Ash"} timeBattle={"5m ago"}/>
                    </CardContent>
          </Card>
          </div>
          <div className="grid gap-4">
          <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Explore</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                  <Explore cityname={"Viridan CIty"}/>
                  <Explore cityname={"Route 2"}/>
                  </CardContent>
          </Card>
          </div>
              </div>  
              <div className="grid gap-4">
            <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">My Pokemons</CardTitle>
                    
                  </CardHeader>
                  
                  <CardContent className="p-0">
                  <MyPokemons pokeImg="/pngegg.png"/>
                  
                  </CardContent>

            </Card>
            <Button variant="default" onClick={onAddPokemonHandle}> 
            <Plus />Add Pokemon</Button>
            </div>

            </div>

      
        </main>
      </>
  )
}

export default page