
import axios from 'axios';

export const fetchPokemonListAPI = async () => {
  const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1500');
  return response.data.results;
};

export const fetchPokemonDetailsAPI = async (pokemonList) => {
  const detailedPokemons = await Promise.all(
    pokemonList.map(async (pokemon) => {
      const pokemonData = await axios.get(pokemon.url);
      const movesData = await Promise.all(
        pokemonData.data.moves.slice(0, 4).map(async (move) => {
          const moveData = await axios.get(move.move.url);
          return { name: move.move.name, damage: moveData.data.power };
        })
      );
      return {
        name: pokemonData.data.name,
        imageUrl: pokemonData.data.sprites.front_default,
        moves: movesData,
        stats: pokemonData.data.stats,
      };
    })
  );
  return detailedPokemons;
};

export const getFilteredPokemons = (allPokemons, searchQuery, itemsPerPage, currentPage) => {
  if (!searchQuery) return allPokemons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  return allPokemons
    .filter((pokemon) => pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
};