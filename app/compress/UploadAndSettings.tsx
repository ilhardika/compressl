import { Button } from "../components/ui/Button";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { ImageItem } from "./types";
import { cn } from "../lib/utils";
import React from "react";

interface Props {
  imageItems: ImageItem[];
  isProcessingAll: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  clearAllImages: () => void;
  compressAllImages: () => void;
}

export function UploadAndSettings({
  imageItems,
  isProcessingAll,
  fileInputRef,
  handleFileChange,
  handleDrop,
  clearAllImages,
  compressAllImages,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <Upload size={18} className="text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-800">Upload Images</h3>
          </div>
          {imageItems.length > 0 && (
            <Button
              onClick={clearAllImages}
              variant="secondary"
              className="text-sm py-1 px-2 bg-red-50 hover:bg-red-100 text-red-600"
            >
              <Trash2 size={14} className="mr-1" /> Clear All
            </Button>
          )}
        </div>
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer",
            "bg-gradient-to-b from-blue-50 to-blue-100/30",
            "hover:border-blue-400 hover:shadow-sm",
            "border-blue-200",
            imageItems.length > 0 && "p-4"
          )}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          {imageItems.length === 0 ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-800">
                Drag & Drop Images Here
              </h3>
              <p className="text-gray-600 mb-3">
                Or click to browse your files
              </p>
              <div className="inline-block px-3 py-1 bg-blue-100/50 rounded-full text-xs text-blue-700">
                JPG, PNG, WebP, GIF supported
              </div>
            </div>
          ) : (
            <div className="text-center py-3 text-gray-700 flex items-center justify-center">
              <Upload size={18} className="mr-2 text-blue-600" />
              <p>Drop more images or click to browse</p>
            </div>
          )}
        </div>

        {imageItems.length > 0 && (
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-blue-600">
                {imageItems.length}
              </span>{" "}
              images selected
            </p>
            <p className="text-xs text-gray-500">
              {imageItems.filter((item) => item.status === "compressed").length}{" "}
              compressed
            </p>
          </div>
        )}
      </div>

      {/* === TOMBOL COMPRESS ALL IMAGES DI SINI === */}
      {imageItems.length > 0 && (
        <Button
          onClick={compressAllImages}
          className="w-full justify-center font-medium mt-4"
          disabled={
            isProcessingAll ||
            imageItems.every((item) => item.status === "compressed")
          }
        >
          {isProcessingAll ? (
            <>
              <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
              Processing...
            </>
          ) : imageItems.every((i) => i.status === "compressed") ? (
            <span className="opacity-60">All images compressed</span>
          ) : (
            <>
              <ImageIcon className="mr-2 h-5 w-5" />
              Compress{" "}
              {
                imageItems.filter(
                  (i) => i.status === "pending" || i.status === "error"
                ).length
              }{" "}
              Images
            </>
          )}
        </Button>
      )}
    </div>
  );
}
