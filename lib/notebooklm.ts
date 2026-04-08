// Google NotebookLM Enterprise API Client
// Docs: https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/api-notebooks

const PROJECT_NUMBER = process.env.GOOGLE_CLOUD_PROJECT_NUMBER;
const LOCATION = process.env.GOOGLE_CLOUD_LOCATION || "us";
const ACCESS_TOKEN = process.env.GOOGLE_CLOUD_ACCESS_TOKEN;

function getBaseUrl() {
  return `https://${LOCATION}-discoveryengine.googleapis.com/v1alpha/projects/${PROJECT_NUMBER}/locations/${LOCATION}/notebooks`;
}

function isConfigured() {
  return !!(PROJECT_NUMBER && ACCESS_TOKEN);
}

async function apiCall(path: string, options: RequestInit = {}) {
  if (!isConfigured()) {
    throw new Error("NotebookLM API not configured");
  }

  const url = path.startsWith("http") ? path : `${getBaseUrl()}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`NotebookLM API error (${res.status}): ${error}`);
  }

  return res.json();
}

// --- Core API Methods ---

export async function createNotebook(title: string) {
  if (!isConfigured()) {
    return {
      notebookId: `mock_nb_${Date.now()}`,
      title,
      name: `projects/mock/locations/${LOCATION}/notebooks/mock_nb_${Date.now()}`,
      mock: true,
    };
  }

  return apiCall("", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export async function getNotebook(notebookId: string) {
  if (!isConfigured()) {
    return {
      notebookId,
      title: "Mock Notebook",
      sources: [],
      mock: true,
    };
  }

  return apiCall(`/${notebookId}`);
}

export async function deleteNotebook(notebookId: string) {
  if (!isConfigured()) return { mock: true };

  return apiCall(":batchDelete", {
    method: "POST",
    body: JSON.stringify({
      names: [`projects/${PROJECT_NUMBER}/locations/${LOCATION}/notebooks/${notebookId}`],
    }),
  });
}

export interface TextSource {
  type: "text";
  sourceName: string;
  content: string;
}

export interface WebSource {
  type: "web";
  url: string;
}

export type NotebookSource = TextSource | WebSource;

export async function addSources(notebookId: string, sources: NotebookSource[]) {
  if (!isConfigured()) {
    return {
      sources: sources.map((s, i) => ({
        sourceId: { id: `mock_src_${i}` },
        title: s.type === "text" ? s.sourceName : s.url,
        settings: { status: "SOURCE_STATUS_COMPLETE" },
      })),
      mock: true,
    };
  }

  const userContents = sources.map((s) => {
    if (s.type === "text") {
      return { textContent: { sourceName: s.sourceName, content: s.content } };
    }
    return { webContent: { url: s.url } };
  });

  return apiCall(`/${notebookId}/sources:batchCreate`, {
    method: "POST",
    body: JSON.stringify({ userContents }),
  });
}

export async function createAudioOverview(
  notebookId: string,
  episodeFocus?: string,
  languageCode?: string,
) {
  if (!isConfigured()) {
    return {
      audioOverview: {
        status: "AUDIO_OVERVIEW_STATUS_COMPLETE",
        audioOverviewId: `mock_audio_${Date.now()}`,
        mock: true,
      },
    };
  }

  const body: Record<string, unknown> = {};
  if (episodeFocus) body.episodeFocus = episodeFocus;
  if (languageCode) body.languageCode = languageCode;

  return apiCall(`/${notebookId}/audioOverviews`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function deleteAudioOverview(notebookId: string) {
  if (!isConfigured()) return { mock: true };

  return apiCall(`/${notebookId}/audioOverviews/default`, {
    method: "DELETE",
  });
}

// --- Helper: Build notebook URL for web access ---

export function getNotebookUrl(notebookId: string) {
  if (!isConfigured() || notebookId.startsWith("mock_")) {
    return "https://notebooklm.google.com";
  }
  return `https://notebooklm.google.com/notebook/${notebookId}`;
}

// --- Helper: Create notebook from course content ---

export async function createCourseNotebook(
  courseTitle: string,
  modules: Array<{ title: string; lessons: Array<{ title: string; content: string }> }>,
) {
  const notebook = await createNotebook(`EduForge: ${courseTitle}`);
  const notebookId = notebook.notebookId;

  // Build text sources from each module's lessons
  const sources: TextSource[] = modules.flatMap((mod) =>
    mod.lessons.map((lesson) => ({
      type: "text" as const,
      sourceName: `${mod.title} — ${lesson.title}`,
      content: lesson.content,
    })),
  );

  // NotebookLM allows batching sources
  const result = await addSources(notebookId, sources);

  return {
    notebookId,
    notebookUrl: getNotebookUrl(notebookId),
    sourcesLoaded: result.sources?.length ?? sources.length,
    mock: notebook.mock ?? false,
  };
}
