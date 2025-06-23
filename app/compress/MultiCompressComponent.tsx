"use client";

import { useState, useRef } from "react";
import imageCompression from "browser-image-compression";
import { UploadAndSettings } from "./UploadAndSettings";
import { OutputImages } from "./OutputImages";
import { ImageItem } from "./types";
import { ArrowRight, Download, Save } from "lucide-react"; // Tambahkan import icon
import { useAuth } from "@clerk/nextjs";
import { uploadCompressedImage } from "../lib/storage";
import { recordCompression } from "../lib/analytics";
import { supabase, formatUserId } from "../lib/supabase";
import { useToast } from "../components/ui/Toast";

export default function MultiCompressComponent() {
  // ===== STATE MANAGEMENT =====
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userId, isSignedIn } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // State baru untuk modal
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ImageItem | null>(null);

  // Check if Supabase is available
  const isSupabaseAvailable = !!supabase;

  // Tambahkan hook useToast
  const { showToast } = useToast();

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

  // Kompresi satu gambar (pakai default quality dari library)
  const compressImage = async (item: ImageItem) => {
    try {
      setImageItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: "processing" } : i))
      );

      const options = {
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        maxSizeMB: 1, // Batasi hasil maksimal 1MB
      };

      const compressedFile = await imageCompression(item.file, options);

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
        errorMessage:
          error instanceof Error
            ? error.message
            : "Unknown error occurred while compressing image",
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
  const downloadImage = async (item: ImageItem) => {
    if (!item.compressedFile) return;

    // Original download logic
    const extension = item.file.name.split(".").pop() || "jpg";
    const nameWithoutExtension = item.file.name.replace(/\.[^/.]+$/, "");
    const fileName = `${nameWithoutExtension}_compressed.${extension}`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(item.compressedFile);
    link.download = fileName;
    link.click();

    // Cleanup object URL
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
    }, 100);
  };

  // Modifikasi downloadImage untuk memunculkan modal pilihan
  const handleImageAction = (item: ImageItem) => {
    if (!item.compressedFile) return;

    // Jika user belum login atau Supabase tidak tersedia, langsung download
    if (!isSignedIn || !isSupabaseAvailable) {
      downloadImage(item);
      return;
    }

    // Jika user sudah login, tunjukkan modal pilihan
    setSelectedItem(item);
    setShowModal(true);
  };

  // Fungsi untuk menyimpan ke Supabase
  const saveToSupabase = async (item: ImageItem) => {
    if (!isSignedIn || !userId || !item.compressedFile || !item.compressedSize)
      return;

    try {
      setIsSaving(true);

      // Upload to Supabase storage
      const uploadResult = await uploadCompressedImage(
        item.compressedFile,
        userId
      );

      if (!uploadResult) {
        showToast("Gagal mengunggah gambar. Silakan coba lagi.", "error");
        return;
      }

      // Record compression analytics
      const compressionData = {
        userId, // Pastikan ini adalah ID dari Clerk yang valid
        originalSize: item.originalSize,
        compressedSize: item.compressedSize,
        compressionRate: item.compressionPercent || 0,
        fileName: uploadResult.fullFileName,
        imageType: item.file.name.split(".").pop() || "jpg",
      };

      console.log("Data kompresi yang akan disimpan:", compressionData);

      const { data, error } = await recordCompression(compressionData);

      if (error) {
        console.error("Error saat menyimpan data kompresi:", error);
        showToast(`Gagal menyimpan data kompresi: ${error.message}`, "error");
      } else {
        showToast("Gambar berhasil disimpan ke dashboard!", "success");
      }
    } catch (error) {
      showToast(`Gagal menyimpan gambar: ${error.message}`, "error");
    } finally {
      setIsSaving(false);
      setShowModal(false);
    }
  };

  // Fungsi kombinasi simpan dan download
  const saveAndDownload = async (item: ImageItem) => {
    await saveToSupabase(item);
    downloadImage(item);
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

  // Save satu gambar ke dashboard
  const handleSaveImage = (item: ImageItem) => {
    if (!isSignedIn || !isSupabaseAvailable) {
      showToast("Login untuk menyimpan ke dashboard", "info");
      return;
    }
    saveToSupabase(item);
  };

  // Save semua gambar ke dashboard
  const handleSaveAllImages = async () => {
    if (!isSignedIn || !isSupabaseAvailable) {
      showToast("Login untuk menyimpan ke dashboard", "info");
      return;
    }
    const compressedItems = imageItems.filter(
      (item) => item.status === "compressed" && item.compressedFile
    );
    if (compressedItems.length === 0) return;
    setIsSaving(true);
    for (const item of compressedItems) {
      await saveToSupabase(item);
    }
    setIsSaving(false);
    showToast("Semua gambar berhasil disimpan ke dashboard!", "success");
  };

  // ===== RENDER UI =====
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Image Compression Tool
      </h1>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        Optimize your images with our simple compression tool. Upload and
        download high-quality compressed images within seconds.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
        {/* Input Section */}
        <div className="relative">
          <div className="sticky top-4">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="bg-white text-blue-600 rounded-full h-7 w-7 inline-flex items-center justify-center mr-2 text-sm">
                    1
                  </span>
                  Upload Images
                </h2>
                <p className="text-blue-100 text-sm">
                  Add your images to compress
                </p>
              </div>
              <div className="p-6">
                <UploadAndSettings
                  imageItems={imageItems}
                  isProcessingAll={isProcessingAll}
                  fileInputRef={fileInputRef}
                  handleFileChange={handleFileChange}
                  handleDrop={handleDrop}
                  clearAllImages={clearAllImages}
                  compressAllImages={compressAllImages}
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
                <span className="bg-white text-green-600 rounded-full h-7 w-7 inline-flex items-center justify-center mr-2 text-sm">
                  2
                </span>
                Results & Download
              </h2>
              <p className="text-green-100 text-sm">
                View and download your compressed images
              </p>
            </div>
            <div className="p-6">
              {imageItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <div className="w-24 h-24 border-4 border-dashed rounded-full flex items-center justify-center mb-4">
                    <ArrowRight size={32} />
                  </div>
                  <p className="text-lg font-medium">
                    Your compressed images will appear here
                  </p>
                  <p className="text-sm mt-2">Upload an image to get started</p>
                </div>
              ) : (
                <OutputImages
                  imageItems={imageItems}
                  formatFileSize={formatFileSize}
                  removeImage={removeImage}
                  downloadImage={handleImageAction}
                  downloadAllImages={downloadAllImages}
                  saveImage={handleSaveImage} // Tambah ini
                  saveAllImages={handleSaveAllImages} // Tambah ini
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal untuk pilihan Download atau Save */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Save or Download
            </h3>
            <p className="text-gray-600 mb-6">
              What would you like to do with this compressed image?
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => downloadImage(selectedItem)}
                className="flex flex-col items-center justify-center py-4 px-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Download size={32} className="mb-2 text-gray-700" />
                <span className="font-medium text-gray-800">Download Only</span>
                <span className="text-xs text-gray-500 mt-1">
                  Save to your device
                </span>
              </button>

              <button
                onClick={() => saveToSupabase(selectedItem)}
                className="flex flex-col items-center justify-center py-4 px-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                <Save size={32} className="mb-2 text-blue-700" />
                <span className="font-medium text-blue-800">
                  Save to Dashboard
                </span>
                <span className="text-xs text-blue-600 mt-1">
                  Access later from your account
                </span>
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => saveAndDownload(selectedItem)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Save and download
              </button>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>

            {isSaving && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                <div className="flex flex-col items-center">
                  <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mb-2"></div>
                  <p className="text-blue-600 font-medium">Saving...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Supabase info message */}
      {isSignedIn && isSupabaseAvailable && (
        <p className="text-xs text-gray-600 mt-1">
          Sign in to save images to your dashboard for later access
        </p>
      )}
    </div>
  );
}
