/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, RefreshCw } from 'lucide-react';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const COLORS = [
  'bg-rose-500', 'bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 
  'bg-violet-500', 'bg-fuchsia-500', 'bg-indigo-500', 'bg-orange-500'
];

export default function App() {
  const [currentLetter, setCurrentLetter] = useState('A');
  const [isUppercase, setIsUppercase] = useState(true);
  const [bgColor, setBgColor] = useState(COLORS[0]);
  const [key, setKey] = useState(0);

  const generateNext = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * ALPHABET.length);
    const randomCase = Math.random() > 0.5;
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    setCurrentLetter(ALPHABET[randomIndex]);
    setIsUppercase(randomCase);
    setBgColor(randomColor);
    setKey(prev => prev + 1);
  }, []);

  const speak = useCallback((letter: string, isCap: boolean) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const prefix = isCap ? "Capital" : "Small";
      const utterance = new SpeechSynthesisUtterance(`${prefix} ${letter}`);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const displayLetter = isUppercase ? currentLetter : currentLetter.toLowerCase();

  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center transition-colors duration-700 ease-in-out ${bgColor} bg-opacity-10`}>
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full border-[40px] border-white/5 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full border-[60px] border-white/5 rounded-full"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-12 w-full max-w-md px-6">
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-display font-bold text-slate-800 tracking-tight">
            AlphaQuest
          </h1>
          <p className="text-slate-500 font-sans mt-2 font-medium">
            Tap to discover a new letter!
          </p>
        </motion.div>

        {/* Main Letter Circle */}
        <div className="relative group">
          <motion.button
            id="letter-display-button"
            onClick={generateNext}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-64 h-64 sm:w-80 sm:h-80 bg-white rounded-full shadow-2xl shadow-slate-200/50 flex items-center justify-center cursor-pointer overflow-hidden border-8 border-white"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={key}
                initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 1.5, opacity: 0, rotate: 20 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20 
                }}
                className={`absolute inset-0 flex items-center justify-center ${bgColor} text-white font-display font-black text-9xl sm:text-[12rem] selection:bg-transparent`}
              >
                {displayLetter}
              </motion.div>
            </AnimatePresence>

            {/* Ripple Effect hint */}
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 border-4 border-white/30 rounded-full"
            />
          </motion.button>

          {/* Infinite Rotation Border Tooltip simulation */}
          <div className="absolute -inset-4 border-2 border-dashed border-slate-200 rounded-full animate-[spin_20s_linear_infinite] pointer-events-none opacity-50" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-6">
          <motion.button
            id="speak-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => speak(currentLetter, isUppercase)}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-slate-700 transition-colors group-hover:text-sky-500">
              <Volume2 size={32} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Listen</span>
          </motion.button>

          <motion.button
            id="random-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={generateNext}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-slate-700 transition-colors group-hover:text-emerald-500">
              <RefreshCw size={32} />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Random</span>
          </motion.button>
        </div>

        {/* Instructions for parents/teachers */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center bg-white/50 backdrop-blur-sm py-3 px-6 rounded-full border border-white"
        >
          <p className="text-slate-600 text-sm font-medium">
            💡 <span className="font-bold">Pro-tip:</span> Change the letter by clicking the giant circle!
          </p>
        </motion.div>
      </div>

      {/* Footer Branding */}
      <div className="fixed bottom-6 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
        Built for Interactive Learning
      </div>
    </div>
  );
}
