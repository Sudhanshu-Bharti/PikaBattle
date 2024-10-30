import React from "react";
import { motion } from "framer-motion";

const PokemonParty = ({ party, onSwitchPokemon, currentPokemon }) => {
  return (
    <div className="bg-gray-800/90 p-2 rounded-xl grid grid-cols-6 gap-4">
      {party.map((pokemon, index) => (
        <motion.div
          key={index}
          className={`p-2 bg-gray-700 rounded-full text-center cursor-pointer ${
            currentPokemon === index ? "border-2 border-blue-400" : ""
          }`}
          onClick={() => onSwitchPokemon(index)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={pokemon.imgUrl}
            alt={pokemon.name}
            className="w-fit mx-auto"
          />
          {/* <p className="text-white text-sm mt-2">{pokemon.name}</p> */}
        </motion.div>
      ))}
    </div>
  );
};

export default PokemonParty;
