import { MinusCircle } from 'lucide-react';
import { Button } from '../ui/button';

export const Party = ({ party, removeFromParty, handleSubmitParty, isSubmitDisabled }) => (
  <div className='w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto'>
    <h2 className='text-2xl font-bold text-gray-800 mb-4'>Your Pokémon Party</h2>
    <div className='flex flex-col gap-4 mb-4'>
      {party.map((pokemon, index) => (
        <div key={index} className='flex items-center gap-4 bg-gray-100 p-2 rounded-lg'>
          <img src={pokemon.imageUrl} alt={pokemon.name} className='w-16 h-16 object-cover rounded-full' />
          <span className='flex-grow font-semibold capitalize'>{pokemon.name}</span>
          <Button
            onClick={() => removeFromParty(index)}
            className='text-red-500 hover:text-red-600 bg-gray-200 hover:bg-gray-300 rounded-lg'
          >
            <MinusCircle size={20} />
          </Button>
        </div>
      ))}
      {[...Array(6 - party.length)].map((_, index) => (
        <div key={`empty-${index}`} className='h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-2xl font-bold'>
          ?
        </div>
      ))}
    </div>
    <Button
      onClick={handleSubmitParty}
      disabled={isSubmitDisabled}
      className={`w-full py-2 rounded-md text-white font-semibold ${
        isSubmitDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
      }`}
    >
      Submit Party
    </Button>
  </div>
);