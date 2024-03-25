"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image'
import { Button } from "../ui/button"
import axios from "axios"

const MyPokemons = () => {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=50");
        const data = await Promise.all(response.data.results.map(async (pokemon) => {
          const pokemonData = await axios.get(pokemon.url);
          return { name: pokemon.name, imageUrl: pokemonData.data.sprites.front_default };
        }));
        setPokemons(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <ul className="divide-y">
        <div className='p-2'>
          {pokemons.map((pokemon, index) => (
            <Button variant="outline" size="lg" key={index}>
              <Image src={pokemon.imageUrl} alt={pokemon.name} width={74} height={74} />
              
            </Button>
          ))}
        </div>
      </ul>
    </div>
  )
}

export default MyPokemons;