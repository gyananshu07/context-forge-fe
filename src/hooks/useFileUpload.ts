import React from "react";
import { toast } from "sonner";
import type { DocumentItem } from "../components/DocumentSidebar";
import type { Message } from "../components/ChatArea";
import { api } from "../lib/api";

interface UseFileUploadProps {
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  setSelectedDocId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<Record<string, Message[]>>>;
}

export function useFileUpload({
  setDocuments,
  setSelectedDocId,
  setIsUploading,
  setMessages,
}: UseFileUploadProps) {
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const tempDocId = `temp-${Date.now()}`;
    const tempDoc: DocumentItem = {
      id: tempDocId,
      name: file.name,
      size: file.size,
      status: "processing",
    };

    setDocuments((prev) => [tempDoc, ...prev]);
    setSelectedDocId(tempDocId);
    setIsUploading(false);

    try {
      const uploadedDoc = await api.uploadDocument(file);
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === tempDocId
            ? { ...d, id: uploadedDoc.id, name: uploadedDoc.title, status: "ready" }
            : d
        )
      );
      
      // Only switch focus if the user hasn't clicked away to another document
      setSelectedDocId((current) => 
        current === tempDocId ? uploadedDoc.id : current
      );

      toast.success("Document Uploaded", {
        description: `Successfully uploaded "${file.name}".`,
      });

      // Add welcome message from backend
      setMessages((prev) => ({
        ...prev,
        [uploadedDoc.id]: [
          {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: `Successfully uploaded and parsed "${file.name}". How can I help you?`,
          },
        ],
      }));
    } catch (err) {
      console.error("Error uploading file to backend:", err);
      // Mark as error
      setDocuments((prev) =>
        prev.map((d) => (d.id === tempDocId ? { ...d, status: "error" } : d))
      );
      toast.error("Upload Failed", {
        description: `Could not upload "${file.name}".`,
      });
    }
  };

  return { handleFileUpload };
}
