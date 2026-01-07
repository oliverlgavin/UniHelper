import mammoth from "mammoth";

export async function parseFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  console.log(`Parsing file: ${fileName}, Type: ${fileType}`);

  try {
    if (fileName.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    if (fileName.endsWith(".pdf") || fileType === "application/pdf") {
      // Dynamic import for pdf-parse to avoid bundling issues
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: buffer });
      const data = await parser.getText();
      return data.text;
    }

    if (fileName.endsWith(".pptx")) {
      // Dynamic import for officeparser to avoid bundling issues
      try {
        console.log("Parsing PPTX with officeparser");
        const { parseOffice } = await import("officeparser");
        const result = await parseOffice(buffer);

        // v6 returns an AST structure - recursively extract all text
        const extractText = (node: any): string => {
          if (!node) return '';
          if (typeof node === 'string') return node;

          let text = '';

          // Get text from current node
          if (node.text && typeof node.text === 'string') {
            text += node.text + '\n';
          }

          // Recursively process children
          if (Array.isArray(node.children)) {
            for (const child of node.children) {
              text += extractText(child);
            }
          }

          // Process content array (for root level)
          if (Array.isArray(node.content)) {
            for (const item of node.content) {
              text += extractText(item);
            }
          }

          return text;
        };

        const text = extractText(result).trim();
        console.log("Successfully parsed PPTX, text length:", text.length);
        return text;
      } catch (err) {
        console.error("Error parsing PPTX:", err);
        throw new Error(`Failed to parse PPTX: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    throw new Error("Unsupported file type");
  } catch (error) {
    console.error("Error parsing file:", error);
    throw new Error("Failed to parse file content");
  }
}

