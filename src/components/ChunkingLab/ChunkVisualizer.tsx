import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ChunkMetadata {
  [key: string]: unknown;
}

export interface ChunkItem {
  id: string;
  text: string;
  length: number;
  metadata: ChunkMetadata;
}

export interface ParentChildChunk {
  parent: ChunkItem;
  children: ChunkItem[];
}

interface ChunkVisualizerProps {
  chunks: ChunkItem[];
  parentChildChunks?: ParentChildChunk[];
  strategy: string;
}

export function ChunkVisualizer({
  chunks,
  parentChildChunks,
  strategy,
}: ChunkVisualizerProps) {
  if (strategy === "parent-child" && parentChildChunks) {
    return (
      <ScrollArea className="h-full w-full pr-4">
        <div className="space-y-6">
          {parentChildChunks.map((pc, i) => (
            <div
              key={pc.parent.id}
              className="border border-border/50 rounded-xl overflow-hidden bg-card text-card-foreground shadow-sm"
            >
              <div className="p-4 bg-muted/30 border-b border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant="outline"
                    className="bg-primary/5 text-primary"
                  >
                    Parent Chunk {i + 1}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {pc.parent.length} chars
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{pc.parent.text}</p>
              </div>
              <div className="p-4 space-y-3">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">
                  Child Chunks ({pc.children.length})
                </h4>
                {pc.children.map((child, j) => (
                  <div
                    key={child.id}
                    className="p-3 rounded-lg border border-border/40 bg-background/50 hover:bg-muted/10 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        Child {j + 1}
                      </span>
                      <span className="text-[0.625rem] text-muted-foreground">
                        {child.length} chars
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{child.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-full w-full pr-4">
      <div className="space-y-4">
        {chunks.map((chunk, i) => (
          <div
            key={chunk.id}
            className="p-4 rounded-xl border border-border/50 bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2 gap-4">
              <Badge variant="secondary" className="font-mono text-xs">
                Chunk {i + 1}
              </Badge>
              <div className="flex gap-2 flex-wrap justify-end">
                {Object.entries(chunk.metadata).map(([k, v]) => (
                  <Badge
                    key={k}
                    variant="outline"
                    className="text-[0.625rem] bg-background"
                  >
                    {k}: {String(v)}
                  </Badge>
                ))}
                <Badge variant="outline" className="text-[0.625rem] bg-background">
                  {chunk.length} chars
                </Badge>
              </div>
            </div>
            <p className="text-sm whitespace-pre-wrap mt-2">{chunk.text}</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
