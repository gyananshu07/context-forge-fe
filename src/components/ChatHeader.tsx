import { Bot, FileText } from "lucide-react";

interface ChatHeaderProps {
  selectedDocName?: string;
}

export function ChatHeader({ selectedDocName }: ChatHeaderProps) {
  return (
    <div className="h-14 border-b border-border/40 px-6 flex items-center justify-between bg-background/95 backdrop-blur-xl sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-3.5">
        {selectedDocName ? (
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 shadow-sm">
            <FileText className="w-4 h-4 text-primary" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 shadow-sm">
            <Bot className="w-4 h-4 text-primary" />
          </div>
        )}
        <div className="flex flex-col justify-center gap-1">
          <div className="flex items-center gap-2.5">
            <h2 className="font-semibold text-[0.9375rem] text-foreground tracking-tight leading-none">
              {selectedDocName || "ContextForge"}
            </h2>
            {selectedDocName && (
              <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-[0.625rem] font-bold uppercase tracking-wider border border-green-200 leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span>Ready</span>
              </span>
            )}
          </div>
          {selectedDocName && (
            <p className="text-[0.75rem] text-muted-foreground leading-none">
              Active Document Session
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
