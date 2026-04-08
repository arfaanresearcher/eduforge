import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function extractText(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "txt" || ext === "md" || ext === "csv") {
    return await file.text();
  }

  if (ext === "pdf") {
    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (ext === "docx") {
    const buffer = Buffer.from(await file.arrayBuffer());
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error(`Unsupported file type: .${ext}. Supported: PDF, DOCX, TXT, MD, CSV`);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const action = (formData.get("action") as string) || "summarize";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 10MB." }, { status: 400 });
    }

    const text = await extractText(file);

    if (!text.trim()) {
      return NextResponse.json({ error: "Could not extract text from file" }, { status: 400 });
    }

    // Truncate to ~100k chars to stay within Gemini context limits
    const truncatedText = text.slice(0, 100000);

    if (!GEMINI_API_KEY || GEMINI_API_KEY === "placeholder") {
      return NextResponse.json({
        fileName: file.name,
        textLength: text.length,
        result: getMockResult(action, file.name, truncatedText),
      });
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = getPrompt(action, file.name, truncatedText);
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return NextResponse.json({
      fileName: file.name,
      textLength: text.length,
      result: response,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to process file";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function getPrompt(action: string, fileName: string, text: string): string {
  switch (action) {
    case "summarize":
      return `Summarize the following document "${fileName}" in a clear, structured format.

Include:
- **Overview**: 2-3 sentence summary
- **Key Points**: Bullet list of the most important points
- **Main Themes**: Core topics covered
- **Takeaways**: Actionable insights or conclusions

Document content:
---
${text}
---`;

    case "study-guide":
      return `Create a comprehensive study guide from the document "${fileName}".

Include:
- **Key Concepts**: Important terms and definitions
- **Summary**: Section-by-section breakdown
- **Practice Questions**: 5 questions with answers
- **Memory Aids**: Mnemonics or connections to remember

Document content:
---
${text}
---`;

    case "flashcards":
      return `Create 10 flashcards from the document "${fileName}".
Return ONLY a JSON array: [{"front":"question","back":"answer"}]
No other text.

Document content:
---
${text}
---`;

    case "key-points":
      return `Extract all key points from the document "${fileName}".
List them as numbered bullet points, grouped by topic.

Document content:
---
${text}
---`;

    case "explain":
      return `Explain the content of "${fileName}" in simple terms, as if teaching someone new to this topic. Use analogies and examples.

Document content:
---
${text}
---`;

    default:
      return `Analyze the following document "${fileName}":\n\n${text}`;
  }
}

function getMockResult(action: string, fileName: string, text: string): string {
  const wordCount = text.split(/\s+/).length;
  const preview = text.slice(0, 200).replace(/\n/g, " ");

  if (action === "flashcards") {
    return JSON.stringify([
      { front: `What is the main topic of "${fileName}"?`, back: "The document covers key concepts and their applications." },
      { front: "What are the key takeaways?", back: "Understanding fundamentals, practical application, and evaluation." },
      { front: "How does this relate to the broader field?", back: "It builds foundational knowledge needed for advanced topics." },
    ]);
  }

  return `## Summary of "${fileName}"

**Overview**: This document contains ${wordCount} words covering important topics relevant to your studies.

**Preview**: "${preview}..."

**Key Points**:
- The document presents core concepts and their practical applications
- Multiple perspectives and approaches are discussed
- Key frameworks and methodologies are outlined

**Takeaways**:
- Review the highlighted sections for exam preparation
- Connect these concepts to your course materials
- Practice applying these ideas to real scenarios

---
*Add a Gemini API key for AI-powered analysis of your actual document content.*`;
}
