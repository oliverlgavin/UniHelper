"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Target,
  BookOpen,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Video,
  FileText,
  Gamepad2,
  Headphones,
  BookMarked,
  Sparkles,
  Brain,
  Lightbulb,
  RotateCcw
} from "lucide-react";
import { DayPlan, LearningResource } from "@/lib/types";
import { cn } from "@/lib/utils";

interface EnhancedScheduleProps {
  learningPlan: DayPlan[];
  title?: string;
}

const phaseIcons: Record<string, React.ReactNode> = {
  "Warm-Up": <Lightbulb className="w-5 h-5" />,
  "Deep Dive": <Brain className="w-5 h-5" />,
  "Application": <Sparkles className="w-5 h-5" />,
  "Review": <RotateCcw className="w-5 h-5" />,
};

const phaseColors: Record<string, string> = {
  "Warm-Up": "from-amber-500 to-orange-500",
  "Deep Dive": "from-violet-500 to-purple-500",
  "Application": "from-emerald-500 to-teal-500",
  "Review": "from-blue-500 to-cyan-500",
};

const resourceIcons: Record<string, React.ReactNode> = {
  video: <Video className="w-4 h-4" />,
  article: <FileText className="w-4 h-4" />,
  interactive: <Gamepad2 className="w-4 h-4" />,
  textbook: <BookMarked className="w-4 h-4" />,
  podcast: <Headphones className="w-4 h-4" />,
};

export function EnhancedSchedule({ learningPlan, title }: EnhancedScheduleProps) {
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);
  const [exporting, setExporting] = useState(false);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const toggleDay = (day: number) => {
    setExpandedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const exportToPDF = async () => {
    if (!printRef.current) return;

    setExporting(true);
    try {
      // Dynamic import for client-side only
      const html2pdf = (await import("html2pdf.js")).default;

      const element = printRef.current;
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
        filename: `${title || 'Study-Plan'}-Schedule.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
        },
        jsPDF: {
          unit: 'in',
          format: 'a4',
          orientation: 'portrait'
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      // @ts-expect-error - html2pdf types are incomplete
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF export error:", error);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Export Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Study Schedule</h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportToPDF}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {exporting ? "Exporting..." : "Export PDF"}
        </motion.button>
      </div>

      {/* Interactive Schedule */}
      <div ref={scheduleRef} className="space-y-4">
        {learningPlan.map((day, index) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl border shadow-sm overflow-hidden"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            {/* Day Header - Always Visible */}
            <button
              onClick={() => toggleDay(day.day)}
              className="w-full p-6 flex items-center justify-between hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 text-white font-black text-lg">
                  {day.day}
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold">{day.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {day.totalTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {day.learningObjectives?.length || 0} objectives
                    </span>
                  </div>
                </div>
              </div>
              {expandedDays.includes(day.day) ? (
                <ChevronUp className="w-6 h-6 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-6 h-6 text-muted-foreground" />
              )}
            </button>

            {/* Expanded Content */}
            <AnimatePresence>
              {expandedDays.includes(day.day) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 space-y-6">
                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed">
                      {day.description}
                    </p>

                    {/* Learning Objectives */}
                    {day.learningObjectives && day.learningObjectives.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-bold flex items-center gap-2">
                          <Target className="w-5 h-5 text-primary" />
                          Learning Objectives
                        </h4>
                        <ul className="grid gap-2">
                          {day.learningObjectives.map((obj, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Deep Work Phases */}
                    {day.phases && day.phases.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-bold flex items-center gap-2">
                          <Clock className="w-5 h-5 text-primary" />
                          Study Phases
                        </h4>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {day.phases.map((phase, i) => (
                            <div
                              key={i}
                              className="p-4 rounded-xl border bg-muted/30"
                              style={{ borderColor: "var(--border)" }}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-br",
                                  phaseColors[phase.phase] || "from-gray-500 to-gray-600"
                                )}>
                                  {phaseIcons[phase.phase] || <BookOpen className="w-4 h-4" />}
                                </div>
                                <div>
                                  <p className="font-semibold text-sm">{phase.phase}</p>
                                  <p className="text-xs text-muted-foreground">{phase.duration}</p>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{phase.objective}</p>
                              <ul className="space-y-1">
                                {phase.tasks.map((task, j) => (
                                  <li key={j} className="text-xs flex items-start gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                    {task}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resources */}
                    {day.resources && day.resources.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-bold flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-primary" />
                          Recommended Resources
                        </h4>
                        <div className="grid gap-2">
                          {day.resources.map((resource, i) => (
                            <a
                              key={i}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/50 transition-colors group"
                              style={{ borderColor: "var(--border)" }}
                            >
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                {resourceIcons[resource.type] || <FileText className="w-5 h-5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                                  {resource.title}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {resource.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                {resource.duration && (
                                  <span className="text-xs">{resource.duration}</span>
                                )}
                                <ExternalLink className="w-4 h-4 group-hover:text-primary transition-colors" />
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Terms */}
                    {day.keyTerms && day.keyTerms.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-bold flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-primary" />
                          Key Terms
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {day.keyTerms.map((term, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                            >
                              {term}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Checkpoints */}
                    {day.checkpoints && day.checkpoints.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                          Self-Check Questions
                        </h4>
                        <div className="space-y-2 p-4 rounded-xl bg-muted/30 border" style={{ borderColor: "var(--border)" }}>
                          {day.checkpoints.map((checkpoint, i) => (
                            <p key={i} className="text-sm flex items-start gap-2">
                              <span className="text-primary font-bold">{i + 1}.</span>
                              {checkpoint}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Hidden Print Version for PDF Export */}
      <div className="fixed -left-[9999px] top-0">
        <div ref={printRef} className="pdf-export" style={{ width: '210mm', background: 'white', color: 'black', padding: '20mm' }}>
          <style>{`
            .pdf-export { font-family: 'Georgia', serif; }
            .pdf-export h1 { font-size: 28px; font-weight: bold; color: #8b5cf6; margin-bottom: 8px; }
            .pdf-export h2 { font-size: 22px; font-weight: bold; color: #1f2937; margin-top: 24px; margin-bottom: 12px; border-bottom: 2px solid #8b5cf6; padding-bottom: 8px; }
            .pdf-export h3 { font-size: 16px; font-weight: bold; color: #374151; margin-top: 16px; margin-bottom: 8px; }
            .pdf-export h4 { font-size: 14px; font-weight: 600; color: #8b5cf6; margin-top: 12px; margin-bottom: 6px; }
            .pdf-export p { font-size: 12px; color: #4b5563; line-height: 1.6; margin-bottom: 8px; }
            .pdf-export .day-header { background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); color: white; padding: 16px; border-radius: 12px; margin-bottom: 16px; }
            .pdf-export .day-number { font-size: 14px; font-weight: bold; opacity: 0.9; }
            .pdf-export .day-title { font-size: 20px; font-weight: bold; margin: 0; }
            .pdf-export .day-meta { font-size: 11px; opacity: 0.9; margin-top: 4px; }
            .pdf-export .section { margin-bottom: 16px; padding: 12px; background: #f9fafb; border-radius: 8px; border-left: 3px solid #8b5cf6; }
            .pdf-export .phase-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px; }
            .pdf-export .phase-card { padding: 12px; background: white; border-radius: 8px; border: 1px solid #e5e7eb; }
            .pdf-export .phase-name { font-weight: 600; color: #8b5cf6; font-size: 13px; }
            .pdf-export .phase-duration { font-size: 11px; color: #6b7280; }
            .pdf-export .phase-objective { font-size: 11px; color: #4b5563; margin: 4px 0; }
            .pdf-export .phase-tasks { font-size: 10px; color: #6b7280; padding-left: 12px; }
            .pdf-export .phase-tasks li { margin-bottom: 2px; }
            .pdf-export .resource-item { padding: 8px 12px; background: white; border-radius: 6px; border: 1px solid #e5e7eb; margin-bottom: 6px; }
            .pdf-export .resource-title { font-weight: 600; font-size: 12px; color: #1f2937; }
            .pdf-export .resource-desc { font-size: 10px; color: #6b7280; }
            .pdf-export .resource-url { font-size: 9px; color: #8b5cf6; word-break: break-all; }
            .pdf-export .terms { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
            .pdf-export .term { padding: 4px 10px; background: #ede9fe; color: #7c3aed; border-radius: 9999px; font-size: 11px; font-weight: 500; }
            .pdf-export .checkpoint { font-size: 11px; color: #374151; padding: 6px 0; border-bottom: 1px dashed #e5e7eb; }
            .pdf-export .checkpoint:last-child { border-bottom: none; }
            .pdf-export .objective-item { font-size: 11px; color: #374151; padding: 4px 0; padding-left: 16px; position: relative; }
            .pdf-export .objective-item::before { content: '✓'; position: absolute; left: 0; color: #10b981; font-weight: bold; }
            .pdf-export .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 10px; color: #9ca3af; }
            .pdf-export .page-break { page-break-before: always; }
          `}</style>

          <h1>Study Schedule</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
            {title || 'Your Personalized Learning Plan'} | Generated by UniHelper
          </p>

          {learningPlan.map((day, dayIndex) => (
            <div key={day.day} className={dayIndex > 0 ? 'page-break' : ''}>
              <div className="day-header">
                <div className="day-number">DAY {day.day}</div>
                <div className="day-title">{day.title}</div>
                <div className="day-meta">{day.totalTime} | {day.learningObjectives?.length || 0} Learning Objectives</div>
              </div>

              <p>{day.description}</p>

              {day.learningObjectives && day.learningObjectives.length > 0 && (
                <div className="section">
                  <h4>Learning Objectives</h4>
                  {day.learningObjectives.map((obj, i) => (
                    <div key={i} className="objective-item">{obj}</div>
                  ))}
                </div>
              )}

              {day.phases && day.phases.length > 0 && (
                <>
                  <h3>Study Phases</h3>
                  <div className="phase-grid">
                    {day.phases.map((phase, i) => (
                      <div key={i} className="phase-card">
                        <div className="phase-name">{phase.phase}</div>
                        <div className="phase-duration">{phase.duration}</div>
                        <div className="phase-objective">{phase.objective}</div>
                        <ul className="phase-tasks">
                          {phase.tasks.map((task, j) => (
                            <li key={j}>{task}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {day.resources && day.resources.length > 0 && (
                <>
                  <h3>Recommended Resources</h3>
                  {day.resources.map((resource, i) => (
                    <div key={i} className="resource-item">
                      <div className="resource-title">{resource.title} ({resource.type})</div>
                      <div className="resource-desc">{resource.description}</div>
                      <div className="resource-url">{resource.url}</div>
                    </div>
                  ))}
                </>
              )}

              {day.keyTerms && day.keyTerms.length > 0 && (
                <>
                  <h3>Key Terms</h3>
                  <div className="terms">
                    {day.keyTerms.map((term, i) => (
                      <span key={i} className="term">{term}</span>
                    ))}
                  </div>
                </>
              )}

              {day.checkpoints && day.checkpoints.length > 0 && (
                <>
                  <h3>Self-Check Questions</h3>
                  <div className="section">
                    {day.checkpoints.map((checkpoint, i) => (
                      <div key={i} className="checkpoint">{i + 1}. {checkpoint}</div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}

          <div className="footer">
            Generated by UniHelper | Your AI-Powered Study Companion
          </div>
        </div>
      </div>
    </div>
  );
}
