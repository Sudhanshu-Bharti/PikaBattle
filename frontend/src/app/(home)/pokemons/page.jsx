"use client"
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { MinusIcon } from 'lucide-react';

const Pokemons = () => {
  const [pokemons, setPokemons] = useState([]);
  const [page, setPage] = useState(0);
  const [party, setParty] = useState([]);
  const [id , setID] = useState("");
  const limit = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/?offset=${page * limit}&limit=${limit}`);
        const data = await Promise.all(response.data.results.map(async (pokemon) => {
          const pokemonData = await axios.get(pokemon.url);
          const movesData = await Promise.all(pokemonData.data.moves.slice(0, 4).map(async (move) => {
            const moveData = await axios.get(move.move.url);
            return { name: move.move.name, damage: moveData.data.power };
          }));
          return { 
            name: pokemonData.data.name, 
            imageUrl: pokemonData.data.sprites.front_default, 
            moves: movesData,
            stats: pokemonData.data.stats
          };
        }));
        setPokemons(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, [page]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setID(storedUserId);
    }
  }, []);

  const addToParty = (pokemon) => {
    if (party.length < 6) {
      setParty([...party, pokemon]);
    }
  };

  const handleSubmitParty = async () => {
    try {
      if (party.length !== 6) {
        alert("Please add 6 Pokemon to the party before submitting.");
        return;
      }

      console.log("Handling party", party);

      const response = await axios.post('http://localhost:4000/add-to-party', {
        playerId: id, 
        pokemons: party.map(pokemon => ({
          name: pokemon.name,
          imgUrl: pokemon.imageUrl,
          hp: pokemon.stats[0].base_stat,
          attacks: pokemon.moves 
        }))
      });

      console.log("Party added successfully:", response.data);
    } catch (error) {
      console.error("Error adding party:", error);
    }
  };

  const removeFromParty = (index) => {
    const updatedParty = [...party];
    updatedParty.splice(index, 1);
    setParty(updatedParty);
  };

  return (
    <div className="container mx-auto my-8">
      <div className="mt-8 sticky top-24 bg-slate-200 border rounded-md shadow-md">
        <h2 className="text-xl p-3 font-semibold mb-2">Party</h2>
        <ul className="flex flex-row pl-6">
          {party.map((pokemon, index) => (
            <div key={index} className="flex flex-col items-center">
              <img src={pokemon.imageUrl} alt={pokemon.name} className="w-32 h-32" />
              <button 
                onClick={() => removeFromParty(index)}
                className="relative bottom-24 left-7 bg-red-100 hover:bg-red-500 text-white px-1 py-1 rounded-full shadow-md"
              >
                <MinusIcon size="10"/>
              </button>
            </div>
          ))}
        </ul>
        <button onClick={handleSubmitParty} className='rounded-md p-2 bg-green-500 text-slate-100 tracking-wide font-semibold m-3'>Submit Party</button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {pokemons.map((pokemon, index) => (
          <div key={index} className='flex flex-col items-center p-4 border rounded-md shadow-md'>
            <p className='text-lg font-semibold text-gray-600'>{pokemon.name}</p>
            <div className="border border-gray-400 p-2 rounded-full">
              <img src={pokemon.imageUrl} alt={pokemon.name} className="w-32 h-32" />
            </div>
            <button 
              onClick={() => addToParty(pokemon)}
              className="mt-4 bg-green-600 hover:bg-green-400 text-white px-4 py-2 rounded-md shadow-md"
            >
              Add to Party
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button 
          className="mr-2 border bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md shadow-md"
          onClick={() => setPage(old => Math.max(old - 1, 0))} 
          disabled={page === 0}
        >
          Previous Page
        </button>
        <button 
          className="border bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-md shadow-md"
          onClick={() => setPage(old => old + 1)}
        >
          Next Page
        </button>
      </div>
    </div>
  );
};

export default Pokemons;
