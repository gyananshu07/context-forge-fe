import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { DocumentSidebarItem } from "./DocumentSidebarItem";

export interface DocumentItem {
  id: string;
  name: string;
  size: number;
  status: "processing" | "ready" | "error";
}

interface DocumentSidebarProps {
  documents: DocumentItem[];
  selectedId?: string | null;
  onSelect: (doc: DocumentItem) => void;
  onUploadClick: () => void;
  onDelete?: (id: string) => void;
}

export function DocumentSidebar({
  documents,
  selectedId,
  onSelect,
  onUploadClick,
  onDelete,
}: DocumentSidebarProps) {
  return (
    <div className="w-[16.25rem] bg-sidebar text-sidebar-foreground flex flex-col h-full border-r border-border/40 shrink-0">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm text-sm">
            C
          </div>
          <div>
            <h1 className="font-semibold text-[0.8125rem] tracking-tight text-foreground m-0">
              ContextForge
            </h1>
          </div>
        </div>
      </div>

      <div className="px-3 pb-3">
        <Button
          onClick={onUploadClick}
          className="w-full justify-start space-x-2 hover:bg-black/5 bg-transparent text-foreground border-border/50 shadow-none h-9 text-[0.8125rem] font-medium"
          variant="outline"
        >
          <Plus className="w-4 h-4 text-muted-foreground" />
          <span>New Document</span>
        </Button>
      </div>

      <div className="px-4 py-1.5 text-[0.6875rem] font-semibold tracking-wider text-muted-foreground uppercase">
        Documents
      </div>

      <ScrollArea className="flex-1 px-2.5">
        <div className="space-y-0.5 pb-3">
          {documents.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No documents yet
            </div>
          ) : (
            documents.map((doc) => (
              <DocumentSidebarItem
                key={doc.id}
                doc={doc}
                isSelected={doc.id === selectedId}
                onSelect={onSelect}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-3 flex items-center justify-between mt-auto">
        <div className="flex items-center space-x-2 px-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <span className="text-[0.6875rem] text-muted-foreground font-medium uppercase tracking-wider">
            Connected
          </span>
        </div>
      </div>
    </div>
  );
}
