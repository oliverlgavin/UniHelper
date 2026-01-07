import { NextRequest, NextResponse } from "next/server";
import { parseFile } from "@/lib/parsers";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

// Force Node.js runtime for file parsing libraries
export const runtime = "nodejs";

// Schema for the AI output
const LearningSchema = z.object({
  summary: z.string().describe("A comprehensive summary of the uploaded document."),
  learningPlan: z.array(z.object({
    day: z.number(),
    title: z.string().describe("A specific topic title from the document content"),
    description: z.string().describe("A detailed 2-3 sentence explanation of the key concepts covered, including specific facts, definitions, or examples from the document"),
    activities: z.array(z.string()).describe("Specific learning activities that reference actual content from the document - include key terms, concepts, examples, or data points to study"),
    timeEstimate: z.string(),
  })).describe("A day-by-day learning plan with specific details from the document."),
  quiz: z.array(z.object({
    question: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.number(),
    explanation: z.string(),
  })).describe("A set of quiz questions based on specific facts from the document."),
});

export async function POST(req: NextRequest) {
  try {
    console.log("API route called");
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.log("No file in request");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log(`Processing file: ${file.name}, size: ${file.size}, type: ${file.type}`);

    // 1. Parse File
    const text = await parseFile(file);
    console.log(`Parsed text length: ${text?.length || 0}`);

    if (!text || text.length < 50) {
      return NextResponse.json({ error: "Could not extract enough text from file." }, { status: 400 });
    }

    // 2. AI Processing
    // Check for API Key
    if (!process.env.OPENAI_API_KEY) {
      console.warn("No OPENAI_API_KEY found, returning mock data.");
      return NextResponse.json(MOCK_DATA);
    }

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: LearningSchema,
      prompt: `
        You are an expert tutor who creates detailed, content-rich study plans.
        Analyze the following document and create a structured learning path.

        Content:
        ${text.slice(0, 100000)}

        Requirements:
        1. Summary: A clear, comprehensive summary of the main topics covered.

        2. Learning Plan: Create 4-6 daily study sessions. For EACH day:
           - Title: A specific topic from the document
           - Description: 2-3 sentences explaining the KEY CONCEPTS with SPECIFIC details, facts, definitions, or examples directly from the document. Do NOT use generic descriptions.
           - Activities: 3-4 specific tasks that reference ACTUAL content. Include specific terms to learn, concepts to understand, examples to analyze, or data points to memorize. Be specific - mention actual names, theories, numbers, or examples from the document.

        3. Quiz: 5-10 questions testing specific facts and concepts from the document. Questions should test actual knowledge, not just general understanding.

        IMPORTANT: All content must be specific to this document. Avoid generic study advice like "Read chapter 1" or "Review key concepts". Instead reference actual content like "Learn about Adam Smith's theory of absolute advantage" or "Compare the GDP figures for US vs China trade".
      `,
    });

    return NextResponse.json(object);

  } catch (error) {
    console.error("Processing error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({
      error: "Failed to process file",
      details: errorMessage
    }, { status: 500 });
  }
}

const MOCK_DATA = {
  summary: "This document explores the fundamentals of Quantum Mechanics, covering wave-particle duality, the uncertainty principle, and Schrödinger's equation. It breaks down complex mathematical concepts into physical interpretations.",
  learningPlan: [
    {
      day: 1,
      title: "The Quantum Leap",
      description: "Introduction to the history and basic concepts.",
      activities: ["Read Chapter 1", "Watch 'Quantum 101' Video"],
      timeEstimate: "1 Hour"
    },
    {
      day: 2,
      title: "Waves or Particles?",
      description: "Deep dive into duality.",
      activities: ["Double Slit Experiment Sim", "Quiz"],
      timeEstimate: "45 Mins"
    }
  ],
  quiz: [
    {
      question: "Who formulated the Uncertainty Principle?",
      options: ["Einstein", "Heisenberg", "Bohr", "Schrödinger"],
      correctAnswer: 1,
      explanation: "Heisenberg introduced the principle in 1927."
    }
  ]
};

