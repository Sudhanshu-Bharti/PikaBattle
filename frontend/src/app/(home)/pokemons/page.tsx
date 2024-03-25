"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image'
import axios from "axios"
import { Button } from "../../../components/ui/button"

const Pokemons = () => {
  const [pokemons, setPokemons] = useState([]);
  const [page, setPage] = useState(0);
  const limit = 20;

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=${page * limit}&limit=${limit}`);
      const data = await Promise.all(response.data.results.map(async (pokemon) => {
        const pokemonData = await axios.get(pokemon.url);
        return { name: pokemon.name, imageUrl: pokemonData.data.sprites.front_default };
      }));
      setPokemons(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div>
      <div className="grid grid-cols-5 gap-4 p-2">
        {pokemons.map((pokemon, index) => (
          <div key={index} className='flex flex-col items-center w-24 h-24'>
            <p className='text-xs text-slate-800'>{pokemon.name}</p>
            <div className="w-20 h-20 border-md border-slate-900">
              <Image src={pokemon.imageUrl} alt={pokemon.name} width={74} height={74} />
            </div>
          </div>
        ))}
      </div>
                <button 
            className= "border bg-orange-400 text-white px-4 py-2 rounded-md mr-2" 
            onClick={() => setPage(old => Math.max(old - 1, 0))} 
            disabled={page === 0}
            >
            Previous Page
            </button>
            <button 
            className="border border-gray-300 bg-slate-600 text-gray-700 px-4 py-2 rounded-md"
            onClick={() => setPage(old => old + 1)}
            >
            Next Page
            </button>
    </div>
  )
}

export default Pokemons;