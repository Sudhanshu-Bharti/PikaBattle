"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image'
import { Button } from "../ui/button"
import axios from "axios"
const MyPokemons = ({pokeImg}) => {
    const [pokemonNames, setPokemonNames] = useState([]);
    const [img , setImg] = useState([])
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get("/pokesprite/data/legacy/dex.json");
            const names = response.data.map(pkmn => pkmn.slug.eng)
            setPokemonNames(names.slice(0,30));
          } catch (error) {
            console.error("Error fetching data: ", error);
          }
        const fetchImg = async () => {
            try {
                const response = await axios.get("/pokesprite/")
            } catch (error) {
                console.log(error);
            }
        }

        };
      
        fetchData();
      }, []);
  return (
    <div>

                    <ul className="divide-y">
                        <div className='p-2'>
                        {pokemonNames.map((name, index) => (
                        <Button variant="icon" key={index}>
                             <Image src={`/pokesprite/icons/pokemon/regular/${name}.png`} width="40" height="40" />
                             </Button>
                     ))} 
                        </div>
                    </ul>

  </div>
  )
}

export default MyPokemons