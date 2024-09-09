"use client"
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { MinusCircle, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Pokemons = () => {
  const [pokemons, setPokemons] = useState([]);
  const [page, setPage] = useState(0);
  const [party, setParty] = useState([]);
  const [id, setID] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const limit = 20;
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
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
        setError("Failed to fetch Pokémon data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [page]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setID(storedUserId);
    } else {
      router.push('/login');
    }
  }, [router]);

  const addToParty = (pokemon) => {
    if (party.length < 6) {
      setParty([...party, pokemon]);
    }
  };

  const handleSubmitParty = async () => {
    try {
      if (!id || party.length !== 6) {
        setError("Please add 6 Pokémon to the party before submitting.");
        return;
      }

      const response = await axios.post('http://localhost:4000/add-to-party', {
        playerId: id, 
        pokemons: party.map(pokemon => ({
          name: pokemon.name,
          imgUrl: pokemon.imageUrl,
          hp: pokemon.stats[0].base_stat,
          attacks: pokemon.moves 
        }))
      });

      setError(null);
      console.log("Party added successfully:", response.data);
    } catch (error) {
      console.error("Error adding party:", error);
      setError("Failed to submit party. Please try again.");
    }
  };

  const removeFromParty = (index) => {
    const updatedParty = [...party];
    updatedParty.splice(index, 1);
    setParty(updatedParty);
  };

  
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Pokemons</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="text-center text-gray-600 text-xl">Loading Pokémon...</div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {pokemons.map((pokemon, index) => (
              <div key={index} className='bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl'>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 capitalize mb-2">{pokemon.name}</h3>
                  <div className="flex justify-center mb-4">
                    <img src={pokemon.imageUrl} alt={pokemon.name} className="w-32 h-32 object-contain" />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pokemon.moves.map((move, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {move.name}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => addToParty(pokemon)}
                    disabled={party.length >= 6}
                    className={`w-full py-2 rounded-md text-white font-semibold transition duration-200 ease-in-out ${party.length < 6 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
                  >
                    <PlusCircle size={16} className="inline mr-2" /> Add to Party
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={() => setPage(old => Math.max(old - 1, 0))} 
            disabled={page === 0}
            className={`px-4 py-2 rounded-md text-white font-semibold transition duration-200 ease-in-out ${page !== 0 ? 'bg-orange-400 hover:bg-orange-500' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            <ChevronLeft size={16} className="inline mr-2" /> Previous
          </button>
          <button 
            onClick={() => setPage(old => old + 1)}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-md transition duration-200 ease-in-out"
          >
            Next <ChevronRight size={16} className="inline ml-2" />
          </button>
        </div>
      </div>
      
      <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Pokémon Party</h2>
        <div className="flex flex-col gap-4 mb-4">
          {party.map((pokemon, index) => (
            <div key={index} className="flex items-center gap-4 bg-gray-100 p-2 rounded-lg">
              <img src={pokemon.imageUrl} alt={pokemon.name} className="w-16 h-16 object-cover rounded-full" />
              <span className="flex-grow font-semibold capitalize">{pokemon.name}</span>
              <button 
                onClick={() => removeFromParty(index)}
                className="text-red-500 hover:text-red-600 transition duration-200 ease-in-out"
              >
                <MinusCircle size={20} />
              </button>
            </div>
          ))}
          {[...Array(6 - party.length)].map((_, index) => (
            <div key={`empty-${index}`} className="h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-2xl font-bold">
              ?
            </div>
          ))}
        </div>
        <button 
          onClick={handleSubmitParty} 
          disabled={party.length !== 6}
          className={`w-full py-2 rounded-md text-white font-semibold transition duration-200 ease-in-out ${party.length === 6 ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          Submit Party
        </button>
      </div>
    </div>
  );
};

export default Pokemons;