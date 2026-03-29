import React, { useState } from "react";
import { motion } from "motion/react";

interface SenderPanelProps {
  onTransmit: (message: string) => void;
  isTransmitting: boolean;
}

export const SenderPanel = ({ onTransmit, isTransmitting }: SenderPanelProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isTransmitting) {
      onTransmit(message.toUpperCase());
      setMessage("");
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="TYPE YOUR MESSAGE..."
            disabled={isTransmitting}
            className="w-full h-48 bg-[#0a0804] border-2 border-[#3a2a1a] p-4 text-[#fff8e0] font-special text-xl resize-none focus:outline-none focus:border-[#ff2200] transition-colors placeholder:opacity-30 disabled:opacity-50"
          />

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
