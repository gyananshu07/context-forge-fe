import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  File as FileIcon,
  FlaskConical,
  Loader2,
  UploadCloud,
} from "lucide-react";
import type { DropzoneState } from "react-dropzone";

interface ChunkingControlsProps {
  file: File | null;
  setFile: (f: File | null) => void;
  strategy: string;
  setStrategy: (s: string) => void;
  params: Record<string, string | number>;
  updateParam: (key: string, value: string | number) => void;
  isProcessing: boolean;
  handleRunChunking: () => void;
  getRootProps: DropzoneState["getRootProps"];
  getInputProps: DropzoneState["getInputProps"];
  isDragActive: boolean;
}

export function ChunkingControls({
  file,
  setFile,
  strategy,
  setStrategy,
  params,
  updateParam,
  isProcessing,
  handleRunChunking,
  getRootProps,
  getInputProps,
  isDragActive,
}: ChunkingControlsProps) {
  return (
    <div className="w-[22rem] border-r border-border/40 p-6 flex flex-col gap-6 overflow-y-auto bg-card/30">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
          <FlaskConical className="w-5 h-5 text-primary" />
          Advanced Chunking Lab
        </h2>
        <p className="text-sm text-muted-foreground">
          Experiment with document chunking strategies.
        </p>
      </div>

      {/* File Upload */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Document</h3>
        {!file ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">
              Drop PDF or Markdown here
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 border rounded-xl bg-muted/30">
            <div className="flex items-center gap-3 overflow-hidden">
              <FileIcon className="w-5 h-5 text-primary shrink-0" />
              <span className="text-sm truncate">{file.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFile(null)}
              className="h-6 px-2 text-xs"
            >
              Change
            </Button>
          </div>
        )}
      </div>

      {/* Strategy Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Strategy</h3>
        <div className="grid grid-cols-2 gap-2">
          {["recursive", "semantic", "markdown", "parent-child"].map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setStrategy(s)}
              className={`p-2 text-xs rounded-lg border text-center capitalize transition-colors ${
                strategy === s
                  ? "border-primary bg-primary/10 font-medium"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              {s.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Parameters */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Parameters</h3>
        <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border/50">
          {strategy === "recursive" && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Chunk Size
                </label>
                <Input
                  type="number"
                  value={params.chunk_size || 1000}
                  onChange={(e) =>
                    updateParam("chunk_size", parseInt(e.target.value))
                  }
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Chunk Overlap
                </label>
                <Input
                  type="number"
                  value={params.chunk_overlap || 200}
                  onChange={(e) =>
                    updateParam("chunk_overlap", parseInt(e.target.value))
                  }
                  className="h-8 text-sm"
                />
              </div>
            </>
          )}
          {strategy === "semantic" && (
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">
                Breakpoint Threshold (%)
              </label>
              <Input
                type="number"
                value={params.breakpoint_threshold || 95}
                onChange={(e) =>
                  updateParam(
                    "breakpoint_threshold",
                    parseFloat(e.target.value),
                  )
                }
                className="h-8 text-sm"
              />
            </div>
          )}
          {strategy === "parent-child" && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Parent Chunk Size
                </label>
                <Input
                  type="number"
                  value={params.parent_chunk_size || 2000}
                  onChange={(e) =>
                    updateParam("parent_chunk_size", parseInt(e.target.value))
                  }
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  Child Chunk Size
                </label>
                <Input
                  type="number"
                  value={params.child_chunk_size || 400}
                  onChange={(e) =>
                    updateParam("child_chunk_size", parseInt(e.target.value))
                  }
                  className="h-8 text-sm"
                />
              </div>
            </>
          )}
          {strategy === "markdown" && (
            <div className="text-xs text-muted-foreground">
              Uses Markdown headers to split text. No parameters required.
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={handleRunChunking}
        disabled={!file || isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : null}
        {isProcessing ? "Processing..." : "Run Chunking"}
      </Button>
    </div>
  );
}
