// Deep work phase within a study session
export interface DeepWorkPhase {
  phase: string; // e.g., "Warm-Up", "Deep Dive", "Application", "Review"
  duration: string; // e.g., "20 minutes"
  objective: string;
  tasks: string[];
}

// Learning resource with URL and type
export interface LearningResource {
  title: string;
  type: "video" | "article" | "interactive" | "textbook" | "podcast";
  url: string;
  description: string;
  duration: string; // Time estimate (empty string if unknown)
}

// Enhanced day plan with structured phases
export interface DayPlan {
  day: number;
  title: string;
  description: string;
  learningObjectives: string[]; // Clear goals for the session
  phases: DeepWorkPhase[]; // Structured deep work phases
  resources: LearningResource[]; // Curated external sources
  keyTerms: string[]; // Important vocabulary/concepts
  checkpoints: string[]; // Self-assessment questions
  totalTime: string; // Total estimated time
}

export interface LearningModule {
  summary: string;
  learningPlan: DayPlan[];
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number; // Index
    explanation: string;
  }[];
}

export type ParseResult = {
  text: string;
  module?: LearningModule; // Optional until AI is fully hooked up
};

export interface SavedModule extends LearningModule {
  id: string;
  user_id: string;
  title: string;
  original_filename: string;
  file_type: string;
  created_at: string;
  updated_at: string;
}

export interface UploadHistory {
  id: string;
  user_id: string;
  module_id: string | null;
  filename: string;
  file_type: string;
  file_size: number;
  status: "processing" | "completed" | "failed";
  error_message: string | null;
  created_at: string;
}

