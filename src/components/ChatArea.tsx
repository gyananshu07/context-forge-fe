import { useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { ChatMessageList } from "./ChatMessageList";
import { CitationSidebar } from "./CitationSidebar";

export interface Citation {
  id: string;
  source: string;
  text: string;
  page: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
}

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  selectedDocName?: string;
}

export function ChatArea({
  messages,
  onSendMessage,
  isLoading,
  selectedDocName,
}: ChatAreaProps) {
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative">
      <ChatHeader selectedDocName={selectedDocName} />

      {/* Main Chat Flow */}
      <div className="flex-1 flex overflow-hidden">
        {/* Messages */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <ChatMessageList
            messages={messages}
            isLoading={isLoading}
            onCitationClick={setActiveCitation}
          />
          <ChatInput
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            selectedDocName={selectedDocName}
          />
        </div>

        <CitationSidebar
          activeCitation={activeCitation}
          onClose={() => setActiveCitation(null)}
        />
      </div>
    </div>
  );
}
