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

