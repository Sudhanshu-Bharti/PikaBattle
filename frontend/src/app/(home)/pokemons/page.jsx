"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Loader , ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PokemonCard } from '../../../components/pokemon-card/pokemon-card';
import { Party } from '../../../components/party/party';
import { fetchPokemonListAPI, fetchPokemonDetailsAPI, getFilteredPokemons } from '../../../utils/api';
import { Button } from '../../../components/ui/button';

const Pokemons = () => {
  const [allPokemons, setAllPokemons] = useState([]);
  const [displayedPokemons, setDisplayedPokemons] = useState([]);
  const [party, setParty] = useState([]);
  const [id, setID] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;
  const router = useRouter();

  useEffect(() => {
    const fetchPokemonList = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const pokemons = await fetchPokemonListAPI();
        setAllPokemons(pokemons);
        setTotalCount(pokemons.length);
        const initialDetails = await fetchPokemonDetailsAPI(pokemons.slice(0, itemsPerPage));
        setDisplayedPokemons(initialDetails);
      } catch (error) {
        setError('Failed to fetch Pokémon data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPokemonList();
  }, []);

  useEffect(() => {
    const searchPokemon = async () => {
      if (!searchQuery) {
        const paginatedPokemons = getFilteredPokemons(allPokemons, '', itemsPerPage, currentPage);
        setDisplayedPokemons(await fetchPokemonDetailsAPI(paginatedPokemons));
      } else {
        setIsSearching(true);
        try {
          const filteredPokemons = getFilteredPokemons(allPokemons, searchQuery, itemsPerPage, currentPage);
          setDisplayedPokemons(await fetchPokemonDetailsAPI(filteredPokemons));
        } catch (error) {
          setError('Search failed. Please try again.');
        } finally {
          setIsSearching(false);
        }
      }
    };
    const timeoutId = setTimeout(searchPokemon, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, currentPage, allPokemons]);

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

  const removeFromParty = (index) => {
    const updatedParty = [...party];
    updatedParty.splice(index, 1);
    setParty(updatedParty);
  };

  const handleSubmitParty = async () => {
    if (!id || party.length !== 6) {
      setError('Please add 6 Pokémon to the party before submitting.');
      return;
    }
    try {
      await axios.post('http://localhost:4000/add-to-party', {
        playerId: id,
        pokemons: party.map((pokemon) => ({
          name: pokemon.name,
          imgUrl: pokemon.imageUrl,
          hp: pokemon.stats[0].base_stat,
          attacks: pokemon.moves,
        })),
      });
      console.log('Party submitted successfully', { id, party });
      setError(null);
    } catch (error) {
      setError('Failed to submit party. Please try again.');
    }
  };

  return (
    <div className='flex h-screen bg-gray-100'>
      <div className='flex-1 overflow-y-auto p-8'>
        <div className='flex flex-col sm:flex-row justify-between items-center mb-8 gap-4'>
          <h1 className='text-4xl font-bold'>Pokemons</h1>
          <div className='relative w-full sm:w-64'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={20} />
            {isSearching && <Loader className='absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 animate-spin' size={20} />}
            <input
              type='text'
              placeholder='Search any Pokemon...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-6 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500'
            />
          </div>
        </div>

        {isLoading ? (
          <div className='flex justify-center items-center'>
            <Loader size={40} className='text-blue-500 animate-spin' />
          </div>
        ) : error ? (
          <div className='text-center text-red-500 font-semibold'>{error}</div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {displayedPokemons.map((pokemon, index) => (
              <PokemonCard key={index} pokemon={pokemon} addToParty={addToParty} isPartyFull={party.length >= 6} />
            ))}
          </div>
        )}

        <div className='mt-8 flex justify-center gap-4'>
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className='py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md'
          >
            <ArrowLeft/>
          </Button>
          <span className='font-semibold text-gray-700'>
            Page {currentPage} of {Math.ceil(totalCount / itemsPerPage)}
          </span>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(totalCount / itemsPerPage)))}
            disabled={currentPage >= Math.ceil(totalCount / itemsPerPage)}
            className='py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md'
          >
            <ArrowRight/>
          </Button>
        </div>
      </div>

      <Party party={party} removeFromParty={removeFromParty} handleSubmitParty={handleSubmitParty} isSubmitDisabled={party.length < 6} />
    </div>
  );
};

export default Pokemons;