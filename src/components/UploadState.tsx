import { FileUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PDFUpload } from "./PDFUpload";

interface UploadStateProps {
  onUpload: (file: File) => void;
  onClear: () => void;
}

export function UploadState({ onUpload, onClear }: UploadStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-[#F8FAFC]/50">
      <Card className="w-full max-w-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-border/40 rounded-2xl">
        <CardHeader className="text-center pb-2 pt-6">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary mb-4 shadow-sm">
            <FileUp className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl">Upload Document</CardTitle>
          <CardDescription>
            Upload a PDF document to begin chatting with it. We will parse
            and split it into searchable sections.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <PDFUpload onUpload={onUpload} onClear={onClear} />
        </CardContent>
      </Card>
    </div>
  );
}
