import type { Message } from "../components/ChatArea";
import type { DocumentItem } from "../components/DocumentSidebar";

const API_URL = "http://127.0.0.1:8000";

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

/**
 * A generic fetch client that handles URL construction, common headers, and response parsing.
 */
export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, headers, ...customConfig } = options;

  const url = new URL(`${API_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...headers,
    },
  };

  const response = await fetch(url.toString(), config);

  if (!response.ok) {
    const errorBody = await response.text().catch(() => null);
    throw new Error(
      errorBody || `API Error: ${response.status} ${response.statusText}`
    );
  }

  // Handle empty responses
  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

export interface UploadDocumentResponse {
  id: string;
  title: string;
  status: string;
}

/**
 * Specific API methods for the application
 */
export const api = {
  getDocuments: () => apiClient<DocumentItem[]>("/documents"),

  uploadDocument: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient<UploadDocumentResponse>("/documents", {
      method: "POST",
      body: formData,
    });
  },

  chat: (documentId: string, message: string) =>
    apiClient<Message>("/chat", {
      method: "POST",
      body: JSON.stringify({ document_id: documentId, query: message }),
      headers: {
        "Content-Type": "application/json",
      },
    }),

  getChatHistory: (documentId: string, options?: FetchOptions) => 
    apiClient<Message[]>(`/chat/${documentId}`, options),

  chatStream: async (
    documentId: string,
    message: string,
    onChunk: (chunk: string) => void
  ) => {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      body: JSON.stringify({ document_id: documentId, query: message }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    if (!reader) {
      throw new Error("Response body is not readable");
    }

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      // Keep the last partial line in the buffer
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice("data: ".length);
          if (data === "[DONE]") {
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              onChunk(parsed.content);
            }
          } catch (e) {
            console.error("Failed to parse SSE data:", data, e);
          }
        }
      }
    }
  },
};
