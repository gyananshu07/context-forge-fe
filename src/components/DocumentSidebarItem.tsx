import { Loader2, Trash2 } from "lucide-react";
import type { DocumentItem } from "./DocumentSidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
        type="button"
        onClick={() => onSelect(doc)}
        className={`flex-1 w-full text-left px-2.5 py-1.5 rounded flex flex-col transition-colors ${
          isSelected
            ? "bg-sidebar-accent text-primary font-medium shadow-sm"
            : "hover:bg-black/5 text-muted-foreground hover:text-foreground"
        }`}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <p
              className={`text-xs max-w-[13.25rem] truncate text-left ${isSelected ? "font-medium text-primary" : "font-medium text-foreground"}`}
            >
              {doc.name}
            </p>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={10}
            className="max-w-[18rem] break-words text-xs z-50"
          >
            {doc.name}
          </TooltipContent>
        </Tooltip>
        <div className="flex items-center">
          {doc.status === "processing" && (
            <span className="text-[0.625rem] text-amber-500 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Processing
            </span>
          )}
          {["uploaded", "ready"].includes(doc.status) && (
            <span className="text-[0.625rem] text-muted-foreground">
              {(doc.size / 1024 / 1024).toFixed(1)} MB
            </span>
          )}
          {doc.status === "error" && (
            <span className="text-[0.625rem] text-red-500">Error</span>
          )}
        </div>
      </button>
      {onDelete && (
        <button
          type="button"
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
