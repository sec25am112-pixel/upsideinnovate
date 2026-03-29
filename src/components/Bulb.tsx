import { motion, AnimatePresence } from "motion/react";

interface BulbProps {
  key?: string;
  letter: string;
  isActive: boolean | string;
  color: string;
}

const SPECTRUM = ["#ff2200", "#ff6600", "#ffcc00", "#00ff44", "#0088ff", "#cc00ff"];

export const Bulb = ({ letter, isActive, color }: BulbProps) => {
  const isActuallyActive = isActive || (typeof isActive === 'string' && isActive === 'ALL');
  
  return (
    <div className="flex flex-col items-center justify-center relative w-16 h-24 m-2">
      {/* Bulb String Wire */}
      <div className="absolute -top-4 w-0.5 h-4 bg-[#222] z-0" />
      
      {/* Bulb Shape */}
      <div className="relative z-10">
        <svg width="40" height="60" viewBox="0 0 40 60" className="drop-shadow-lg">
          {/* Base */}
          <rect x="15" y="0" width="10" height="8" fill="#333" />
          
          {/* Glass */}
          <motion.path
            d="M20 55 C5 45 5 25 20 10 C35 25 35 45 20 55 Z"
            animate={{ 
              fill: isActuallyActive ? SPECTRUM : "#333",
              opacity: isActuallyActive ? 0.9 : 0.3
            }}
            transition={{ 
              fill: { 
                duration: 0.6, 
                repeat: isActuallyActive ? Infinity : 0, 
                ease: "linear" 
              },
              opacity: { duration: 0.3 }
            }}
          />
          
          {/* Core Glow */}
          <AnimatePresence>
            {isActuallyActive && (
              <motion.path
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                d="M20 45 C12 38 12 25 20 15 C28 25 28 38 20 45 Z"
                fill="#fff8e0"
                className="bulb-glow"
              />
            )}
          </AnimatePresence>
        </svg>

        {/* Outer Glow Halo */}
        <AnimatePresence>
          {isActuallyActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 0.6, 
                scale: 1.5,
                backgroundColor: SPECTRUM
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                backgroundColor: { duration: 0.6, repeat: Infinity, ease: "linear" },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 }
              }}
              className="absolute inset-0 rounded-full blur-xl pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Letter on Wall */}
      <span className="mt-2 text-2xl font-creepster text-black/80 select-none">
        {letter}
      </span>
    </div>
  );
};
