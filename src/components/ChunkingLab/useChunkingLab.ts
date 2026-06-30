import { api, type ChunkEvaluateResponse } from "@/lib/api";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import type { ChunkItem, ParentChildChunk } from "./ChunkVisualizer";

export function useChunkingLab() {
  const [file, setFile] = useState<File | null>(null);
  const [strategy, setStrategy] = useState("recursive");
  const [params, setParams] = useState<Record<string, string | number>>({
    chunk_size: 1000,
    chunk_overlap: 200,
  });

  const [chunks, setChunks] = useState<ChunkItem[]>([]);
  const [parentChildChunks, setParentChildChunks] = useState<
    ParentChildChunk[]
  >([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] =
    useState<ChunkEvaluateResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        // Reset states
        setChunks([]);
        setParentChildChunks([]);
        setSearchResults(null);
      }
    },
    maxFiles: 1,
  });

  const handleRunChunking = async () => {
    if (!file) {
      toast.error("Please upload a file first");
      return;
    }

    setIsProcessing(true);
    setSearchResults(null);
    try {
      const response = await api.chunkVisualize(file, strategy, params);
      if (strategy === "parent-child") {
        setParentChildChunks(response.parent_child_chunks || []);
        setChunks([]);
      } else {
        setChunks(response.chunks || []);
        setParentChildChunks([]);
      }
      toast.success("Chunking complete!");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to process chunks",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !searchQuery) return;

    setIsSearching(true);
    try {
      const response = await api.chunkEvaluate(
        file,
        strategy,
        searchQuery,
        params,
      );
      setSearchResults(response);
      toast.success("Search complete!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to search");
    } finally {
      setIsSearching(false);
    }
  };

  const updateParam = (key: string, value: string | number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const updateStrategy = (s: string) => {
    setStrategy(s);
    // Set default params for strategy
    if (s === "recursive") setParams({ chunk_size: 1000, chunk_overlap: 200 });
    if (s === "semantic") setParams({ breakpoint_threshold: 95 });
    if (s === "parent-child")
      setParams({ parent_chunk_size: 2000, child_chunk_size: 400 });
  };

  return {
    file,
    setFile,
    strategy,
    setStrategy: updateStrategy,
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
  };
}
