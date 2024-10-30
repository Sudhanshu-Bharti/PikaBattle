import { motion } from "framer-motion";

 const PokemonSprite = ({ name, imageUrl, isOpponent }) => (
  <motion.img
    animate={{
      y: [0, -10, 0],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
      delay: isOpponent ? 0.5 : 0
    }}
    alt={name}
    src={imageUrl}
    className="w-48 h-48 object-contain filter drop-shadow-lg"
  />
);

export default PokemonSprite;