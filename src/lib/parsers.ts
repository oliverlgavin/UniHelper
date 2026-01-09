import mammoth from "mammoth";
import { createRequire } from "module";

// Create require function for CommonJS modules (fixes pdf-parse debug mode issue)
const require = createRequire(import.meta.url);

export async function parseFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  console.log(`Parsing file: ${fileName}, Type: ${fileType}`);

  try {
    // DOCX files (Word 2007+)
    if (fileName.endsWith(".docx")) {
      console.log("Parsing DOCX with mammoth");
      const result = await mammoth.extractRawText({ buffer });
      console.log("Successfully parsed DOCX, text length:", result.value.length);
      return result.value;
    }

    // DOC files (older Word format) - use officeparser
    if (fileName.endsWith(".doc") && !fileName.endsWith(".docx")) {
      console.log("Parsing DOC with officeparser");
      try {
        const { parseOffice } = await import("officeparser");
        const result = await parseOffice(buffer);
        const text = extractTextFromOfficeResult(result);
        console.log("Successfully parsed DOC, text length:", text.length);
        return text;
      } catch (err) {
        console.error("Error parsing DOC:", err);
        throw new Error(`Failed to parse DOC: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    // PDF files - use pdf-parse (excluded from webpack bundling via serverExternalPackages)
    if (fileName.endsWith(".pdf") || fileType === "application/pdf") {
      console.log("Parsing PDF with pdf-parse");
      try {
        // pdf-parse is excluded from webpack bundling in next.config.ts
        // This ensures module.parent is set correctly and debug mode doesn't trigger
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require("pdf-parse");
        const data = await pdfParse(buffer);
        console.log("Successfully parsed PDF, text length:", data.text.length);
        return data.text;
      } catch (err) {
        console.error("Error parsing PDF:", err);
        throw new Error(`Failed to parse PDF: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    // PPTX files (PowerPoint)
    if (fileName.endsWith(".pptx")) {
      console.log("Parsing PPTX with officeparser");
      try {
        const { parseOffice } = await import("officeparser");
        const result = await parseOffice(buffer);
        const text = extractTextFromOfficeResult(result);
        console.log("Successfully parsed PPTX, text length:", text.length);
        return text;
      } catch (err) {
        console.error("Error parsing PPTX:", err);
        throw new Error(`Failed to parse PPTX: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    throw new Error(`Unsupported file type: ${fileName}`);
  } catch (error) {
    console.error("Error parsing file:", error);
    throw error;
  }
}

// Helper function to extract text from officeparser result (works for PPTX, DOC, etc.)
function extractTextFromOfficeResult(result: unknown): string {
  if (!result) return '';
  if (typeof result === 'string') return result.trim();

  const extractText = (node: unknown): string => {
    if (!node) return '';
    if (typeof node === 'string') return node;

    let text = '';
    const obj = node as Record<string, unknown>;

    // Get text from current node
    if (obj.text && typeof obj.text === 'string') {
      text += obj.text + '\n';
    }

    // Recursively process children
    if (Array.isArray(obj.children)) {
      for (const child of obj.children) {
        text += extractText(child);
      }
    }

    // Process content array (for root level)
    if (Array.isArray(obj.content)) {
      for (const item of obj.content) {
        text += extractText(item);
      }
    }

    return text;
  };

  return extractText(result).trim();
}

