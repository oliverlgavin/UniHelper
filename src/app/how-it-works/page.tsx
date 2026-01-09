"use client";

import { motion } from "framer-motion";
import { Upload, FileText, Gamepad2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function HowItWorks() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 p-4 sm:p-6 md:p-12 flex flex-col gap-6 md:gap-8 max-w-[1400px] mx-auto min-h-screen">

        <header className="w-full py-2 pb-4 md:pb-6">
          <div className="flex items-center justify-between w-full">
            <Link href="/" className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-2 backdrop-blur-sm bg-white/30 dark:bg-black/30 px-3 py-1 rounded-full">
                🎓 Uni<span className="text-primary">Helper</span>
              </h1>
            </Link>

            <nav className="flex items-center gap-4 backdrop-blur-sm bg-white/30 dark:bg-black/30 px-4 py-2 rounded-full">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={16} />
                Back
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1"
        >
          <div className="text-center mb-12 md:mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4"
            >
              How it <span className="text-primary">Works</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto"
            >
              Transform your study materials into an interactive learning experience in three simple steps.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 md:p-8 rounded-2xl bg-card border border-border shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Upload Your Notes</h3>
              <p className="text-muted-foreground">
                Drag and drop your lecture notes in PDF, DOCX, or PPTX format. We support all common document types.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 md:p-8 rounded-2xl bg-card border border-border shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <FileText className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Generates Content</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your document and creates a concise summary, personalized study plan, and quiz questions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 md:p-8 rounded-2xl bg-card border border-border shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <Gamepad2 className="text-secondary" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Play & Learn</h3>
              <p className="text-muted-foreground">
                Test your knowledge with interactive quizzes. Earn XP, track progress, and make studying fun!
              </p>
            </motion.div>
          </div>

          {/* Additional Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          >
            <div className="p-6 md:p-8 rounded-2xl bg-card border border-border">
              <h3 className="text-2xl font-bold mb-4">Supported File Types</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <strong>PDF</strong> - Lecture slides, textbook chapters, research papers
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  <strong>DOCX</strong> - Word documents, course notes, essays
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <strong>PPTX</strong> - PowerPoint presentations, lecture decks
                </li>
              </ul>
            </div>

            <div className="p-6 md:p-8 rounded-2xl bg-card border border-border">
              <h3 className="text-2xl font-bold mb-4">What You Get</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <strong>Smart Summary</strong> - Key concepts distilled into digestible points
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  <strong>Study Plan</strong> - Multi-day learning schedule tailored to your content
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <strong>Interactive Quiz</strong> - Test yourself and earn XP as you learn
                </li>
              </ul>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Get Started Now
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
