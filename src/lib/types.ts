export interface LearningModule {
  summary: string;
  learningPlan: {
    day: number;
    title: string;
    description: string;
    activities: string[];
    timeEstimate: string;
  }[];
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

