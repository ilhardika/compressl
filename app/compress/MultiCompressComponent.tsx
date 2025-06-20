"use client";

import { useState, useRef } from "react";
import imageCompression from "browser-image-compression";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { UploadAndSettings } from "./UploadAndSettings";
import { OutputImages } from "./OutputImages";
import { ImageItem } from "./types";
import { ArrowRight } from "lucide-react";

// Interface untuk item gambar
interface ImageItem {
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

export default function MultiCompressComponent() {
  // ===== STATE MANAGEMENT =====
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [quality, setQuality] = useState<number>(80);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ===== UTILITY FUNCTIONS =====

  // Generate unique ID
  const generateId = () =>
    `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Format file size untuk display
  const formatFileSize = (bytes: number | undefined) => {
    if (bytes === undefined) return "0 Bytes";
    if (bytes === 0) return "0 Bytes";

    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
  };

  // ===== FILE HANDLING =====

  // Tambahkan file gambar ke state
  const addImageFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const newItem: ImageItem = {
          id: generateId(),
          file,
          originalPreview: e.target?.result as string,
          originalSize: file.size,
          status: "pending",
        };

        setImageItems((prev) => [...prev, newItem]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Handler untuk input file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addImageFiles(e.target.files);
    // Reset input agar event fire lagi jika user memilih file yang sama
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handler untuk drag & drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    addImageFiles(e.dataTransfer.files);
  };

  // ===== COMPRESSION FUNCTIONS =====

  // Kompresi satu gambar
  const compressImage = async (item: ImageItem) => {
    try {
      // Update status menjadi processing
      setImageItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: "processing" } : i))
      );

      // Opsi kompresi
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: quality / 100,
      };

      // Proses kompresi
      const compressedFile = await imageCompression(item.file, options);

      // Buat preview untuk file hasil kompresi
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);

      return new Promise<Partial<ImageItem>>((resolve) => {
        reader.onload = () => {
          const compressionPercent = Math.round(
            (1 - compressedFile.size / item.originalSize) * 100
          );

          resolve({
            compressedFile,
            compressedPreview: reader.result as string,
            compressedSize: compressedFile.size,
            compressionPercent,
            status: "compressed",
          });
        };
      });
    } catch (error) {
      console.error("Error compressing image:", error);
      return {
        status: "error",
        errorMessage: "Failed to compress image",
      };
    }
  };

  // Kompresi semua gambar
  const compressAllImages = async () => {
    const pendingItems = imageItems.filter(
      (item) => item.status === "pending" || item.status === "error"
    );

    if (pendingItems.length === 0) return;

    setIsProcessingAll(true);

    for (const item of pendingItems) {
      const result = await compressImage(item);

      setImageItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, ...result } : i))
      );
    }

    setIsProcessingAll(false);
  };

  // ===== DOWNLOAD FUNCTIONS =====

  // Download satu gambar
  const downloadImage = (item: ImageItem) => {
    if (!item.compressedFile) return;

    // Gunakan extension file asli jika ada
    const extension = item.file.name.split(".").pop() || "jpg";
    const nameWithoutExtension = item.file.name.replace(/\.[^/.]+$/, "");
    const fileName = `${nameWithoutExtension}_compressed.${extension}`;

    // Download file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(item.compressedFile);
    link.download = fileName;
    link.click();
  };

  // Download semua gambar yang sudah terkompresi
  const downloadAllImages = async () => {
    const compressedItems = imageItems.filter(
      (item) => item.status === "compressed" && item.compressedFile
    );

    if (compressedItems.length === 0) return;

    // Untuk semua gambar, download satu per satu (tanpa zip)
    compressedItems.forEach((item) => {
      if (!item.compressedFile) return;

      // Download file langsung
      const extension = item.file.name.split(".").pop() || "jpg";
      const nameWithoutExtension = item.file.name.replace(/\.[^/.]+$/, "");
      const fileName = `${nameWithoutExtension}_compressed.${extension}`;

      const link = document.createElement("a");
      link.href = URL.createObjectURL(item.compressedFile);
      link.download = fileName;
      link.click();

      // Beri jeda sedikit agar browser tidak kewalahan
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 100);
    });
  };

  // ===== IMAGE MANAGEMENT =====

  // Hapus satu gambar
  const removeImage = (id: string) => {
    setImageItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Hapus semua gambar
  const clearAllImages = () => {
    setImageItems([]);
  };

  // ===== RENDER UI =====
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Image Compression Tool
      </h1>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        Optimize your images with our simple compression tool. Upload, adjust settings,
        and download high-quality compressed images within seconds.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
        {/* Input Section */}
        <div className="relative">
          <div className="sticky top-4">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="bg-white text-blue-600 rounded-full h-7 w-7 inline-flex items-center justify-center mr-2 text-sm">1</span>
                  Upload & Settings
                </h2>
                <p className="text-blue-100 text-sm">Add your images and customize compression options</p>
              </div>
              <div className="p-6">
                <UploadAndSettings
                  imageItems={imageItems}
                  quality={quality}
                  setQuality={setQuality}
                  isProcessingAll={isProcessingAll}
                  fileInputRef={fileInputRef}
                  handleFileChange={handleFileChange}
                  handleDrop={handleDrop}
                  clearAllImages={clearAllImages}
                  compressAllImages={compressAllImages}
                  downloadAllImages={downloadAllImages}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Arrow for larger screens */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-white rounded-full shadow-lg p-3">
            <ArrowRight size={24} className="text-blue-600" />
          </div>
        </div>

        {/* Arrow for mobile */}
        <div className="lg:hidden flex justify-center my-2">
          <div className="bg-white rounded-full shadow-lg p-3 rotate-90">
            <ArrowRight size={24} className="text-blue-600" />
          </div>
        </div>

        {/* Output Section */}
        <div>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 h-full">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="bg-white text-green-600 rounded-full h-7 w-7 inline-flex items-center justify-center mr-2 text-sm">2</span>
                Results & Download
              </h2>
              <p className="text-green-100 text-sm">View and download your compressed images</p>
            </div>
            <div className="p-6">
              {imageItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <div className="w-24 h-24 border-4 border-dashed rounded-full flex items-center justify-center mb-4">
                    <ArrowRight size={32} />
                  </div>
                  <p className="text-lg font-medium">Your compressed images will appear here</p>
                  <p className="text-sm mt-2">Upload an image to get started</p>
                </div>
              ) : (
                <OutputImages
                  imageItems={imageItems}
                  formatFileSize={formatFileSize}
                  removeImage={removeImage}
                  downloadImage={downloadImage}
                  downloadAllImages={downloadAllImages} // tambahkan prop ini
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
