import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  selectedDocName?: string;
}

export function ChatInput({
  onSendMessage,
  isLoading,
  selectedDocName,
}: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="px-5 pb-5 pt-1 bg-gradient-to-t from-background via-background to-transparent relative z-10">
      <div className="max-w-4xl mx-auto relative flex items-end shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-border/60 bg-card rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all duration-300">
        <Textarea
          placeholder={
            selectedDocName
              ? "Message ContextForge..."
              : "Select or upload a document first"
          }
          disabled={!selectedDocName || isLoading}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[56px] max-h-[250px] w-full resize-none border-0 shadow-none focus-visible:ring-0 py-3.5 pl-4 pr-12 text-[0.9375rem] bg-transparent leading-relaxed"
          rows={1}
        />
        <div className="absolute right-2.5 bottom-2.5">
          <Button
            size="icon"
            disabled={!selectedDocName || !input.trim() || isLoading}
            onClick={handleSend}
            className={`h-9 w-9 rounded-full shrink-0 transition-all duration-200 ${
              !selectedDocName || !input.trim() || isLoading
                ? "bg-muted text-muted-foreground"
                : "bg-primary text-primary-foreground shadow-md hover:scale-105"
            }`}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto text-center mt-3">
        <span className="text-[0.71875rem] text-muted-foreground/80 font-medium">
          ContextForge can make mistakes. Verify important information.
        </span>
      </div>
    </div>
  );
}
