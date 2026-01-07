"use client";

import { UploadZone } from "@/components/upload-zone";
import { ProcessingView } from "@/components/processing-view";
import { DashboardView } from "@/components/dashboard-view";
import { GameView } from "@/components/game-view";
import { useAppStore } from "@/store/use-app-store";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Zap, BrainCircuit } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import MobileNav from "@/components/MobileNav";

export default function Home() {
  const { view, error } = useAppStore();

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 p-4 sm:p-6 md:p-12 flex flex-col gap-6 md:gap-8 max-w-[1400px] mx-auto min-h-screen">
        
        <header className="w-full py-2 pb-4 md:pb-6">
          {/* Mobile bar: full-width with title left and hamburger right */}
          <div className="w-full flex items-center justify-between md:hidden px-2">
            <h1 className="text-lg font-black tracking-tighter flex items-center gap-2 backdrop-blur-sm bg-white/30 dark:bg-black/30 px-3 py-1 rounded-full">
              🎓 Uni<span className="text-primary">Helper</span>
            </h1>
            <MobileNav />
          </div>

          {/* Desktop header: original layout for md+ */}
          <div className="hidden md:flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-2 backdrop-blur-sm bg-white/30 dark:bg-black/30 px-3 py-1 rounded-full">
                🎓 Uni<span className="text-primary">Helper</span>
              </h1>
            </div>

            <nav className="flex items-center gap-6 text-sm font-bold text-muted-foreground backdrop-blur-sm bg-white/30 dark:bg-black/30 px-4 py-2 rounded-full">
              <a href="#" className="hover:text-foreground transition-colors">How it works</a>
              <a href="#" className="hover:text-foreground transition-colors">Features</a>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">Sign In</a>
              <div className="ml-2">
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {view === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center mt-8 md:mt-10 lg:mt-16"
            >
              {/* 1. Header Group */}
              <div className="flex flex-col gap-4 text-center lg:text-left order-1 lg:col-start-1 lg:row-start-1 pointer-events-none">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-secondary/20 text-secondary-foreground font-bold text-xs md:text-sm w-fit mx-auto lg:mx-0 lg:-ml-12"
                >
                  <Sparkles size={14} />
                  <span>AI-Powered Study Buddy</span>
                </motion.div>
                
                <div className="flex flex-col items-center lg:items-start text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] md:leading-[0.9] drop-shadow-sm">
                  <span className="-ml-4">Turn</span>
                  <span className="text-primary">Lectures</span>
                  <span>Into Games</span>
                </div>
              </div>

              {/* 2. Upload Zone */}
              <div className="relative w-full max-w-xl mx-auto lg:max-w-none order-2 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2 z-20">
                 {/* Adding a slight backdrop blur to make text readable if lanyard swings behind */}
                 <UploadZone />
              </div>

              {/* 3. Info Group */}
              <div className="flex flex-col gap-6 md:gap-8 text-center lg:text-left order-3 lg:col-start-1 lg:row-start-2 pointer-events-none">
                <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed drop-shadow-sm">
                  Stop falling asleep in PDFs. Upload your notes and get an instant summary, study plan, and gamified quiz.
                </p>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-3 md:gap-4 justify-center lg:justify-start pointer-events-auto">
                   <div className="flex items-center gap-2 bg-black text-white dark:bg-slate-800 dark:text-card-foreground backdrop-blur-md px-4 py-2 md:px-5 md:py-3 rounded-2xl shadow-sm border border-border font-bold text-xs md:text-sm">
                      <BrainCircuit className="text-primary" size={18} />
                      <span>Smart Summaries</span>
                   </div>
                   <div className="flex items-center gap-2 bg-black text-white dark:bg-slate-800 dark:text-card-foreground backdrop-blur-md px-4 py-2 md:px-5 md:py-3 rounded-2xl shadow-sm border border-border font-bold text-xs md:text-sm">
                      <Zap className="text-accent" size={18} />
                      <span>Instant Quizzes</span>
                   </div>
                </div>
              </div>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-full order-4 bg-red-50 text-red-500 px-4 py-2 rounded-lg font-medium text-center z-30"
                >
                  {error}
                </motion.div>
              )}
            </motion.div>
          )}

          {view === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex items-center justify-center min-h-[50vh] md:min-h-[60vh]"
            >
              <ProcessingView />
            </motion.div>
          )}

          {view === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <DashboardView />
            </motion.div>
          )}

          {view === "game" && (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full"
            >
              <GameView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
