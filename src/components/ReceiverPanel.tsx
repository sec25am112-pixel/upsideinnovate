import { useState, useEffect, useRef } from "react";
import { Bulb } from "./Bulb";
import { motion, AnimatePresence } from "motion/react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const COLORS = ["#ff2200", "#ff6600", "#ffcc00", "#00ff44", "#0088ff", "#cc00ff"];

interface ReceiverPanelProps {
  activeLetter: string | null;
  isTransmitting: boolean;
  decodedText: string;
  senderId: string | null;
  room: string | null;
}

export const ReceiverPanel = ({ activeLetter, isTransmitting, decodedText, senderId, room }: ReceiverPanelProps) => {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (activeLetter) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [activeLetter]);

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center p-8 wood-panel rounded-lg border-4 border-[#2a1a1a] overflow-hidden ${shake ? 'screen-shake' : ''}`}>
      {/* Wallpaper Overlay */}
      <div className="absolute inset-0 wallpaper pointer-events-none" />
      
      {/* Static Noise Overlay */}
      <div className={`absolute inset-0 static-noise transition-opacity duration-300 ${isTransmitting ? 'opacity-30' : 'opacity-0'}`} />

      {/* Receiving Warning */}
      <AnimatePresence>
        {isTransmitting && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: [0, 1, 0.5, 1], y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute top-4 right-4 flex flex-col items-end"
          >
            <span className="text-[#ff2200] font-creepster text-xl tracking-widest flicker">
              RECEIVING SIGNAL...
            </span>
            {senderId && (
              <span className="text-[#ff2200]/40 font-mono text-[10px] uppercase tracking-widest">
                FROM DEVICE: {senderId}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {room && !isTransmitting && (
        <div className="absolute top-4 left-4 flex flex-col items-start opacity-30">
          <span className="text-[#00ff44] font-mono text-[10px] uppercase tracking-widest">
            SYNCED TO FREQUENCY: {room}
          </span>
        </div>
      )}

      {/* Light Grid */}
      <div className="grid grid-cols-9 gap-2 relative z-10 max-w-4xl">
        {ALPHABET.map((letter, index) => (
          <Bulb
            key={letter}
            letter={letter}
            isActive={activeLetter === letter || activeLetter === "ALL"}
            color={COLORS[index % COLORS.length]}
          />
        ))}
      </div>

      {/* Decoded Text Area */}
      <div className="mt-12 w-full max-w-2xl bg-black/40 p-6 rounded border border-[#3a2a1a] relative z-10">
        <h3 className="text-[#ff2200] font-creepster text-lg mb-2 opacity-50">DECODED MESSAGE</h3>
        <div className="font-mono text-2xl tracking-widest min-h-[3rem] break-words">
          {decodedText}
          {isTransmitting && <span className="animate-pulse">_</span>}
        </div>
      </div>

      {/* Ambient Hum (Visual) */}
      <div className="absolute bottom-4 left-4 text-xs opacity-20 font-mono italic">
        [AMBIENT HUM INTENSIFIES]
      </div>
    </div>
  );
};
