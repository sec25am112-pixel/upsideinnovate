import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bluetooth, BluetoothSearching, BluetoothConnected, X, Wifi, WifiOff, QrCode, Camera } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface PairingOverlayProps {
  onPair: (code: string) => void;
  isSender: boolean;
  onClose: () => void;
  type: "bluetooth" | "wifi";
  isConnecting: boolean;
  error: string | null;
}

export const PairingOverlay = ({ onPair, isSender, onClose, type, isConnecting, error }: PairingOverlayProps) => {
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);

  const isWifi = type === "wifi";

  useEffect(() => {
    if (isSender) {
      const newCode = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedCode(newCode);
      onPair(newCode);
    }
  }, [isSender]);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  const handleConnect = () => {
    if (code.length === 4) {
      onPair(code);
    }
  };

  const simulateQrScan = () => {
    setIsScanning(true);
    setShowQrScanner(true);
    setTimeout(() => {
      // In a real app, this would come from the camera
      // For this demo, we'll just simulate a successful scan if the user "finds" it
      setIsScanning(false);
      setShowQrScanner(false);
      // We don't have the actual code here, so we'll just mock it for the demo
      onPair("1234"); 
    }, 4000);
  };

  const Icon = isWifi ? Wifi : Bluetooth;
  const SearchingIcon = isWifi ? Wifi : BluetoothSearching;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-md wood-panel p-8 rounded-lg border-4 border-[#2a1a1a] shadow-[0_0_50px_rgba(0,0,0,1)]">
        <div className="absolute inset-0 wallpaper pointer-events-none opacity-10" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#ff2200] hover:scale-110 transition-transform"
        >
          <X size={24} />
        </button>

        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            {isScanning || isConnecting ? (
              <SearchingIcon className="text-[#ff2200] animate-pulse" size={40} />
            ) : (
              <Icon className="text-[#ff2200]" size={40} />
            )}
            <h2 className="text-[#ff2200] font-creepster text-3xl tracking-widest flicker">
              {isConnecting ? "CONNECTING..." : (isSender ? (isWifi ? "WIFI HOTSPOT" : "BROADCASTING") : (isWifi ? "WIFI SCAN" : "SCANNING"))}
            </h2>
          </div>

          <p className="text-center text-[#fff8e0]/60 font-mono text-xs">
            {isConnecting 
              ? `AUTHENTICATING ${type.toUpperCase()} HANDSHAKE...`
              : (isSender 
                ? `ESTABLISHING SECURE ${isWifi ? "WIFI" : "BT"} FREQUENCY FOR NEARBY RECEIVERS...` 
                : `SEARCHING FOR NEARBY ${isWifi ? "WIFI" : "BT"} TRANSMISSION FREQUENCIES...`)}
          </p>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full p-3 bg-[#ff2200]/20 border border-[#ff2200]/50 rounded text-[#ff2200] font-mono text-[10px] uppercase tracking-widest text-center"
            >
              {error}
            </motion.div>
          )}

          {isSender ? (
            <div className="flex flex-col items-center gap-6">
              <div className="p-4 bg-white rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <QRCodeSVG 
                  value={generatedCode} 
                  size={160}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="L"
                  includeMargin={false}
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-4xl font-mono tracking-[0.5em] text-[#ff2200] drop-shadow-[0_0_10px_rgba(255,34,0,0.5)]">
                  {generatedCode}
                </div>
                <span className="text-[10px] opacity-40 uppercase tracking-widest">Frequency ID / Passcode</span>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              {showQrScanner ? (
                <div className="relative w-full aspect-square bg-black border-2 border-[#ff2200] overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20 static-noise" />
                  <Camera className="text-[#ff2200]/20" size={64} />
                  <motion.div 
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute left-0 right-0 h-0.5 bg-[#ff2200] shadow-[0_0_10px_#ff2200] z-20"
                  />
                  <div className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-[#ff2200] font-mono tracking-widest animate-pulse">
                    POINT AT SENDER QR CODE
                  </div>
                </div>
              ) : (
                <>
                  {!isScanning ? (
                    <>
                      <input
                        type="text"
                        maxLength={4}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                        placeholder={isWifi ? "ENTER WIFI PASSCODE" : "ENTER FREQUENCY ID"}
                        className="w-full bg-black/50 border-2 border-[#3a2a1a] p-4 text-center text-4xl font-mono tracking-[0.5em] text-[#ff2200] focus:outline-none focus:border-[#ff2200] transition-colors placeholder:text-xs placeholder:tracking-normal"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={handleConnect}
                          disabled={code.length !== 4}
                          className="py-3 bg-[#ff2200] text-black font-creepster text-xl tracking-widest rounded hover:bg-[#ff4400] transition-colors disabled:opacity-30"
                        >
                          CONNECT
                        </button>
                        <button
                          onClick={simulateQrScan}
                          className="py-3 border-2 border-[#ff2200] text-[#ff2200] font-creepster text-xl tracking-widest rounded hover:bg-[#ff2200]/10 transition-colors flex items-center justify-center gap-2"
                        >
                          <QrCode size={20} />
                          SCAN QR
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-4 py-8">
                      <div className="w-full h-1 bg-[#1a1208] relative overflow-hidden">
                        <motion.div
                          animate={{ left: ["-100%", "100%"] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                          className="absolute top-0 bottom-0 w-1/2 bg-[#ff2200] shadow-[0_0_10px_#ff2200]"
                        />
                      </div>
                      <span className="text-[10px] opacity-40 uppercase tracking-widest">{isWifi ? "Authenticating with the Upside Down..." : "Syncing with the void..."}</span>
                    </div>
                  )}
                </>
              )}
              
              {!showQrScanner && (
                <button
                  onClick={handleScan}
                  className="text-[#ff2200]/60 hover:text-[#ff2200] text-[10px] uppercase tracking-widest transition-colors text-center"
                >
                  {isScanning ? "Scanning..." : "Refresh Scan"}
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 text-[10px] opacity-20 font-mono">
            {isWifi ? <Wifi size={12} /> : <BluetoothConnected size={12} />}
            <span>{isWifi ? "WIFI DIRECT (802.11) SIMULATION ACTIVE" : "BLUETOOTH LOW ENERGY (BLE) SIMULATION ACTIVE"}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
