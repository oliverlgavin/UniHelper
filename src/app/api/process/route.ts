import { NextRequest, NextResponse } from "next/server";
import { parseFile } from "@/lib/parsers";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// Force Node.js runtime for file parsing libraries
export const runtime = "nodejs";

// Schema for deep work phases
const DeepWorkPhaseSchema = z.object({
  phase: z.string().describe("Phase name: 'Warm-Up', 'Deep Dive', 'Application', or 'Review'"),
  duration: z.string().describe("Time for this phase, e.g., '20 minutes'"),
  objective: z.string().describe("What the student should accomplish in this phase"),
  tasks: z.array(z.string()).describe("Specific actionable tasks for this phase"),
});

// Schema for learning resources
const LearningResourceSchema = z.object({
  title: z.string().describe("Name of the resource"),
  type: z.enum(["video", "article", "interactive", "textbook", "podcast"]),
  url: z.string().describe("Use YouTube search URLs like https://www.youtube.com/results?search_query=topic+here or Wikipedia URLs like https://en.wikipedia.org/wiki/Topic_Name - these always work"),
  description: z.string().describe("Brief description of what this resource covers"),
  duration: z.string().describe("Time to complete this resource (e.g., '10 minutes', '30 minutes'). Use empty string if unknown."),
});

// Schema for the AI output - Enhanced version
const LearningSchema = z.object({
  summary: z.string().describe("A comprehensive summary of the uploaded document highlighting key themes and takeaways."),
  learningPlan: z.array(z.object({
    day: z.number(),
    title: z.string().describe("A specific, engaging topic title from the document content"),
    description: z.string().describe("A compelling 2-3 sentence overview that motivates why this topic matters and what insights the student will gain"),
    learningObjectives: z.array(z.string()).describe("3-4 clear, measurable learning outcomes using action verbs (e.g., 'Explain...', 'Analyze...', 'Compare...')"),
    phases: z.array(DeepWorkPhaseSchema).describe("4 structured phases: Warm-Up (activate prior knowledge), Deep Dive (core learning), Application (practice), Review (consolidate)"),
    resources: z.array(LearningResourceSchema).describe("2-3 curated external resources with REAL URLs from reputable educational sources like Khan Academy, Coursera, YouTube edu channels, academic sites"),
    keyTerms: z.array(z.string()).describe("5-8 essential vocabulary terms or concepts from this section"),
    checkpoints: z.array(z.string()).describe("2-3 self-assessment questions to verify understanding"),
    totalTime: z.string().describe("Total time estimate, typically 45-90 minutes per session"),
  })).describe("A day-by-day immersive learning plan structured around a 2-3 hour class session, broken into focused study sessions."),
  quiz: z.array(z.object({
    question: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.number(),
    explanation: z.string(),
  })).min(10).max(15).describe("10-15 quiz questions testing specific facts and concepts from the document. Include a mix of easy, medium, and hard questions."),
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      return NextResponse.json({
        ...MOCK_DATA,
        userId: user.id,
        filename: file.name,
        fileType: file.type,
        fileSize: file.size,
      });
    }

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: LearningSchema,
      prompt: `
        You are an expert academic advisor and curriculum designer creating premium, immersive study plans.
        This document represents material typically covered in a 2-3 hour university class session.

        Analyze the following document and create a structured, engaging learning experience:

        Content:
        ${text.slice(0, 100000)}

        REQUIREMENTS:

        1. SUMMARY: Write an engaging overview that:
           - Highlights the core themes and key takeaways
           - Explains why this material matters in the real world
           - Previews the learning journey ahead

        2. LEARNING PLAN: Create 2-3 focused study sessions (days). Since this is one class session worth of material, don't stretch it artificially. For EACH day:

           a) Title & Description:
              - Compelling, specific title from the content
              - 2-3 sentences that motivate and excite about the topic

           b) Learning Objectives (3-4):
              - Use Bloom's taxonomy verbs: Explain, Analyze, Compare, Evaluate, Apply
              - Be specific: "Explain the concept of comparative advantage using the US-China trade example"

           c) Deep Work Phases (4 phases totaling ~60-90 minutes):
              - WARM-UP (10-15 min): Activate prior knowledge, preview key concepts
              - DEEP DIVE (25-35 min): Core learning, engage with main material
              - APPLICATION (15-20 min): Practice problems, case studies, examples
              - REVIEW (10-15 min): Summarize, self-test, consolidate

           d) Resources (2-3 per day):
              CRITICAL: Only use these VERIFIED FREE resources with EXACT URL patterns:

              - Khan Academy: https://www.khanacademy.org/[subject]/[topic] (always free)
              - YouTube videos: https://www.youtube.com/results?search_query=[topic]+educational (search link)
              - Wikipedia: https://en.wikipedia.org/wiki/[Topic_Name] (always free)
              - Investopedia (for business/economics): https://www.investopedia.com/terms/[letter]/[term].asp
              - BBC Bitesize (for general topics): https://www.bbc.co.uk/bitesize/topics/[topic]
              - MIT OpenCourseWare: https://ocw.mit.edu/search/?q=[topic]
              - CrashCourse YouTube: https://www.youtube.com/results?search_query=crash+course+[topic]

              DO NOT use:
              - Coursera, Udemy, LinkedIn Learning (paywalled)
              - Random academic paper links
              - Made-up or guessed URLs
              - Any URL you're not 100% certain exists

              When in doubt, use YouTube search links or Wikipedia which are guaranteed to work.

           e) Key Terms (5-8): Essential vocabulary with brief definitions implied

           f) Checkpoints (2-3): Self-assessment questions to verify understanding

        3. QUIZ: Create exactly 12-15 questions that:
           - Test specific facts from this document, not general knowledge
           - Include a mix of difficulty: 4-5 easy (recall), 4-5 medium (comprehension), 3-5 hard (application/analysis)
           - Have clear, educational explanations for each answer
           - Cover all major topics from the document

        CRITICAL RULES:
        - Be SPECIFIC to this document. No generic advice.
        - Use REAL URLs from reputable educational platforms
        - Time estimates should be realistic for university students
        - Make the content feel like a premium, curated learning experience
      `,
    });

    return NextResponse.json({
      ...object,
      userId: user.id,
      filename: file.name,
      fileType: file.type,
      fileSize: file.size,
    });

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
  summary: "This document explores the fundamentals of Quantum Mechanics, covering wave-particle duality, the uncertainty principle, and Schrödinger's equation. Understanding quantum mechanics is essential for modern physics, chemistry, and emerging technologies like quantum computing. You'll journey from classical physics limitations to the revolutionary quantum worldview.",
  learningPlan: [
    {
      day: 1,
      title: "The Quantum Revolution: From Classical to Quantum",
      description: "Discover why classical physics failed to explain atomic phenomena and how quantum mechanics emerged as a revolutionary framework. You'll understand the historical context that led scientists to completely rethink the nature of reality.",
      learningObjectives: [
        "Explain why classical physics failed to describe blackbody radiation",
        "Analyze Planck's quantum hypothesis and its implications",
        "Compare the classical and quantum descriptions of light",
        "Evaluate the significance of the photoelectric effect"
      ],
      phases: [
        {
          phase: "Warm-Up",
          duration: "15 minutes",
          objective: "Activate prior knowledge of classical physics",
          tasks: [
            "Review the wave nature of light from classical physics",
            "Consider: What do you already know about atoms and electrons?",
            "Preview the key terms for today's session"
          ]
        },
        {
          phase: "Deep Dive",
          duration: "30 minutes",
          objective: "Understand the quantum revolution",
          tasks: [
            "Study the ultraviolet catastrophe and blackbody radiation",
            "Learn Planck's quantum hypothesis E = hf",
            "Analyze Einstein's explanation of the photoelectric effect"
          ]
        },
        {
          phase: "Application",
          duration: "20 minutes",
          objective: "Apply quantum concepts to real scenarios",
          tasks: [
            "Calculate photon energies for different light frequencies",
            "Explain why red light doesn't eject electrons from certain metals",
            "Work through example problems on photoelectric effect"
          ]
        },
        {
          phase: "Review",
          duration: "10 minutes",
          objective: "Consolidate learning",
          tasks: [
            "Summarize the key differences between classical and quantum physics",
            "Answer checkpoint questions",
            "Identify areas needing further review"
          ]
        }
      ],
      resources: [
        {
          title: "Quantum Physics - Khan Academy",
          type: "video",
          url: "https://www.khanacademy.org/science/physics/quantum-physics",
          description: "Comprehensive video series on quantum physics fundamentals",
          duration: "20 minutes"
        },
        {
          title: "Quantum Mechanics Videos - YouTube",
          type: "video",
          url: "https://www.youtube.com/results?search_query=quantum+mechanics+introduction+educational",
          description: "Search results for educational quantum mechanics videos",
          duration: "15 minutes"
        },
        {
          title: "Introduction to Quantum Mechanics - Wikipedia",
          type: "article",
          url: "https://en.wikipedia.org/wiki/Introduction_to_quantum_mechanics",
          description: "Detailed overview of quantum mechanics history and concepts",
          duration: ""
        }
      ],
      keyTerms: ["Quantization", "Photon", "Planck's constant", "Photoelectric effect", "Blackbody radiation", "Wave-particle duality"],
      checkpoints: [
        "Can you explain why Planck introduced the concept of quantization?",
        "What evidence supports the particle nature of light?",
        "How does the photoelectric effect contradict classical predictions?"
      ],
      totalTime: "75 minutes"
    },
    {
      day: 2,
      title: "Wave-Particle Duality: The Double-Slit Experiment",
      description: "Explore the mind-bending double-slit experiment that reveals the fundamental weirdness of quantum mechanics. This experiment shows that particles can behave like waves and raises deep questions about the nature of observation and reality.",
      learningObjectives: [
        "Describe the setup and results of the double-slit experiment",
        "Analyze how particles create interference patterns",
        "Evaluate the role of measurement in quantum mechanics",
        "Apply wave-particle duality concepts to explain quantum phenomena"
      ],
      phases: [
        {
          phase: "Warm-Up",
          duration: "10 minutes",
          objective: "Connect to previous learning",
          tasks: [
            "Recall the particle nature of light from Day 1",
            "Review classical wave interference concepts",
            "Preview: What happens when we fire single electrons?"
          ]
        },
        {
          phase: "Deep Dive",
          duration: "35 minutes",
          objective: "Master wave-particle duality",
          tasks: [
            "Study Young's double-slit experiment with light",
            "Analyze the electron double-slit experiment results",
            "Understand the role of observation in collapsing wave functions",
            "Learn about de Broglie wavelength"
          ]
        },
        {
          phase: "Application",
          duration: "15 minutes",
          objective: "Apply duality concepts",
          tasks: [
            "Calculate de Broglie wavelengths for various particles",
            "Predict interference patterns for different slit configurations",
            "Analyze 'which-path' information and its effects"
          ]
        },
        {
          phase: "Review",
          duration: "15 minutes",
          objective: "Integrate understanding",
          tasks: [
            "Explain wave-particle duality in your own words",
            "Complete checkpoint questions",
            "Prepare questions for further study"
          ]
        }
      ],
      resources: [
        {
          title: "Double Slit Experiment - YouTube",
          type: "video",
          url: "https://www.youtube.com/results?search_query=double+slit+experiment+explained",
          description: "Search results for visual demonstrations of the double-slit experiment",
          duration: "10 minutes"
        },
        {
          title: "Wave Interference - PhET Simulations",
          type: "interactive",
          url: "https://phet.colorado.edu/en/simulations/filter?subjects=physics&type=html",
          description: "Interactive physics simulations from University of Colorado",
          duration: "15 minutes"
        },
        {
          title: "Wave-Particle Duality - Wikipedia",
          type: "article",
          url: "https://en.wikipedia.org/wiki/Wave%E2%80%93particle_duality",
          description: "Comprehensive article on wave-particle duality in quantum mechanics",
          duration: ""
        }
      ],
      keyTerms: ["Double-slit experiment", "Interference pattern", "de Broglie wavelength", "Wave function", "Superposition", "Measurement problem", "Copenhagen interpretation"],
      checkpoints: [
        "Why do single electrons create an interference pattern over time?",
        "How does observation affect the double-slit results?",
        "What is the de Broglie wavelength of a baseball? Why don't we see quantum effects in daily life?"
      ],
      totalTime: "75 minutes"
    }
  ],
  quiz: [
    {
      question: "Who formulated the Uncertainty Principle?",
      options: ["Einstein", "Heisenberg", "Bohr", "Schrödinger"],
      correctAnswer: 1,
      explanation: "Werner Heisenberg introduced the uncertainty principle in 1927, showing that we cannot simultaneously know both the exact position and momentum of a particle."
    },
    {
      question: "What phenomenon did Max Planck's quantum hypothesis originally explain?",
      options: ["The photoelectric effect", "Blackbody radiation", "Electron diffraction", "Nuclear decay"],
      correctAnswer: 1,
      explanation: "Planck introduced quantization to explain the spectrum of blackbody radiation, solving the 'ultraviolet catastrophe' that classical physics couldn't explain."
    }
  ]
};

