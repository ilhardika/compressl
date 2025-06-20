import { Button } from "../components/ui/Button";
import { Upload, Trash2, FileImage, Download, Settings, Image as ImageIcon } from "lucide-react";
import { ImageItem } from "./types";
import { cn } from "../lib/utils";
import React from "react";

interface Props {
  imageItems: ImageItem[];
  quality: number;
  setQuality: (v: number) => void;
  isProcessingAll: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  clearAllImages: () => void;
  compressAllImages: () => void;
  downloadAllImages: () => void;
}

export function UploadAndSettings({
  imageItems,
  quality,
  setQuality,
  isProcessingAll,
  fileInputRef,
  handleFileChange,
  handleDrop,
  clearAllImages,
  compressAllImages,
  downloadAllImages,
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
              <h3 className="text-lg font-medium mb-2 text-gray-800">Drag & Drop Images Here</h3>
              <p className="text-gray-600 mb-3">Or click to browse your files</p>
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
              <span className="font-medium text-blue-600">{imageItems.length}</span> images selected
            </p>
            <p className="text-xs text-gray-500">
              {imageItems.filter(item => item.status === "compressed").length} compressed
            </p>
          </div>
        )}
      </div>

      {/* Compression Settings */}
      {imageItems.length > 0 && (
        <div>
          <div className="flex items-center mb-3">
            <Settings size={18} className="text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-800">Compression Settings</h3>
          </div>
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
            <div className="mb-5">
              <div className="flex justify-between mb-2">
                <label className="text-gray-700 font-medium">
                  Output Quality: <span className="text-blue-600">{quality}%</span>
                </label>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Smaller file size</span>
                <span>Higher quality</span>
              </div>
              
              <div className="mt-4 text-xs text-gray-600 bg-blue-100/50 p-3 rounded-lg">
                <p className="mb-1 font-medium">Tip:</p>
                <p>Lower quality (30-60%) works well for web images and can reduce file size by 70-90%</p>
              </div>
            </div>
            
            <Button
              onClick={compressAllImages}
              className="w-full justify-center font-medium"
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
            
            {imageItems.some((item) => item.status === "compressed") && (
              <Button
                onClick={downloadAllImages}
                variant="secondary"
                className="w-full justify-center mt-3 bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="mr-2 h-5 w-5" />
                Download All Images
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
