import React from 'react'
import Image from 'next/image'
import { Button } from "../ui/button"
const MyPokemons = ({pokeImg}) => {
  return (
    <div>
         <ul className="divide-y">
                <li className="flex items-center justify-between p-3">
                    <Button size="icon" variant="outline">
                    <Image src={pokeImg} width="25" height="25"/>
                    </Button>
                </li>
        </ul>
  </div>
  )
}

export default MyPokemons