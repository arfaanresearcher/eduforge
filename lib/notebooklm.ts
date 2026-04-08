// NotebookLM Integration — Free Approach
// Uses: Gemini API free tier for AI chat + direct links to free NotebookLM consumer app
// No paid Google Cloud subscription needed

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function getGemini() {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "placeholder") return null;
  return new GoogleGenerativeAI(GEMINI_API_KEY);
}

// --- Gemini-powered AI Chat for course content ---

export async function chatWithCourseContent(
  courseTitle: string,
  courseContent: string,
  userMessage: string,
): Promise<string> {
  const genAI = getGemini();

  if (!genAI) {
    // Demo mode — return a helpful mock response
    return getDemoResponse(userMessage);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const systemPrompt = `You are an AI study assistant for the course "${courseTitle}" on EduForge, an AI-powered learning platform.
Your role is to help students understand the course material deeply.

Here is the course content to reference:
---
${courseContent}
---

Instructions:
- Answer questions based on the course content above
- Explain concepts clearly with examples
- Generate study guides, flashcards, and practice questions when asked
- If asked to summarize, provide concise but comprehensive summaries
- Be encouraging and supportive in your responses`;

  const result = await model.generateContent([systemPrompt, userMessage]);
  return result.response.text();
}

// --- Generate study materials ---

export async function generateStudyGuide(
  courseTitle: string,
  courseContent: string,
): Promise<string> {
  const genAI = getGemini();

  if (!genAI) {
    return getMockStudyGuide(courseTitle);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Create a comprehensive study guide for the course "${courseTitle}".

Course content:
${courseContent}

Generate:
1. Key Concepts Summary (bullet points)
2. Important Definitions
3. 5 Practice Questions with Answers
4. Memory Aids / Mnemonics
5. Connections Between Topics

Format with clear headers and concise content.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateFlashcards(
  courseTitle: string,
  lessonContent: string,
  lessonTitle: string,
): Promise<Array<{ front: string; back: string }>> {
  const genAI = getGemini();

  if (!genAI) {
    return getMockFlashcards(lessonTitle);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Create 8 flashcards for studying "${lessonTitle}" from the course "${courseTitle}".

Lesson content:
${lessonContent}

Return ONLY a JSON array of objects with "front" (question) and "back" (answer) keys. No other text.
Example: [{"front":"What is X?","back":"X is..."}]`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch {
    // Parse failed
  }

  return getMockFlashcards(lessonTitle);
}

export async function generateQuiz(
  courseTitle: string,
  lessonContent: string,
  lessonTitle: string,
): Promise<Array<{ question: string; options: string[]; correct: number; explanation: string }>> {
  const genAI = getGemini();

  if (!genAI) {
    return getMockQuiz(lessonTitle);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Create 5 multiple-choice quiz questions for "${lessonTitle}" from "${courseTitle}".

Lesson content:
${lessonContent}

Return ONLY a JSON array with objects: {"question":"...","options":["A","B","C","D"],"correct":0,"explanation":"..."}
Where "correct" is the 0-based index. No other text.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch {
    // Parse failed
  }

  return getMockQuiz(lessonTitle);
}

// --- NotebookLM Deep Linking (free consumer app) ---

export function getNotebookLMUrl(): string {
  return "https://notebooklm.google.com";
}

export function getNotebookLMCreateUrl(): string {
  return "https://notebooklm.google.com/new";
}

// --- Download course content as text file for NotebookLM upload ---

export function buildCourseTextForDownload(
  courseTitle: string,
  modules: Array<{ title: string; lessons: Array<{ title: string; content: string }> }>,
): string {
  let text = `# ${courseTitle}\n\n`;

  for (const mod of modules) {
    text += `## ${mod.title}\n\n`;
    for (const lesson of mod.lessons) {
      text += `### ${lesson.title}\n\n${lesson.content}\n\n---\n\n`;
    }
  }

  return text;
}

// --- Demo/Mock Responses ---

function getDemoResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes("summary") || msg.includes("summarize")) {
    return "**Course Summary**\n\nThis course covers fundamental concepts from mathematical foundations through practical applications. Key areas include:\n\n- **Core Theory**: Understanding the mathematical and statistical underpinnings\n- **Algorithms**: Implementation and comparison of major approaches\n- **Applications**: Real-world use cases and deployment strategies\n\nThe course emphasizes hands-on practice with guided exercises.\n\n*To get detailed AI-powered summaries, add a Gemini API key in your environment settings.*";
  }

  if (msg.includes("flashcard")) {
    return "**Flashcards Generated**\n\n**Card 1** — Q: What is the main goal of this discipline?\nA: To enable systems to learn from data and improve performance.\n\n**Card 2** — Q: What are the three main types of learning?\nA: Supervised, unsupervised, and reinforcement learning.\n\n**Card 3** — Q: What metric evaluates classification?\nA: Precision, recall, F1-score, and AUC-ROC.\n\n*For AI-generated flashcards from your actual course content, add a free Gemini API key.*";
  }

  if (msg.includes("quiz") || msg.includes("test")) {
    return "**Practice Quiz**\n\n1. Which technique reduces dimensionality while preserving variance?\n   a) Gradient Descent  b) **PCA**  c) K-Means  d) Decision Trees\n\n2. What does the learning rate control?\n   a) Data size  b) Model accuracy  c) **Step size in optimization**  d) Feature count\n\n*Add a Gemini API key for customized quizzes from your specific lessons.*";
  }

  return `Great question! Here's what I can share from the course material:\n\nThe topic you're asking about is covered in depth across the course modules. The key concepts involve understanding theoretical foundations and their practical applications.\n\n**To unlock full AI-powered answers:**\n1. Get a free Gemini API key at [ai.google.dev](https://ai.google.dev)\n2. Add it as \`GEMINI_API_KEY\` in your environment\n\n**Or use NotebookLM directly:**\nClick "Open in NotebookLM" to upload your course materials and chat with them using Google's free AI notebook tool.`;
}

function getMockStudyGuide(courseTitle: string): string {
  return `# Study Guide: ${courseTitle}

## Key Concepts
- Core theoretical foundations and their practical significance
- Algorithm selection criteria and performance tradeoffs
- Data preprocessing and feature engineering best practices
- Model evaluation metrics and validation strategies
- Deployment considerations and production monitoring

## Important Definitions
- **Supervised Learning**: Learning from labeled examples
- **Unsupervised Learning**: Finding patterns in unlabeled data
- **Cross-Validation**: Technique for robust model evaluation
- **Regularization**: Preventing model overfitting

## Practice Questions
1. Compare and contrast the major algorithm families covered in this course.
2. Explain when you would choose one approach over another.
3. Describe the complete pipeline from data to deployment.
4. What are the key evaluation metrics and when to use each?
5. How do you handle overfitting in practice?

## Memory Aids
- **CRISP-DM**: Business Understanding → Data → Preparation → Modeling → Evaluation → Deployment
- Think of model complexity as a dial: too low = underfitting, too high = overfitting

## Topic Connections
The mathematical foundations connect directly to optimization algorithms, which drive model training. Evaluation metrics guide model selection, and deployment considerations shape architecture choices.

---
*Generated in demo mode. Add a Gemini API key for AI-powered study guides based on your actual course content.*`;
}

function getMockFlashcards(lessonTitle: string): Array<{ front: string; back: string }> {
  return [
    { front: `What is the main concept in "${lessonTitle}"?`, back: "The core concept involves understanding fundamental principles and their applications." },
    { front: "Why is this topic important?", back: "It forms the foundation for more advanced techniques covered later in the course." },
    { front: "What are the key takeaways?", back: "1) Understand the theory 2) Practice implementation 3) Evaluate results" },
    { front: "How does this connect to other topics?", back: "This builds on earlier foundations and enables the advanced techniques in later modules." },
  ];
}

function getMockQuiz(lessonTitle: string): Array<{ question: string; options: string[]; correct: number; explanation: string }> {
  return [
    {
      question: `Which best describes the main focus of "${lessonTitle}"?`,
      options: ["Data collection methods", "Core theoretical concepts", "Marketing strategies", "Hardware optimization"],
      correct: 1,
      explanation: "This lesson primarily focuses on understanding core theoretical concepts and their applications.",
    },
    {
      question: "What is the recommended approach for beginners?",
      options: ["Skip to advanced topics", "Start with fundamentals", "Focus only on code", "Memorize formulas"],
      correct: 1,
      explanation: "Starting with fundamentals builds a strong foundation for more advanced concepts.",
    },
  ];
}
