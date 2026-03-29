import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SenderPanelProps {
  onTransmit: (message: string) => void;
  isTransmitting: boolean;
  room: string | null;
  connectionType: "bluetooth" | "wifi";
}

export const SenderPanel = ({ onTransmit, isTransmitting, room, connectionType }: SenderPanelProps) => {
  const [message, setMessage] = useState("");
  const [lastSent, setLastSent] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isTransmitting) {
      onTransmit(message.toUpperCase());
      setLastSent(message.toUpperCase());
      setMessage("");
      
      // Clear last sent after some time
      setTimeout(() => setLastSent(null), 3000);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 wood-panel rounded-lg border-4 border-[#2a1a1a] overflow-hidden">
      {/* Wallpaper Overlay */}
      <div className="absolute inset-0 wallpaper pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col gap-6">
        <h2 className="text-[#ff2200] font-creepster text-4xl text-center drop-shadow-[0_0_10px_rgba(255,34,0,0.5)] flicker">
          SENDER
        </h2>

        {room ? (
          <div className="flex items-center justify-center gap-2 py-1 px-3 bg-[#00ff44]/10 border border-[#00ff44]/30 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff44] animate-pulse" />
            <span className="text-[#00ff44] font-mono text-[10px] uppercase tracking-widest">
              SYNCED VIA {connectionType.toUpperCase()}: {room}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 py-1 px-3 bg-[#ff2200]/10 border border-[#ff2200]/30 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ff2200]" />
            <span className="text-[#ff2200] font-mono text-[10px] uppercase tracking-widest">
              NOT CONNECTED
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="TYPE YOUR MESSAGE..."
              disabled={isTransmitting}
              className="w-full h-48 bg-[#0a0804] border-2 border-[#3a2a1a] p-4 text-[#fff8e0] font-special text-xl resize-none focus:outline-none focus:border-[#ff2200] transition-colors placeholder:opacity-30 disabled:opacity-50"
            />
            <AnimatePresence>
              {lastSent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="absolute bottom-4 right-4 text-[#00ff44] font-mono text-[10px] uppercase tracking-widest bg-black/80 px-2 py-1 rounded border border-[#00ff44]/30"
                >
                  TRANSMITTED: {lastSent.substring(0, 10)}{lastSent.length > 10 ? '...' : ''}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isTransmitting || !message.trim()}
            className="w-full py-4 bg-[#ff2200] text-black font-creepster text-2xl tracking-widest rounded shadow-[0_0_20px_rgba(255,34,0,0.3)] hover:bg-[#ff4400] transition-colors disabled:bg-gray-800 disabled:text-gray-600 disabled:shadow-none relative overflow-hidden group"
          >
            <span className="relative z-10">TRANSMIT</span>
            {/* Cracked Paint Effect Overlay */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cracked-plaster.png')] pointer-events-none" />
          </motion.button>
        </form>

        <div className="text-xs opacity-30 font-mono text-center mt-4">
          MESSAGES ARE SENT TO THE UPSIDE DOWN
        </div>
      </div>
    </div>
  );
};
