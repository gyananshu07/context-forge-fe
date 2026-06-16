import { Button } from "@/components/ui/button";
import { File, Sparkles, UploadCloud, X } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface PDFUploadProps {
  onUpload: (file: File) => void;
  selectedFile?: File | null;
  onClear: () => void;
}

export function PDFUpload({ onUpload, selectedFile, onClear }: PDFUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    },
    [onUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  if (selectedFile) {
    return (
      <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/50 transition-all">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <File className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground truncate max-w-[200px]">
              {selectedFile.name}
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClear}
          className="rounded-full hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`relative group border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ease-in-out ${
        isDragActive
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border hover:border-primary/50 hover:bg-muted/30"
      }`}
    >
      <input {...getInputProps()} />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
          {isDragActive ? (
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          ) : (
            <UploadCloud className="w-8 h-8 text-primary/80" />
          )}
        </div>

        <h3 className="text-base font-semibold text-foreground mb-2">
          {isDragActive ? "Drop to upload" : "Upload PDF Document"}
        </h3>
        <p className="text-sm text-muted-foreground max-w-[240px] mx-auto">
          Drag & drop your file here, or click to browse
        </p>
      </div>
    </div>
  );
}
