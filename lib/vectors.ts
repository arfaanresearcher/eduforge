import { Pinecone } from "@pinecone-database/pinecone";

const isConfigured =
  process.env.PINECONE_API_KEY &&
  process.env.PINECONE_API_KEY !== "placeholder";

let pinecone: Pinecone | null = null;

if (isConfigured) {
  pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
}

function getIndex() {
  if (!pinecone) return null;
  return pinecone.index(process.env.PINECONE_INDEX ?? "eduforge-embeddings");
}

// Simple text-to-vector using character frequency (placeholder for real embeddings)
function textToVector(text: string, dimension = 1536): number[] {
  const vec = new Array(dimension).fill(0);
  for (let i = 0; i < text.length; i++) {
    vec[text.charCodeAt(i) % dimension] += 1;
  }
  const magnitude = Math.sqrt(vec.reduce((sum: number, v: number) => sum + v * v, 0)) || 1;
  return vec.map((v: number) => v / magnitude);
}

export async function upsertCourseEmbedding(
  courseId: string,
  text: string,
): Promise<void> {
  const index = getIndex();
  if (!index) {
    console.warn("Pinecone not configured. Skipping embedding upsert.");
    return;
  }

  const vector = textToVector(text);
  await index.upsert({
    records: [
      {
        id: courseId,
        values: vector,
        metadata: { courseId, type: "course" },
      },
    ],
  });
}

export async function searchSimilarCourses(
  query: string,
  topK = 5,
): Promise<Array<{ courseId: string; score: number }>> {
  const index = getIndex();
  if (!index) {
    console.warn("Pinecone not configured. Returning empty results.");
    return [];
  }

  const queryVector = textToVector(query);
  const results = await index.query({
    vector: queryVector,
    topK,
    includeMetadata: true,
  });

  return (results.matches ?? []).map((match) => ({
    courseId: (match.metadata?.courseId as string) ?? match.id,
    score: match.score ?? 0,
  }));
}

export async function getUserEmbedding(
  userId: string,
): Promise<number[] | null> {
  const index = getIndex();
  if (!index) return null;

  const result = await index.fetch({ ids: [`user-${userId}`] });
  const record = result.records?.[`user-${userId}`];
  return record?.values ?? null;
}
