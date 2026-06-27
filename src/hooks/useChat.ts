import React, { useEffect } from "react";
import { toast } from "sonner";
import type { Message } from "../components/ChatArea";
import { api } from "../lib/api";

interface UseChatProps {
  selectedDocId: string | null;
  messages: Record<string, Message[]>;
  setMessages: React.Dispatch<React.SetStateAction<Record<string, Message[]>>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useChat({
  selectedDocId,
  messages,
  setMessages,
  setIsLoading,
}: UseChatProps) {
  useEffect(() => {
    if (!selectedDocId || selectedDocId.toString().startsWith("temp-")) return;

    const controller = new AbortController();

    const fetchHistory = async () => {
      // Check if we already have history loaded to avoid flashing the loader
      const needsLoadingSpinner = messages[selectedDocId] === undefined;

      if (needsLoadingSpinner) {
        setIsLoading(true);
      }

      try {
        const history = await api.getChatHistory(selectedDocId, {
          signal: controller.signal,
        });
        setMessages((prev) => ({
          ...prev,
          [selectedDocId]: history,
        }));
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.error("Failed to fetch chat history:", err);
        toast.error("Failed to load chat history");
      }

      // Only turn off the loader if this fetch wasn't aborted by a newer one
      if (!controller.signal.aborted && needsLoadingSpinner) {
        setIsLoading(false);
      }
    };

    // If we already have the messages, we can still fetch in the background to ensure it's up to date
    fetchHistory();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDocId]);

  const handleSendMessage = async (content: string) => {
    if (
      !selectedDocId ||
      !content.trim() ||
      selectedDocId.toString().startsWith("temp-")
    )
      return;

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content,
    };

    const assistantId = `a-${Date.now()}`;

    setMessages((prev) => ({
      ...prev,
      [selectedDocId]: [...(prev[selectedDocId] || []), userMessage],
    }));

    setIsLoading(true);

    try {
      let isFirstChunk = true;
      await api.chatStream(selectedDocId, content, (chunk) => {
        if (isFirstChunk) {
          setIsLoading(false);
          isFirstChunk = false;
          setMessages((prev) => {
            const docMessages = prev[selectedDocId] || [];
            return {
              ...prev,
              [selectedDocId]: [
                ...docMessages,
                { id: assistantId, role: "assistant", content: chunk },
              ],
            };
          });
        } else {
          setMessages((prev) => {
            const docMessages = prev[selectedDocId] || [];
            return {
              ...prev,
              [selectedDocId]: docMessages.map((msg) =>
                msg.id === assistantId
                  ? { ...msg, content: msg.content + chunk }
                  : msg,
              ),
            };
          });
        }
      });
    } catch (err) {
      console.error("Error getting response from backend:", err);
      toast.error("Chat Failed", {
        description: "Could not reach the backend service.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSendMessage };
}
