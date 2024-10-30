import { motion } from "framer-motion";

 const PokemonStats = ({ name, hp }) => (
  <div className="absolute -top-16 bg-black/60 text-white px-4 py-2 rounded-lg">
    <h3 className="text-lg font-bold">{name}</h3>
    <div className="w-48">
      <div className="h-2 bg-gray-700 rounded-full">
        <div className="h-2 bg-gradient-to-r from-green-500 to-green-400 rounded-full w-1/2 transition-all duration-500" />
      </div>
      <p className="text-sm mt-1">HP: {hp}</p>
    </div>
  </div>
);

export default PokemonStats;