"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/store/use-app-store";
import { Calendar, Clock, BookOpen, Gamepad2, RefreshCcw, Save, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function DashboardView() {
  const { data, reset, enterGame, user, currentModuleId, addSavedModule } = useAppStore();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(!!currentModuleId);

  if (!data) return null;

  // Ensure arrays exist to prevent map errors
  const learningPlan = data.learningPlan || [];
  const quiz = data.quiz || [];

  const handleSave = async () => {
    if (!user || !data) return;

    setSaving(true);

    try {
      // Prompt for title
      const title = window.prompt("Enter a title for this module:", learningPlan[0]?.title || "Untitled Module");

      if (!title) {
        setSaving(false);
        return;
      }

      const response = await fetch("/api/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          summary: data.summary,
          learningPlan: learningPlan,
          quiz: quiz,
          original_filename: (data as any).filename || "unknown.pdf",
          file_type: (data as any).fileType || "application/pdf",
        }),
      });

      if (!response.ok) throw new Error("Failed to save module");

      const { module } = await response.json();
      addSavedModule(module);
      setSaved(true);
      alert("Module saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save module. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header / Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 md:grid-cols-3"
      >
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-4xl font-black tracking-tight">Your Learning Plan</h1>
          <div
            className="p-6 rounded-3xl shadow-sm border"
            style={{ background: "var(--card)", color: "var(--card-foreground)", borderColor: "var(--border)" }}
          >
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <BookOpen className="text-primary" /> Summary
            </h2>
            <p className="leading-relaxed" style={{ color: "var(--card-foreground)" }}>
              {data.summary}
            </p>
          </div>
        </div>

        <div className="md:col-span-1 flex flex-col gap-4">
          {user && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={saving || saved}
              className={cn(
                "rounded-2xl p-4 font-bold flex items-center justify-center gap-3 shadow-md border-2 transition-all",
                saved
                  ? "bg-green-500/10 text-green-600 border-green-500/30 cursor-default"
                  : "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 hover:border-primary/50",
                "disabled:opacity-50"
              )}
            >
              {saved ? (
                <>
                  <Check size={20} /> Saved
                </>
              ) : (
                <>
                  <Save size={20} /> {saving ? "Saving..." : "Save Module"}
                </>
              )}
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={reset}
            className="bg-card hover:bg-muted/80 transition-all rounded-2xl p-4 font-bold flex items-center justify-center gap-3 border-2 border-border shadow-md hover:shadow-lg hover:border-muted-foreground/30"
          >
            <RefreshCcw size={20} className="text-accent" />
            <span>Upload New</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-secondary text-secondary-foreground rounded-3xl p-6 font-black text-2xl shadow-lg flex flex-col items-center justify-center gap-2 border-2 border-black"
            onClick={enterGame}
          >
            <Gamepad2 size={40} />
            Play Quiz
          </motion.button>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Daily Schedule</h2>
        <div className="grid gap-4">
          {learningPlan.map((item, index) => (
            <motion.div
              key={item.day}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              style={{ background: "var(--card)", color: "var(--card-foreground)", borderColor: "var(--border)" }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <span className="bg-primary text-white font-bold px-3 py-1 rounded-full text-sm">
                    Day {item.day}
                  </span>
                    <h3 className="text-xl font-bold" style={{ color: "var(--card-foreground)" }}>{item.title}</h3>
                </div>
                  <div className="flex items-center gap-2 text-sm bg-muted px-3 py-1 rounded-full w-fit" style={{ color: "var(--card-foreground)" }}>
                  <Clock size={14} /> {item.timeEstimate}
                </div>
              </div>
              
                <p className="mb-4" style={{ color: "var(--card-foreground)" }}>{item.description}</p>
              
              <div className="space-y-2">
                  <h4 className="font-bold text-sm uppercase tracking-wider" style={{ color: "var(--card-foreground)" }}>Activities</h4>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {item.activities.map((act, i) => (
                      <li key={i} className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg text-sm" style={{ color: "var(--card-foreground)" }}>
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      {act}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

