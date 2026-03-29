import { useState, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { SenderPanel } from "./components/SenderPanel";
import { ReceiverPanel } from "./components/ReceiverPanel";
import { PairingOverlay } from "./components/PairingOverlay";
import { motion, AnimatePresence } from "motion/react";
import { Bluetooth, BluetoothOff, Wifi, WifiOff } from "lucide-react";

export default function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [decodedText, setDecodedText] = useState("");
  const [room, setRoom] = useState<string | null>(null);
  const [showPairing, setShowPairing] = useState(false);
  const [pairingMode, setPairingMode] = useState<"sender" | "receiver" | null>(null);
  const [connectionType, setConnectionType] = useState<"bluetooth" | "wifi">("bluetooth");

  const [senderInfo, setSenderInfo] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on("receive", (data: { message: string; senderId: string }) => {
      setSenderInfo(data.senderId);
      processMessage(data.message);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handlePair = (code: string) => {
    if (socket) {
      socket.emit("join-room", code);
      setRoom(code);
      setShowPairing(false);
    }
  };

  const processMessage = async (message: string) => {
    setIsTransmitting(true);
    setDecodedText("");
    
    const chars = message.split("");
    
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i].toUpperCase();
      
      if (/[A-Z]/.test(char)) {
        setActiveLetter(char);
        setDecodedText(prev => prev + char);
        await new Promise(resolve => setTimeout(resolve, 600));
        setActiveLetter(null);
        await new Promise(resolve => setTimeout(resolve, 200));
      } else if (char === " ") {
        setDecodedText(prev => prev + " ");
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    setActiveLetter("ALL");
    await new Promise(resolve => setTimeout(resolve, 300));
    setActiveLetter(null);
    await new Promise(resolve => setTimeout(resolve, 200));
    setActiveLetter("ALL");
    await new Promise(resolve => setTimeout(resolve, 300));
    setActiveLetter(null);
    
    setIsTransmitting(false);
  };

  const handleTransmit = (message: string) => {
    if (socket && room) {
      socket.emit("transmit", { room, message });
    } else {
      // If not paired, we can't send to a specific device
      console.warn("Cannot transmit: Not paired with a device.");
    }
  };

  const openPairing = (mode: "sender" | "receiver", type: "bluetooth" | "wifi") => {
    setPairingMode(mode);
    setConnectionType(type);
    setShowPairing(true);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <AnimatePresence>
        {showPairing && (
          <PairingOverlay 
            isSender={pairingMode === "sender"} 
            onPair={handlePair} 
            onClose={() => setShowPairing(false)} 
            type={connectionType}
          />
        )}
      </AnimatePresence>

      <div className="fixed inset-0 vignette pointer-events-none z-50" />
      
      <div className="flex flex-col items-center mb-12 relative z-10">
        <h1 className="text-6xl md:text-8xl font-creepster text-[#ff2200] drop-shadow-[0_0_20px_rgba(255,34,0,0.8)] crt-flicker text-center">
          THE UPSIDE DOWN
        </h1>
        
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {/* Bluetooth Options */}
          <div className="flex gap-2 p-2 bg-black/20 rounded-lg border border-[#3a2a1a]">
            <button
              onClick={() => openPairing("sender", "bluetooth")}
              className={`flex items-center gap-2 px-4 py-2 rounded border transition-all ${room && connectionType === "bluetooth" ? 'border-[#00ff44] text-[#00ff44]' : 'border-[#ff2200] text-[#ff2200] hover:bg-[#ff2200]/10'}`}
            >
              {room && connectionType === "bluetooth" ? <Bluetooth size={16} /> : <BluetoothOff size={16} />}
              <span className="text-xs font-mono uppercase tracking-widest">BT Sender</span>
            </button>
            <button
              onClick={() => openPairing("receiver", "bluetooth")}
              className={`flex items-center gap-2 px-4 py-2 rounded border transition-all ${room && connectionType === "bluetooth" ? 'border-[#00ff44] text-[#00ff44]' : 'border-[#ff2200] text-[#ff2200] hover:bg-[#ff2200]/10'}`}
            >
              <span className="text-xs font-mono uppercase tracking-widest">BT Receiver</span>
            </button>
          </div>

          {/* WiFi Options */}
          <div className="flex gap-2 p-2 bg-black/20 rounded-lg border border-[#3a2a1a]">
            <button
              onClick={() => openPairing("sender", "wifi")}
              className={`flex items-center gap-2 px-4 py-2 rounded border transition-all ${room && connectionType === "wifi" ? 'border-[#00ff44] text-[#00ff44]' : 'border-[#ff2200] text-[#ff2200] hover:bg-[#ff2200]/10'}`}
            >
              {room && connectionType === "wifi" ? <Wifi size={16} /> : <WifiOff size={16} />}
              <span className="text-xs font-mono uppercase tracking-widest">WiFi Hotspot</span>
            </button>
            <button
              onClick={() => openPairing("receiver", "wifi")}
              className={`flex items-center gap-2 px-4 py-2 rounded border transition-all ${room && connectionType === "wifi" ? 'border-[#00ff44] text-[#00ff44]' : 'border-[#ff2200] text-[#ff2200] hover:bg-[#ff2200]/10'}`}
            >
              <span className="text-xs font-mono uppercase tracking-widest">WiFi Scan</span>
            </button>
          </div>
        </div>

        {room && (
          <div className="mt-4 text-[#00ff44] font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">
            CONNECTED VIA {connectionType.toUpperCase()} • FREQUENCY: {room}
          </div>
        )}
      </div>

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
        {/* Wire Graphic */}
        <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-1 bg-[#1a1208] z-0 overflow-visible">
          {/* Base Wire */}
          <div className={`absolute inset-0 bg-[#222] transition-colors duration-500 ${isTransmitting ? 'bg-[#3a2a1a] shadow-[0_0_5px_rgba(255,34,0,0.2)]' : ''}`} />
          
          {isTransmitting && (
            <>
              {/* Traveling Signal Dot 1 */}
              <motion.div
                animate={{ 
                  left: ["0%", "100%"],
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  left: { repeat: Infinity, duration: 0.8, ease: "linear" },
                  scale: { repeat: Infinity, duration: 0.4, ease: "easeInOut" },
                  opacity: { repeat: Infinity, duration: 0.4, ease: "easeInOut" }
                }}
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#ff2200] rounded-full shadow-[0_0_15px_#ff2200] z-10"
              />
              
              {/* Traveling Signal Dot 2 (Delayed) */}
              <motion.div
                initial={{ left: "-20%" }}
                animate={{ 
                  left: ["0%", "100%"],
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ 
                  left: { repeat: Infinity, duration: 0.8, ease: "linear", delay: 0.4 },
                  scale: { repeat: Infinity, duration: 0.4, ease: "easeInOut", delay: 0.4 },
                  opacity: { repeat: Infinity, duration: 0.4, ease: "easeInOut", delay: 0.4 }
                }}
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-[#ff6600] rounded-full shadow-[0_0_10px_#ff6600] z-10"
              />

              {/* Electrical Spark Animation */}
              <motion.div
                animate={{ 
                  opacity: [0, 1, 0],
                  left: ["20%", "50%", "80%"]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 0.2, 
                  repeatDelay: Math.random() * 2 
                }}
                className="absolute top-1/2 -translate-y-1/2 w-1 h-4 bg-white/30 blur-[2px] -rotate-45"
              />
            </>
          )}
        </div>

        <div className="h-[600px]">
          <SenderPanel 
            onTransmit={handleTransmit} 
            isTransmitting={isTransmitting} 
            room={room}
            connectionType={connectionType}
          />
        </div>
        
        <div className="h-[600px]">
          <ReceiverPanel 
            activeLetter={activeLetter} 
            isTransmitting={isTransmitting} 
            decodedText={decodedText} 
            senderId={senderInfo}
            room={room}
          />
        </div>
      </main>

      <footer className="mt-12 text-[#fff8e0]/20 font-mono text-xs tracking-[0.5em] uppercase">
        Est. 1983 • Hawkins, Indiana
      </footer>
    </div>
  );
}
