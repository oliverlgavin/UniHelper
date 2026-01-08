"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/use-app-store";
import { BookOpen, Calendar, Trash2, ArrowLeft } from "lucide-react";

export function LibraryView() {
  const { savedModules, setSavedModules, loadModule, removeSavedModule, reset } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      const response = await fetch("/api/modules");
      if (!response.ok) throw new Error("Failed to load modules");

      const { modules } = await response.json();
      setSavedModules(modules);
    } catch (error) {
      console.error("Error loading modules:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this module?")) return;

    try {
      const response = await fetch(`/api/modules/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete module");

      removeSavedModule(id);
    } catch (error) {
      console.error("Error deleting module:", error);
      alert("Failed to delete module. Please try again.");
    }
  };

  const handleLoadModule = (module: any) => {
    loadModule({
      summary: module.summary,
      learningPlan: module.learning_plan,
      quiz: module.quiz,
      id: module.id,
      created_at: module.created_at,
      title: module.title,
      original_filename: module.original_filename,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl font-bold text-muted-foreground">Loading your library...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black tracking-tight">My Library</h1>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card hover:bg-muted transition-colors font-bold"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      {savedModules.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen size={64} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No saved modules yet</h2>
          <p className="text-muted-foreground mb-6">
            Upload a document and save it to see it here!
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
          >
            Upload Your First Document
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleLoadModule(module)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {module.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar size={14} />
                    {new Date(module.created_at).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(module.id);
                  }}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 size={18} className="text-red-600" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {module.summary}
              </p>

              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {module.learning_plan?.length || 0} days
                </span>
                <span className="font-medium">
                  {module.quiz?.length || 0} questions
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
