# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UniHelper is an AI-powered educational web application that transforms lecture notes into interactive learning experiences. Users upload PDF/DOCX/PPTX files, and the app generates summaries, multi-day learning plans, and interactive quiz games.

## Development Commands

```bash
# Development
npm run dev              # Start dev server at http://localhost:3000 (uses webpack)

# Production
npm run build            # Build for production (uses webpack)
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
```

## Environment Setup

Create `.env.local` with:
```
OPENAI_API_KEY=your_key_here
```

Note: The app falls back to mock data if no API key is configured, allowing development without OpenAI access.

## Architecture Overview

### Core Flow
```
User Upload → /api/process → Document Parser → OpenAI → Zustand Store → View Rendering
```

The app uses a state machine with 4 views: `landing` → `processing` → `dashboard` → `game`

### Key Technologies
- **Next.js 16** with App Router (not Pages Router)
- **Zustand** for state management (single global store)
- **OpenAI GPT-4o** with structured output via Zod schemas
- **Document Parsers**: mammoth (DOCX), pdf-parse (PDF), officeparser (PPTX)
- **Tailwind CSS 4** with CSS variables for theming
- **PWA-enabled** with offline support via @ducanh2912/next-pwa

### Directory Structure

```
/src
  /app
    page.tsx              # Root view router
    layout.tsx            # Root layout with theme provider
    /api/process
      route.ts            # POST endpoint for document processing
  /components
    upload-zone.tsx       # File upload with drag-drop
    processing-view.tsx   # Loading state
    dashboard-view.tsx    # Results display
    game-view.tsx         # Quiz interface with scoring
    ThemeToggle.tsx       # Light/dark mode toggle
    MobileNav.tsx         # Responsive navigation
  /store
    use-app-store.ts      # Zustand store (view state, data, actions)
  /lib
    parsers.ts            # Document parsing logic
    types.ts              # TypeScript interfaces
    utils.ts              # Utility functions (cn, etc.)
```

## State Management

Single Zustand store at `/src/store/use-app-store.ts`:

```typescript
{
  view: "landing" | "processing" | "dashboard" | "game",
  data: LearningModule | null,     // AI-generated content
  error: string | null,

  // Actions
  startProcessing()                 // Set view to processing
  setResults(data)                  // Store AI response, go to dashboard
  setError(error)                   // Handle errors
  enterGame()                       // Switch to game view
  exitGame()                        // Return to dashboard
  reset()                           // Return to landing
}
```

## API Endpoint

`POST /api/process` accepts FormData with a file, extracts text based on type, sends to OpenAI with a Zod schema, and returns structured JSON:

```typescript
{
  summary: string,
  learningPlan: Array<{day: number, activities: string[]}>,
  quiz: Array<{question: string, options: string[], correctAnswer: number}>
}
```

The endpoint automatically selects the correct parser (mammoth/pdf-parse/officeparser) based on file extension.

## Styling System

- **CSS Variables** in `globals.css` for theme colors (light/dark modes)
- **Tailwind utilities** for layout and styling
- **Framer Motion** for view transitions and animations
- **Theme persistence** via localStorage in ThemeToggle component
- **Responsive breakpoints**: Mobile-first design with `sm`, `md`, `lg` breakpoints

Primary colors: Violet (#8b5cf6), Lime (#a3e635), Orange (#f97316)

## PWA Configuration

The app is configured as a Progressive Web App:
- Manifest at `/public/manifest.json`
- Service worker configuration in `next.config.ts`
- Offline support enabled via `@ducanh2912/next-pwa`
- Installable on mobile devices with standalone display mode

## Important Notes

- **Webpack Mode**: The project explicitly uses webpack (`--webpack` flag) instead of Turbopack
- **Native Modules**: Webpack config includes externals for native dependencies (canvas, pdf-parse)
- **Path Aliases**: `@/*` maps to `./src/*` (configured in tsconfig.json)
- **React 19**: Uses the latest React version with concurrent features
- **AI Schema**: OpenAI responses are validated with Zod schemas for type safety
- **Quiz Scoring**: Each correct answer awards 100 XP, confetti animates on success

## Common Development Patterns

When adding new features:
1. Update types in `/src/lib/types.ts` if needed
2. Modify Zustand store actions in `/src/store/use-app-store.ts`
3. Add/update components in `/src/components`
4. Update API logic in `/src/app/api/process/route.ts` if backend changes needed
5. Use existing utility functions from `/src/lib/utils.ts` (e.g., `cn()` for className merging)

The codebase follows a functional React pattern with hooks, avoiding class components entirely.
