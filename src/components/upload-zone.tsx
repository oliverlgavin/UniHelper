"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileType, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startProcessing, setResults, setError } = useAppStore();

  const handleFile = async (file: File) => {
    if (!file) return;

    // Basic client-side validation
    const validTypes = [
      "application/pdf", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ];
    // Note: MIME type checking can be tricky on some browsers/OSs, so checking extension is often safer fallback
    const validExtensions = [".pdf", ".docx", ".pptx"];
    const fileExt = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    
    if (!validExtensions.includes(fileExt)) {
      setError("Please upload a PDF, DOCX, or PPTX file.");
      return;
    }

    startProcessing();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.details || data.error || "Failed to process file";
        throw new Error(errorMsg);
      }

      setResults(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong processing your file.";
      setError(errorMessage);
      console.error("Upload error:", err);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <motion.div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={{
          borderColor: isDragging ? "var(--primary)" : "var(--border)",
          backgroundColor: isDragging ? "rgba(139, 92, 246, 0.05)" : "var(--card)",
        }}
        className={cn(
          "relative cursor-pointer group rounded-3xl border-4 border-dashed h-[400px] flex flex-col items-center justify-center p-10 transition-colors shadow-xl",
          "bg-white dark:bg-slate-900"
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.docx,.pptx"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: isDragging ? -10 : 0 }}
            className="p-6 bg-primary/10 rounded-full text-primary mb-2"
          >
            {isDragging ? <Sparkles size={48} /> : <Upload size={48} />}
          </motion.div>

          <div>
            <h3 className="text-2xl font-bold mb-2">
              {isDragging ? "Drop it here" : "Upload your Lecture"}
            </h3>
            <p className="text-muted-foreground">
              Support for PDF, DOCX, PPTX
            </p>
          </div>
          
          <div className="flex gap-2 text-sm text-muted-foreground/60">
            <span className="flex items-center gap-1"><FileType size={14}/> Auto-Summary</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Sparkles size={14}/> Quiz Gen</span>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
           <motion.div 
             className="absolute -top-20 -right-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"
             animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
             transition={{ duration: 5, repeat: Infinity }}
           />
           <motion.div 
             className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
             animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0] }}
             transition={{ duration: 7, repeat: Infinity }}
           />
        </div>
      </motion.div>
    </div>
  );
}

