import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, FileText } from "lucide-react";
import type { Citation } from "./ChatArea";

interface CitationSidebarProps {
  activeCitation: Citation | null;
  onClose: () => void;
}

export function CitationSidebar({
  activeCitation,
  onClose,
}: CitationSidebarProps) {
  if (!activeCitation) return null;

  return (
    <div className="w-[20rem] border-l border-border/40 bg-background flex flex-col h-full animate-in slide-in-from-right duration-300 shrink-0 z-20 shadow-sm">
      <div className="h-14 border-b border-border/30 px-5 flex items-center justify-between">
        <span className="font-medium text-[0.875rem] text-foreground">
          Source
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-md hover:bg-muted text-muted-foreground shrink-0 transition-colors"
          onClick={onClose}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-5">
          <div className="space-y-4">
            {/* Clean Document Identity */}
            <div className="flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="min-w-0">
                <h3 className="text-[0.875rem] font-medium text-foreground leading-snug break-all">
                  {activeCitation.source}
                </h3>
                <p className="text-[0.75rem] text-muted-foreground mt-1">
                  Page {activeCitation.page}
                </p>
              </div>
            </div>

            {/* Clean Retrieved Text */}
            <div className="bg-muted/40 rounded-lg p-4 text-[0.875rem] leading-relaxed text-slate-700 font-serif border border-border/50">
              "{activeCitation.text}"
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
