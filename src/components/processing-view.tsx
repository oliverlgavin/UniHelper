"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Brain } from "lucide-react";

const MESSAGES = [
  "Reading your professor's mind...",
  "Decoding complex jargon...",
  "Generating fun quizzes...",
  "Structuring your success path...",
  "Almost there...",
];

export function ProcessingView() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-8">
      {/* Animated Loader */}
      <div className="relative w-32 h-32">
        <motion.div
          className="absolute inset-0 border-8 border-primary/30 rounded-full"
        />
        <motion.div
          className="absolute inset-0 border-8 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
           className="absolute inset-0 flex items-center justify-center"
           animate={{ scale: [1, 1.2, 1] }}
           transition={{ duration: 1, repeat: Infinity }}
        >
          <Brain size={40} className="text-primary" />
        </motion.div>
      </div>

      <div className="h-12 overflow-hidden relative w-full text-center">
        <motion.p
          key={msgIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="text-xl font-bold text-foreground absolute w-full left-0 top-0"
        >
          {MESSAGES[msgIndex]}
        </motion.p>
      </div>
    </div>
  );
}

