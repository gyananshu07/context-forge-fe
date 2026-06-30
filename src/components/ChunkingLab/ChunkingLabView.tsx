import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { ChunkVisualizer } from "./ChunkVisualizer";
import { useChunkingLab } from "./useChunkingLab";
import { ChunkingControls } from "./ChunkingControls";
import { RetrievalResultsPanel } from "./RetrievalResultsPanel";

export function ChunkingLabView() {
  const {
    file,
    setFile,
    strategy,
    setStrategy,
    params,
    updateParam,
    chunks,
    parentChildChunks,
    isProcessing,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    getRootProps,
    getInputProps,
    isDragActive,
    handleRunChunking,
    handleSearch,
  } = useChunkingLab();

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Controls */}
        <ChunkingControls
          file={file}
          setFile={setFile}
          strategy={strategy}
          setStrategy={setStrategy}
          params={params}
          updateParam={updateParam}
          isProcessing={isProcessing}
          handleRunChunking={handleRunChunking}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
        />

        {/* Right Main Area: Visualization and Retrieval */}
        <div className="flex-1 flex flex-col min-w-0 bg-background/50">
          <div className="p-4 border-b border-border/40 bg-card/30 flex items-center justify-between">
            <h3 className="font-medium">
              Visualization
              <span className="text-muted-foreground font-normal ml-2 text-sm">
                (
                {strategy === "parent-child"
                  ? parentChildChunks.length
                  : chunks.length}{" "}
                items)
              </span>
            </h3>
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 max-w-sm w-full"
            >
              <Input
                placeholder="Test retrieval query..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!file || !searchQuery || isSearching}
                className="h-9 px-3"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>

          <div className="flex-1 p-6 overflow-hidden flex gap-6">
            {/* Main Visualizer */}
            <div className="flex-1 min-w-0 h-full">
              {chunks.length > 0 || parentChildChunks.length > 0 ? (
                <ChunkVisualizer
                  chunks={chunks}
                  parentChildChunks={parentChildChunks}
                  strategy={strategy}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm border-2 border-dashed border-border/50 rounded-xl">
                  {file
                    ? "Click 'Run Chunking' to visualize"
                    : "Upload a file to begin"}
                </div>
              )}
            </div>

            {/* Retrieval Evaluation Results (Optional Side Panel) */}
            {searchResults && (
              <RetrievalResultsPanel searchResults={searchResults} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
