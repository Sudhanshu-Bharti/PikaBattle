import { motion } from "framer-motion";

 const WaitingScreen = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center p-8 bg-white/10 rounded-xl backdrop-blur-sm"
  >
    <div className="flex items-center justify-center gap-3">
      <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
      <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
      <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
    </div>
    <p className="text-white text-lg font-semibold mt-4">Waiting for opponent's move...</p>
  </motion.div>
);
export default WaitingScreen;