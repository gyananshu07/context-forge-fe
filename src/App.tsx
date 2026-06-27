import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Message } from "./components/ChatArea";
import { ChatArea } from "./components/ChatArea";
import type { DocumentItem } from "./components/DocumentSidebar";
import { DocumentSidebar } from "./components/DocumentSidebar";
import { EmptyState } from "./components/EmptyState";
import { UploadState } from "./components/UploadState";
import { useChat } from "./hooks/useChat";
import { useFileUpload } from "./hooks/useFileUpload";
import { api } from "./lib/api";

export default function App() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);

  const selectedDoc = documents.find((doc) => doc.id === selectedDocId);

  const { handleFileUpload } = useFileUpload({
    setDocuments,
    setSelectedDocId,
    setIsUploading,
    setMessages,
  });

  const { handleSendMessage } = useChat({
    selectedDocId,
    messages,
    setMessages,
    setIsLoading,
  });

  // Check backend status and fetch documents on mount
  useEffect(() => {
    async function checkBackend() {
      try {
        const docs = await api.getDocuments();
        setDocuments(docs);
        setBackendOnline(true);
        if (docs.length > 0) {
          setSelectedDocId(docs[0].id);
        }
      } catch (err) {
        console.error("Backend server offline.", err);
        toast.error("Backend Offline", {
          description: "Could not connect to the server.",
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
