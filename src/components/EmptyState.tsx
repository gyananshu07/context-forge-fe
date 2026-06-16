import { Sparkles, HelpCircle } from "lucide-react";

interface EmptyStateProps {
  onUploadClick: () => void;
  backendOnline: boolean;
}

export function EmptyState({ onUploadClick, backendOnline }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-5 bg-background">
      <div className="max-w-md space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary mx-auto shadow-sm animate-pulse">
          <Sparkles className="w-10 h-10 opacity-80" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          AI Document Intelligence
        </h2>
        <p className="text-muted-foreground text-[0.9375rem] leading-relaxed">
          Connect your PDFs to get instant answers with page-level citations. Create summaries, extract data, and deep dive into research papers seamlessly.
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <button
            onClick={onUploadClick}
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-[0.875rem] font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg cursor-pointer animate-bounce hover:scale-105"
          >
            Upload First PDF
          </button>
          <button className="bg-secondary/50 border border-border/50 px-5 py-2.5 rounded-full text-[0.875rem] font-medium hover:bg-black/5 transition-all flex items-center gap-2 cursor-pointer text-foreground shadow-sm">
            <HelpCircle className="w-4 h-4 text-muted-foreground" />
            How it works
          </button>
        </div>
        {backendOnline && (
          <div className="pt-4 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
            <p className="text-[0.6875rem] text-muted-foreground font-semibold uppercase tracking-wider">
              Backend Connected
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
