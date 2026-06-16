import React from "react";
import { toast } from "sonner";
import type { DocumentItem } from "../components/DocumentSidebar";
import type { Message } from "../components/ChatArea";

const API_URL = "http://127.0.0.1:8000";

interface UseFileUploadProps {
  backendOnline: boolean;
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  setSelectedDocId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  setMessages: React.Dispatch<React.SetStateAction<Record<string, Message[]>>>;
}

export function useFileUpload({
  backendOnline,
  setDocuments,
  setSelectedDocId,
  setIsUploading,
  setMessages,
}: UseFileUploadProps) {
  const handleFileUpload = async (file: File) => {
    if (backendOnline) {
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
        const response = await fetch(`${API_URL}/upload`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const uploadedDoc = await response.json();
        setDocuments((prev) =>
          prev.map((d) => (d.id === tempDocId ? uploadedDoc : d)),
        );
        setSelectedDocId(uploadedDoc.id);
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
          prev.map((d) => (d.id === tempDocId ? { ...d, status: "error" } : d)),
        );
        toast.error("Upload Failed", {
          description: `Could not upload "${file.name}".`,
        });
      }
    } else {
      // Mock Client-Side flow
      const newDocId = `doc-${Date.now()}`;
      const newDoc: DocumentItem = {
        id: newDocId,
        name: file.name,
        size: file.size,
        status: "processing",
      };

      setDocuments((prev) => [newDoc, ...prev]);
      setSelectedDocId(newDocId);
      setIsUploading(false);

      setTimeout(() => {
        setDocuments((prev) =>
          prev.map((d) => (d.id === newDocId ? { ...d, status: "ready" } : d)),
        );
        toast.success("Document Parsed", {
          description: `Successfully parsed "${file.name}" (Mock Mode).`,
        });
        setMessages((prev) => ({
          ...prev,
          [newDocId]: [
            {
              id: `msg-${Date.now()}`,
              role: "assistant",
              content: `I have successfully parsed and indexed "${file.name}" (Mock Mode). How can I help you with this document?`,
            },
          ],
        }));
      }, 3000);
    }
  };

  return { handleFileUpload };
}
