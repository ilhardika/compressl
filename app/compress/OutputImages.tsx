import { Button } from "../components/ui/Button";
import { X, Download, FileImage, Image as ImageIcon } from "lucide-react";
import { ImageItem } from "./types";
import React from "react";

interface Props {
  imageItems: ImageItem[];
  formatFileSize: (bytes: number | undefined) => string;
  removeImage: (id: string) => void;
  compressImage: (item: ImageItem) => void;
  downloadImage: (item: ImageItem) => void;
}

export function OutputImages({
  imageItems,
  formatFileSize,
  removeImage,
  compressImage,
  downloadImage,
}: Props) {
  if (imageItems.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-4">
      {imageItems.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
        >
          {/* IMAGE HEADER */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <div className="font-medium text-gray-900 truncate max-w-[80%]">
              {item.file.name}
            </div>
            <button
              onClick={() => removeImage(item.id)}
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          {/* IMAGE COMPARISON */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {/* Original Image */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Original</div>
              <div className="bg-gray-50 aspect-video rounded-md overflow-hidden flex items-center justify-center">
                <img
                  src={item.originalPreview}
                  alt="Original"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="text-sm text-gray-600">
                Size: {formatFileSize(item.originalSize)}
              </div>
            </div>
            {/* Compressed Image */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">
                Compressed
              </div>
              <div className="bg-gray-50 aspect-video rounded-md overflow-hidden flex items-center justify-center">
                {item.status === "compressed" && item.compressedPreview ? (
                  <img
                    src={item.compressedPreview}
                    alt="Compressed"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : item.status === "processing" ? (
                  <div className="flex flex-col items-center text-gray-400">
                    <div className="animate-spin h-8 w-8 mb-2 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <div className="text-sm">Processing...</div>
                  </div>
                ) : item.status === "error" ? (
                  <div className="flex flex-col items-center text-red-500">
                    <div className="mb-1">Error</div>
                    <div className="text-xs">{item.errorMessage}</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <ImageIcon size={32} className="mb-2" />
                    <div className="text-sm">Siap dikompres</div>
                  </div>
                )}
              </div>
              {/* SIZE INFO */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {item.compressedSize
                    ? `Size: ${formatFileSize(item.compressedSize)}`
                    : "Size: -"}
                </div>
                {item.status === "compressed" && item.compressionPercent && (
                  <div className="text-sm font-medium text-green-600">
                    {item.compressionPercent}% lebih kecil
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* ITEM ACTION BUTTONS */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            {item.status === "compressed" ? (
              <Button
                onClick={() => downloadImage(item)}
                variant="primary"
                className="w-full justify-center"
              >
                <Download className="mr-2 h-5 w-5" />
                Download
              </Button>
            ) : item.status === "error" || item.status === "pending" ? (
              <Button
                onClick={() => compressImage(item)}
                className="w-full justify-center"
                disabled={item.status === "processing"}
              >
                <FileImage className="mr-2 h-5 w-5" />
                Kompres
              </Button>
            ) : (
              <Button disabled className="w-full justify-center">
                <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                Memproses...
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
