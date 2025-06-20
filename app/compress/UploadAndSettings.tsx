import { Button } from "../components/ui/Button";
import { Upload, Trash2, FileImage, Download } from "lucide-react";
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
    <div>
      {/* Upload Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {imageItems.length > 0 ? "Gambar-gambar Anda" : "Upload Gambar"}
          </h2>
          {imageItems.length > 0 && (
            <Button
              onClick={clearAllImages}
              variant="secondary"
              className="text-sm py-1 px-2"
            >
              <Trash2 size={16} className="mr-1" /> Hapus Semua
            </Button>
          )}
        </div>
        <div
          className={cn(
            "border-2 border-dashed border-blue-300 rounded-lg p-8 hover:border-blue-500 transition-colors cursor-pointer bg-blue-50",
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
              <Upload className="h-16 w-16 mx-auto text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Drop gambar di sini
              </h3>
              <p className="text-gray-700 mb-4">atau klik untuk memilih file</p>
              <p className="text-sm text-gray-600">
                Mendukung JPG, PNG, WebP, GIF (multiple files)
              </p>
            </div>
          ) : (
            <div className="text-center py-2 text-gray-700">
              <p>Drop lagi gambar di sini atau klik untuk menambahkan</p>
            </div>
          )}
        </div>
      </div>

      {/* Compression Settings */}
      {imageItems.length > 0 && (
        <div className="mb-8 bg-white rounded-xl border border-gray-200 p-4">
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-2">
              Pengaturan Kompresi
            </h3>
            <div className="flex justify-between mb-1">
              <label className="text-gray-700">
                Kualitas hasil kompresi:{" "}
                <span className="font-semibold">{quality}%</span>
              </label>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value))}
              className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Ukuran kecil</span>
              <span>Kualitas tinggi</span>
            </div>
          </div>
          <Button
            onClick={compressAllImages}
            className="w-full justify-center"
            disabled={
              isProcessingAll ||
              imageItems.every((item) => item.status === "compressed")
            }
          >
            {isProcessingAll ? (
              <>
                <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                Memproses...
              </>
            ) : imageItems.every((i) => i.status === "compressed") ? (
              <span className="opacity-60">Semua gambar sudah terkompresi</span>
            ) : (
              <>
                <FileImage className="mr-2 h-5 w-5" />
                Kompres{" "}
                {
                  imageItems.filter(
                    (i) => i.status === "pending" || i.status === "error"
                  ).length
                }{" "}
                Gambar
              </>
            )}
          </Button>
          {imageItems.some((item) => item.status === "compressed") && (
            <Button
              onClick={downloadAllImages}
              variant="primary"
              className="w-full justify-center mt-2"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Semua Gambar
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
