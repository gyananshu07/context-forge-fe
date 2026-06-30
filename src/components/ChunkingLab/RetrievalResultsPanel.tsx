import type { ChunkEvaluateResponse, ChunkItem } from "@/lib/api";

interface RetrievalResultsPanelProps {
  searchResults: ChunkEvaluateResponse;
}

export function RetrievalResultsPanel({
  searchResults,
}: RetrievalResultsPanelProps) {
  return (
    <div className="w-[19rem] flex-shrink-0 border-l border-border/40 pl-6 flex flex-col h-full overflow-hidden">
      <h4 className="font-semibold text-sm mb-4">Retrieval Results</h4>
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {searchResults.results &&
          searchResults.results.map((r: ChunkItem, i: number) => (
            <div
              key={i}
              className="p-3 bg-primary/5 border border-primary/20 rounded-lg"
            >
              <span className="text-[0.625rem] font-bold text-primary uppercase tracking-wider mb-1 block">
                Match {i + 1}
              </span>
              <p className="text-xs line-clamp-6">{r.text}</p>
            </div>
          ))}
        {searchResults.retrieved_parents &&
          searchResults.retrieved_parents.map((p: ChunkItem, i: number) => (
            <div
              key={i}
              className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg"
            >
              <span className="text-[0.625rem] font-bold text-purple-500 uppercase tracking-wider mb-1 block">
                Parent Match {i + 1}
              </span>
              <p className="text-xs line-clamp-6">{p.text}</p>
            </div>
          ))}
        {!searchResults.results?.length &&
          !searchResults.retrieved_parents?.length && (
            <div className="text-xs text-muted-foreground text-center py-4">
              No results found.
            </div>
          )}
      </div>
    </div>
  );
}
