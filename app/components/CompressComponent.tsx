"use client";

import { useState, useRef } from "react";
import { Upload, FileImage, Download } from "lucide-react";
import { Button } from "./ui/Button";

export default function CompressComponent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setSelectedFile(file);
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;

    const file = e.dataTransfer.files[0];
    setSelectedFile(file);
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);

    // Simulasi proses kompresi
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulasi ukuran file terkompresi berdasarkan quality setting
    const compressionRatio = quality / 100;
    const simulatedCompressedSize = Math.round(
      selectedFile.size * (0.3 + 0.7 * compressionRatio)
    );

    setCompressedSize(simulatedCompressedSize);
    setIsProcessing(false);
  };

  const formatFileSize = (bytes: number | null) => {
    if (bytes === null) return "0 Bytes";
    if (bytes === 0) return "0 Bytes";

    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
  };

  const resetCompressor = () => {
    setSelectedFile(null);
    setPreview(null);
    setCompressedSize(null);
    setOriginalSize(null);
    setQuality(80);
  };

  return (
    <div className="w-full">
      {" "}
      {/* Ganti main menjadi div dan hapus min-h-screen */}
      <div className="max-w-4xl mx-auto">
        {/* Hapus heading yang menumpuk dengan page.tsx */}
        {/* <h1 className="text-3xl font-bold text-center mb-8">
          Image Compressor
        </h1> */}

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          {!preview ? (
            <div
              className="p-10 text-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <div
                className="border-2 border-dashed border-blue-300 rounded-lg p-12 hover:border-blue-500 transition-colors cursor-pointer bg-blue-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Upload className="h-16 w-16 mx-auto text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  Drop gambar Anda di sini
                </h3>
                <p className="text-gray-700 mb-4">
                  atau klik untuk memilih file
                </p>
                <p className="text-sm text-gray-600">
                  Mendukung JPG, PNG, WebP
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {" "}
              {/* Tambahkan padding */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Preview</h2>
                <div className="bg-blue-50 rounded-lg h-60 flex items-center justify-center mb-4 overflow-hidden">
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Original: {formatFileSize(originalSize)}</span>
                  {compressedSize && (
                    <span>Compressed: {formatFileSize(compressedSize)}</span>
                  )}
                </div>
                {compressedSize && (
                  <div className="mt-2 text-center">
                    <span className="text-green-600 font-medium">
                      {Math.round(
                        (1 - compressedSize / (originalSize || 1)) * 100
                      )}
                      % reduction in file size
                    </span>
                  </div>
                )}
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">
                  Pengaturan Kompresi
                </h2>

                <div className="mb-6">
                  <div className="flex justify-between mb-1">
                    <label className="text-gray-700 font-medium">
                      Kualitas: {quality}%
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
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Ukuran kecil</span>
                    <span>Kualitas tinggi</span>
                  </div>
                </div>

                <div className="space-y-4 mt-8">
                  {!compressedSize ? (
                    <Button
                      onClick={processImage}
                      className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                          Memproses...
                        </>
                      ) : (
                        <>
                          <FileImage className="mr-2 h-5 w-5" />
                          Kompres Gambar
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {}}
                      variant="primary"
                      className="w-full justify-center"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Unduh Gambar Terkompresi
                    </Button>
                  )}

                  <Button
                    onClick={resetCompressor}
                    variant="secondary"
                    className="w-full justify-center border border-gray-200"
                  >
                    Unggah Gambar Lain
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
