import { PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';

export const PokemonCard = ({ pokemon, addToParty, isPartyFull }) => (
  <div className='bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl'>
    <div className='p-4'>
      <h3 className='text-xl font-semibold text-gray-800 capitalize mb-2'>{pokemon.name}</h3>
      <div className='flex justify-center mb-4'>
        <img src={pokemon.imageUrl} alt={pokemon.name} className='w-32 h-32 object-contain' />
      </div>
      <div className='flex flex-wrap gap-2 mb-4'>
        {pokemon.moves.map((move, idx) => (
          <span key={idx} className='px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full'>
            {move.name}
          </span>
        ))}
      </div>
      <Button
        onClick={() => addToParty(pokemon)}
        disabled={isPartyFull}
        className={`w-full py-2 rounded-md text-white font-semibold ${
          isPartyFull ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        <PlusCircle size={16} className='inline mr-2' /> Add to Party
      </Button>
    </div>
  </div>
);