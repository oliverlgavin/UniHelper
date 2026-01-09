"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/use-app-store";
import { CheckCircle, XCircle, ArrowLeft, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

export function GameView() {
  const { data, exitGame } = useAppStore();
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  if (!data || !data.quiz) return null;

  const question = data.quiz[currentQ];
  const isLast = currentQ === data.quiz.length - 1;

  const handleSelect = (index: number) => {
    if (selected !== null) return; // Prevent changing
    setSelected(index);
    
    const isCorrect = index === question.correctAnswer;
    if (isCorrect) {
      setScore(s => s + 100);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    setTimeout(() => {
      if (isLast) {
        setShowResult(true);
      } else {
        setSelected(null);
        setCurrentQ(prev => prev + 1);
      }
    }, 1500);
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }}
          className="text-primary"
        >
          <Trophy size={80} />
        </motion.div>
        <h2 className="text-4xl font-black">Quiz Complete!</h2>
        <p className="text-2xl text-muted-foreground">Score: {score} XP</p>
        <button
          onClick={exitGame}
          className="px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <button onClick={exitGame} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft />
        </button>
        <div className="font-bold text-xl text-primary">Score: {score} XP</div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="p-8 rounded-3xl shadow-xl border"
          style={{ background: "var(--card)", color: "var(--card-foreground)", borderColor: "var(--border)" }}
        >
          <div className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "var(--card-foreground)" }}>
            Question {currentQ + 1} of {data.quiz.length}
          </div>
          
          <h3 className="text-2xl font-bold mb-8 leading-snug">
            {question.question}
          </h3>

          <div className="grid gap-3">
            {question.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = i === question.correctAnswer;

              let bgClass = "bg-muted/50 hover:bg-muted border-border";
              if (selected !== null) {
                if (isCorrect) bgClass = "bg-green-100 dark:bg-green-900/50 border-green-500 dark:border-green-400";
                else if (isSelected) bgClass = "bg-red-100 dark:bg-red-900/50 border-red-500 dark:border-red-400";
              }

              return (
                <motion.button
                  key={i}
                  whileHover={selected === null ? { scale: 1.02 } : {}}
                  whileTap={selected === null ? { scale: 0.98 } : {}}
                  onClick={() => handleSelect(i)}
                  className={cn(
                    "p-4 rounded-xl text-left font-medium transition-all border-2",
                    bgClass
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">{opt}</span>
                    {selected !== null && isCorrect && <CheckCircle className="text-green-600 dark:text-green-400" size={20} />}
                    {selected !== null && isSelected && !isCorrect && <XCircle className="text-red-600 dark:text-red-400" size={20} />}
                  </div>
                </motion.button>
              );
            })}
          </div>
          
          {selected !== null && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="mt-6 p-4 rounded-xl text-sm"
              style={{ background: "var(--card)", color: "var(--card-foreground)", borderColor: "var(--border)" }}
            >
              <p className="font-bold mb-1" style={{ color: "var(--card-foreground)" }}>Explanation:</p>
              <div style={{ color: "var(--card-foreground)" }}>{question.explanation}</div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

