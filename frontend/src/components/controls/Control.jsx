import { Button } from "../../components/ui/button";

 const BattleControls = ({ pokemon, playerTurn, onAttack }) => (
  <div className="grid grid-cols-2 gap-6">
    <div className="bg-gray-800/50 p-4 rounded-xl">
      <h2 className="text-xl font-bold text-white mb-4">Attacks</h2>
      <div className="grid grid-cols-2 gap-3">
        {pokemon?.attacks?.map((attack, index) => (
          <Button
            key={index}
            onClick={() => playerTurn && onAttack(attack)}
            className={`
              relative overflow-hidden bg-slate-700 text-white font-medium py-2 px-4 
              rounded-lg transform transition-all hover:scale-105 
              ${!playerTurn && 'opacity-50 cursor-not-allowed'}
            `}
          >
            {attack.name}
            {attack.damage && (
              <span className="absolute top-0 right-0 bg-yellow-700 text-xs px-1 rounded-bl-lg">
                {attack.damage}
              </span>
            )}
          </Button>
        ))}
      </div>
    </div>

    <div className="bg-gray-800/50 p-4 rounded-xl">
      <h2 className="text-xl font-bold text-white mb-4">Abilities</h2>
      <div className="grid grid-cols-2 gap-3">
        {pokemon?.abilities?.map((ability, index) => (
          <Button
            key={index}
            onClick={() => playerTurn && onAttack(ability)}
            className={`
              bg-gradient-to-r from-blue-500 to-purple-500 
              hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2 px-4 
              rounded-lg transform transition-all hover:scale-105
              ${!playerTurn && 'opacity-50 cursor-not-allowed'}
            `}
          >
            {ability.name}
          </Button>
        ))}
      </div>
    </div>
  </div>
);

export default BattleControls;