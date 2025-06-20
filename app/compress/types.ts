export interface ImageItem {
  id: string;
  file: File;
  originalPreview: string;
  originalSize: number;
  compressedFile?: File;
  compressedPreview?: string;
  compressedSize?: number;
  compressionPercent?: number;
  status: "pending" | "processing" | "compressed" | "error";
  errorMessage?: string;
}
