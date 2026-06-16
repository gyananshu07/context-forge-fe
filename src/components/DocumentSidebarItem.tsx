import { FileText, Loader2, Trash2 } from "lucide-react";
import type { DocumentItem } from "./DocumentSidebar";

interface DocumentSidebarItemProps {
  doc: DocumentItem;
  isSelected: boolean;
  onSelect: (doc: DocumentItem) => void;
  onDelete?: (id: string) => void;
}

export function DocumentSidebarItem({
  doc,
  isSelected,
  onSelect,
  onDelete,
}: DocumentSidebarItemProps) {
  return (
    <div className="group relative flex items-center w-full">
      <button
        onClick={() => onSelect(doc)}
        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center pr-8 transition-colors ${
          isSelected
            ? "bg-sidebar-accent text-primary font-medium shadow-sm"
            : "hover:bg-black/5 text-muted-foreground hover:text-foreground"
        }`}
      >
        <FileText
          className={`w-4 h-4 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground/70"}`}
        />
        <div className="flex-1 min-w-0 ml-2.5">
          <p
            className={`text-[0.8125rem] truncate pr-2 ${isSelected ? "font-medium text-primary" : "font-medium text-foreground"}`}
          >
            {doc.name}
          </p>
          <div className="flex items-center space-x-2 mt-0.5">
            {doc.status === "processing" && (
              <span className="text-[0.625rem] text-amber-500 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Processing
              </span>
            )}
            {doc.status === "ready" && (
              <span className="text-[0.625rem] text-muted-foreground">
                {(doc.size / 1024 / 1024).toFixed(1)} MB
              </span>
            )}
            {doc.status === "error" && (
              <span className="text-[0.625rem] text-red-500">Error</span>
            )}
          </div>
        </div>
      </button>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(doc.id);
          }}
          className="absolute right-2 p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
          title="Delete document"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
