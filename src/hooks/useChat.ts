import React from "react";
import { toast } from "sonner";
import type { DocumentItem } from "../components/DocumentSidebar";
import type { Message, Citation } from "../components/ChatArea";
import { MOCK_CITATIONS } from "../mockData";

const API_URL = "http://127.0.0.1:8000";

interface UseChatProps {
  backendOnline: boolean;
  selectedDocId: string | null;
  selectedDoc?: DocumentItem;
  setMessages: React.Dispatch<React.SetStateAction<Record<string, Message[]>>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useChat({
  backendOnline,
  selectedDocId,
  selectedDoc,
  setMessages,
  setIsLoading,
}: UseChatProps) {
  const handleSendMessage = async (content: string) => {
    if (!selectedDocId) return;

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedDocId]: [...(prev[selectedDocId] || []), userMessage],
    }));

    setIsLoading(true);

    if (
      backendOnline &&
      !selectedDocId.startsWith("temp") &&
      !selectedDocId.startsWith("doc-")
    ) {
      try {
        const response = await fetch(`${API_URL}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            document_id: selectedDocId,
            message: content,
          }),
        });

        if (!response.ok) throw new Error("Chat request failed");

        const chatResponse = await response.json();
        setMessages((prev) => ({
          ...prev,
          [selectedDocId]: [...(prev[selectedDocId] || []), chatResponse],
        }));
        setIsLoading(false);
        return;
      } catch (err) {
        console.error("Error getting response from backend:", err);
        toast.error("Chat Failed", {
          description: "Could not reach the backend service.",
        });
      }
    }

    // Mock Client-Side response (Fallback)
    setTimeout(() => {
      let aiResponse =
        "I am not sure I understand the question based on the document. Could you rephrase?";
      let citations: Citation[] = [];

      if (selectedDocId === "doc-1") {
        if (
          content.toLowerCase().includes("transformer") ||
          content.toLowerCase().includes("attention")
        ) {
          aiResponse =
            "The Transformer architecture utilizes self-attention mechanisms to learn global dependencies between input and output [1]. It does not use recurrent layers, enabling vastly more parallelization during training.";
          citations = MOCK_CITATIONS.Transformer;
        } else {
          aiResponse =
            "Based on the paper, the Transformer outperforms recurrent and convolutional models in translation tasks [1]. Let me know if you want detailed information on multi-head attention.";
          citations = MOCK_CITATIONS.Transformer;
        }
      } else if (selectedDocId === "doc-2") {
        if (
          content.toLowerCase().includes("performance") ||
          content.toLowerCase().includes("gpt-4")
        ) {
          aiResponse =
            "GPT-4 is a multimodal model showing human-level performance on academic benchmarks [1]. It outperforms GPT-3.5 on complex reasoning tasks.";
          citations = MOCK_CITATIONS.Performance;
        } else {
          aiResponse =
            "According to the report, GPT-4 handles both image and text inputs [1]. Would you like details on specific benchmark performance?";
          citations = MOCK_CITATIONS.Performance;
        }
      } else {
        aiResponse = `I found some information regarding "${content}" in the uploaded document [1]. Let me know if you need additional references.`;
        citations = [
          {
            id: "1",
            source: selectedDoc?.name || "Uploaded Document",
            page: 2,
            text: `This is a extracted reference text from the document corresponding to your query: "${content}".`,
          },
        ];
      }

      const assistantMessage: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: aiResponse,
        citations,
      };

      setMessages((prev) => ({
        ...prev,
        [selectedDocId]: [...(prev[selectedDocId] || []), assistantMessage],
      }));
      setIsLoading(false);
    }, 1500);
  };

  return { handleSendMessage };
}
