import { useState, useEffect } from "react";
import { DocumentSidebar } from "./components/DocumentSidebar";
import type { DocumentItem } from "./components/DocumentSidebar";
import { ChatArea } from "./components/ChatArea";
import type { Message } from "./components/ChatArea";
import { EmptyState } from "./components/EmptyState";
import { UploadState } from "./components/UploadState";
import { toast } from "sonner";
import { INITIAL_DOCS, INITIAL_MESSAGES } from "./mockData";
import { useFileUpload } from "./hooks/useFileUpload";
import { useChat } from "./hooks/useChat";

const API_URL = "http://127.0.0.1:8000";

export default function App() {
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCS);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(
    INITIAL_DOCS[0].id,
  );
  const [messages, setMessages] =
    useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);

  const selectedDoc = documents.find((doc) => doc.id === selectedDocId);

  const { handleFileUpload } = useFileUpload({
    backendOnline,
    setDocuments,
    setSelectedDocId,
    setIsUploading,
    setMessages,
  });

  const { handleSendMessage } = useChat({
    backendOnline,
    selectedDocId,
    selectedDoc,
    setMessages,
    setIsLoading,
  });

  // Check backend status and fetch documents on mount
  useEffect(() => {
    async function checkBackend() {
      try {
        const response = await fetch(`${API_URL}/documents`);
        if (response.ok) {
          const docs = await response.json();
          setDocuments(docs);
          setBackendOnline(true);
          if (docs.length > 0) {
            setSelectedDocId(docs[0].id);
          }
        }
      } catch (err) {
        console.warn(
          "Backend server offline. Falling back to mock client-side flow.",
          err,
        );
        toast.warning("Backend Offline", {
          description: "Falling back to mock client-side flow.",
        });
        setBackendOnline(false);
      }
    }
    checkBackend();
  }, []);

  const handleSelectDoc = (doc: DocumentItem) => {
    setSelectedDocId(doc.id);
    setIsUploading(false);

    // Initialize welcome message for newly selected document if none exists
    if (!messages[doc.id]) {
      setMessages((prev) => ({
        ...prev,
        [doc.id]: [
          {
            id: `welcome-${Date.now()}`,
            role: "assistant",
            content: `Hello! I have indexed "${doc.name}". You can now query any content inside this document.`,
          },
        ],
      }));
    }
  };

  const handleUploadClick = () => {
    setIsUploading(true);
  };

  return (
    <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <DocumentSidebar
        documents={documents}
        selectedId={selectedDocId}
        onSelect={handleSelectDoc}
        onUploadClick={handleUploadClick}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Banner indicating backend status */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

        {isUploading ? (
          <UploadState
            onUpload={handleFileUpload}
            onClear={() => setIsUploading(false)}
          />
        ) : selectedDoc ? (
          <ChatArea
            messages={messages[selectedDoc.id] || []}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            selectedDocName={selectedDoc.name}
          />
        ) : (
          <EmptyState
            onUploadClick={handleUploadClick}
            backendOnline={backendOnline}
          />
        )}
      </div>
    </div>
  );
}
