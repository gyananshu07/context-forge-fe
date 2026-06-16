import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Citation, Message } from "./ChatArea";

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
  onCitationClick: (citation: Citation) => void;
}

export function ChatMessageList({
  messages,
  isLoading,
  onCitationClick,
}: ChatMessageListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollArea = scrollContainerRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  // Helper to parse message text and render custom style for citations
  const renderMessageContent = (content: string, citations?: Citation[]) => {
    if (!citations || citations.length === 0)
      return (
        <p className="whitespace-pre-wrap leading-relaxed text-[0.9375rem]">
          {content}
        </p>
      );

    // Simple regex to match pattern [1], [2], etc.
    const parts = content.split(/(\[\d+\])/g);
    return (
      <p className="whitespace-pre-wrap leading-relaxed text-[0.9375rem]">
        {parts.map((part, index) => {
          const match = part.match(/^\[(\d+)\]$/);
          if (match) {
            const citeNum = parseInt(match[1], 10);
            const citation = citations.find(
              (c) => parseInt(c.id, 10) === citeNum || c.id === match[1],
            );
            if (citation) {
              return (
                <button
                  key={index}
                  onClick={() => onCitationClick(citation)}
                  className="inline-flex items-center justify-center px-2 py-0.5 mx-1 rounded-full text-[0.6875rem] font-bold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-all cursor-pointer shadow-sm group"
                  title={`Source: ${citation.source}, Page ${citation.page}`}
                >
                  <span className="opacity-70 group-hover:opacity-100 mr-0.5">
                    Page
                  </span>
                  {citation.page}
                </button>
              );
            }
          }
          return part;
        })}
      </p>
    );
  };

  return (
    <ScrollArea ref={scrollContainerRef} className="flex-1 px-5 py-6">
      <div className="max-w-4xl mx-auto space-y-5">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shadow-sm border border-primary/10">
              <Bot className="w-8 h-8" />
            </div>
            <div className="max-w-md space-y-3">
              <h3 className="font-semibold text-xl text-foreground tracking-tight">
                Ask a question
              </h3>
              <p className="text-[0.9375rem] text-muted-foreground leading-relaxed">
                ContextForge uses advanced RAG to extract key details, summarize
                sections, and provide accurate page-level citations.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isAssistant = message.role === "assistant";
            return (
              <div
                key={message.id}
                className={`flex space-x-4 ${isAssistant ? "justify-start" : "justify-end"} animate-in slide-in-from-bottom-2 fade-in duration-300`}
              >
                {isAssistant && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1 border border-primary/10">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] ${
                    isAssistant
                      ? "text-foreground py-0.5"
                      : "bg-[#F8FAFC] text-foreground border border-border/40 rounded-2xl px-4 py-3 shadow-sm"
                  }`}
                >
                  <div
                    className={`${isAssistant ? "text-[0.9375rem]" : "text-[0.9375rem]"} leading-relaxed`}
                  >
                    {renderMessageContent(message.content, message.citations)}
                  </div>
                </div>
                {!isAssistant && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex space-x-4 justify-start animate-in fade-in duration-300">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1 border border-primary/10">
              <Bot className="w-4 h-4" />
            </div>
            <div className="py-2.5">
              <div className="flex items-center space-x-1.5 h-6 px-2">
                <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce delay-150"></span>
                <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
