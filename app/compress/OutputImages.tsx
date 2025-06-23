import { Button } from "../components/ui/Button";
import {
  X,
  Download,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Save,
} from "lucide-react";
import { ImageItem } from "./types";
import React, { useState } from "react";

interface Props {
  imageItems: ImageItem[];
  formatFileSize: (bytes: number | undefined) => string;
  removeImage: (id: string) => void;
  downloadImage: (item: ImageItem) => void;
  downloadAllImages: () => void;
  saveImage: (item: ImageItem) => void; // Tambah ini
  saveAllImages: () => void; // Tambah ini
}

export function OutputImages({
  imageItems,
  formatFileSize,
  removeImage,
  downloadImage,
  downloadAllImages,
  saveAllImages,
}: Props) {
  // Map untuk menyimpan state expanded untuk masing-masing item
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (imageItems.length === 0) return null;

  // Filter hanya menampilkan item yang sudah dikompresi
  const compressedItems = imageItems.filter(
    (item) => item.status === "compressed"
  );
  const hasCompressedItems = compressedItems.length > 0;

  return (
    <div className="space-y-4">
      {/* Download All Button at top */}
      {hasCompressedItems && (
        <div className="mb-4 flex gap-2">
          <Button
            onClick={downloadAllImages}
            variant="primary"
            className="flex-1 justify-center bg-green-600 hover:bg-green-700"
          >
            <Download className="mr-2 h-5 w-5" />
            Download All ({compressedItems.length})
          </Button>
          <Button
            onClick={saveAllImages}
            variant="secondary"
            className="flex-1 justify-center"
          >
            <Save className="mr-2 h-5 w-5" />
            Save All ({compressedItems.length})
          </Button>
        </div>
      )}

      {imageItems.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-all duration-200"
        >
          {/* IMAGE HEADER - Always visible */}
          <div
            className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => toggleItem(item.id)}
          >
            <div className="font-medium text-gray-800 truncate max-w-[80%] flex items-center">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                <ImageIcon size={14} className="text-blue-600" />
              </div>
              {item.file.name}
            </div>
            <div className="flex items-center">
              {/* Status indicator dot */}
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  item.status === "compressed"
                    ? "bg-green-500"
                    : item.status === "processing"
                    ? "bg-blue-500"
                    : item.status === "error"
                    ? "bg-red-500"
                    : "bg-gray-400"
                }`}
              ></div>

              {/* Toggle Button */}
              <button className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                {expandedItems[item.id] ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>

              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(item.id);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 ml-1"
                title="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* IMAGE COMPARISON - Collapsible */}
          {expandedItems[item.id] && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white">
              {/* Original Image */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-700 flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                    Original
                  </div>
                  <div className="text-xs text-gray-500 py-0.5 px-2 bg-gray-100 rounded-full">
                    {formatFileSize(item.originalSize)}
                  </div>
                </div>
                <div className="bg-[#f8fafc] rounded-lg overflow-hidden flex items-center justify-center border border-gray-100 aspect-video">
                  <img
                    src={item.originalPreview}
                    alt="Original"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>

              {/* Compressed Image */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-700 flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                    Compressed
                  </div>
                  {item.compressedSize ? (
                    <div className="text-xs text-gray-500 py-0.5 px-2 bg-gray-100 rounded-full">
                      {formatFileSize(item.compressedSize)}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 py-0.5 px-2 bg-gray-100 rounded-full">
                      Waiting...
                    </div>
                  )}
                </div>
                <div
                  className={`rounded-lg overflow-hidden flex items-center justify-center border ${
                    item.status === "compressed"
                      ? "border-green-100 bg-[#f0fdf4]"
                      : "border-gray-100 bg-[#f8fafc]"
                  } aspect-video`}
                >
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
                    <div className="flex flex-col items-center text-red-500 p-4 text-center">
                      <div className="rounded-full bg-red-50 p-2 mb-2">
                        <X size={24} className="text-red-500" />
                      </div>
                      <div className="font-medium">Compression Failed</div>
                      <div className="text-xs mt-1 text-red-400">
                        {item.errorMessage}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 p-4">
                      <div className="rounded-full bg-gray-100 p-3 mb-2">
                        <ImageIcon size={24} className="text-gray-400" />
                      </div>
                      <div className="text-sm">Waiting for compression</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ITEM ACTION BUTTONS - Always visible */}
          <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <div className="flex items-center text-sm space-x-2">
              {item.status === "compressed" ? (
                <div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">
                      {formatFileSize(item.originalSize)}
                    </span>
                    <span className="text-gray-400 mx-2">→</span>
                    <span className="font-medium text-green-600">
                      {formatFileSize(item.compressedSize)}
                    </span>
                  </div>
                  {/* Status Badge */}
                  <div className="mt-2 text-xs text-center py-1 max-w-26 px-2 rounded-full font-medium bg-green-100 text-green-700">
                    {item.compressionPercent}% smaller
                  </div>
                </div>
              ) : (
                <div
                  className={`
                  text-xs py-1 px-2 rounded-full font-medium
                  ${
                    item.status === "processing"
                      ? "bg-blue-100 text-blue-700"
                      : item.status === "error"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }
                `}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </div>
              )}
            </div>

            {/* Download button only for compressed items */}
            {item.status === "compressed" && (
              <div className="flex gap-2">
                <Button
                  onClick={() => downloadImage(item)}
                  variant="primary"
                  size="sm"
                  className="justify-center bg-green-600 hover:bg-green-700 py-1.5"
                >
                  <Download className="mr-1 h-4 w-4" />
                  Download
                </Button>
                <Button
                  onClick={() => saveImage(item)}
                  variant="secondary"
                  size="sm"
                  className="justify-center text-blue-600 py-1.5"
                >
                  <Save className="mr-1 h-4 w-4" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
