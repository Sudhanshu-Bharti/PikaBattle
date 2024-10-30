import { motion, AnimatePresence } from "framer-motion";

 const Battlelog = ({ logs }) => (
  <div className="mt-4 bg-black/30 rounded-lg p-3 max-h-32 overflow-y-auto">
    <AnimatePresence>
      {logs.map((log, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-white text-sm mb-1"
        >
          {log}
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);
export default Battlelog;