"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { getUserImages } from "../lib/storage";
import { getUserStats } from "../lib/analytics";
import { useSupabase } from "../lib/supabase";
import { useToast } from "../components/ui/Toast";
import Link from "next/link";
import { ArrowLeft, FileImage, Download, Trash2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";

export default function DashboardPage() {
  const { userId, isSignedIn } = useAuth();
  const [userImages, setUserImages] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabaseClient = useSupabase();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadUserData() {
      if (!userId) return;

      try {
        setLoading(true);

        if (!supabaseClient) {
          showToast("Koneksi database tidak tersedia", "error");
          return;
        }

        // Ambil data dari database
        const { data: compressions, error: dbError } = await supabaseClient
          .from("compressions")
          .select("*")
          .order("created_at", { ascending: false });

        if (dbError) {
          showToast("Gagal mengambil data kompresi", "error");
          console.error("Tidak dapat mengambil data kompresi");
        } else {
          if (compressions && compressions.length > 0) {
            const transformedImages = await Promise.all(
              compressions.map(async (record) => {
                let imageUrl = "";

                try {
                  // Gunakan nama file dengan format yang benar
                  const fileName = record.file_name.replace(/\s+/g, "_");
                  // Untuk bucket yang telah disetel sebagai PUBLIC
                  const { data: urlData } = supabaseClient.storage
                    .from("compressed-images")
                    .getPublicUrl(`public/${fileName}`);

                  imageUrl = urlData?.publicUrl || "";
                  console.log("Public URL:", imageUrl);

                  // Untuk bucket PRIVATE, gunakan ini sebagai gantinya:
                  /*
                  const { data: signedUrlData, error: signedUrlError } = await supabaseClient.storage
                    .from("compressed-images")
                    .createSignedUrl(`public/${fileName}`, 60 * 60); // 1 jam

                  imageUrl = signedUrlData?.signedUrl || "";
                  console.log("Signed URL:", imageUrl);
                  */
                } catch (urlErr) {
                  console.warn("Error getting URL:", urlErr);
                  imageUrl = "";
                }

                return {
                  id: record.id,
                  name: record.file_name,
                  url: imageUrl,
                  size: record.compressed_size,
                  created_at: record.created_at,
                  original_size: record.original_size,
                  compressed_size: record.compressed_size,
                  compression_rate: record.compression_rate,
                  image_type: record.image_type,
                };
              })
            );

            setUserImages(transformedImages);
            setStats({
              totalSaved: transformedImages.reduce(
                (sum, img) => sum + (img.original_size - img.compressed_size),
                0
              ),
              totalFiles: transformedImages.length,
              avgCompressionRate:
                transformedImages.reduce(
                  (sum, img) => sum + img.compression_rate,
                  0
                ) / transformedImages.length,
            });
          } else {
            setUserImages([]);
            setStats(null);
          }
        }
      } catch (error) {
        console.error("Error saat memuat data pengguna");
        showToast("Terjadi kesalahan saat memuat data", "error");
      } finally {
        setLoading(false);
      }
    }

    if (isSignedIn && userId) {
      loadUserData();
    }
  }, [userId, isSignedIn, supabaseClient, showToast]);

  // Fungsi untuk men-download gambar
  const downloadImage = async (url, fileName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();

      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 100);

      showToast(`Gambar ${fileName} berhasil diunduh`, "success");
    } catch (error) {
      console.error("Error saat download gambar:", error);
      showToast("Gagal mengunduh gambar. Silakan coba lagi.", "error");
    }
  };

  // Fungsi untuk menghapus gambar dengan konfirmasi modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  const confirmDelete = (id, fileName) => {
    // Format nama file agar sesuai dengan yang disimpan di storage
    const formattedFileName = fileName.replace(/\s+/g, "_");
    setImageToDelete({ id, fileName: formattedFileName });
    setShowDeleteModal(true);
  };

  const handleDeleteImage = async () => {
    if (!imageToDelete) return;

    try {
      console.log("Menghapus file:", imageToDelete);

      // Hapus dari database
      const { data: dbData, error: dbError } = await supabaseClient
        .from("compressions")
        .delete()
        .eq("id", imageToDelete.id)
        .select();

      if (dbError) {
        console.error("Error database:", dbError);
        throw new Error(`Gagal menghapus dari database: ${dbError.message}`);
      }

      console.log("Data berhasil dihapus dari database:", dbData);

      // Hapus dari storage - coba beberapa kemungkinan path
      const storagePaths = [
        `public/${imageToDelete.fileName}`,
        // Jika file nama aslinya memiliki timestamp prefix
        ...Array.from(
          { length: 5 },
          (_, i) => `public/*_${imageToDelete.fileName}`
        ),
      ];

      console.log("Mencoba menghapus path storage:", storagePaths[0]);

      try {
        const { data: storageData, error: storageError } =
          await supabaseClient.storage
            .from("compressed-images")
            .remove([storagePaths[0]]);

        if (storageError) {
          console.warn(
            "File mungkin tidak terhapus dari storage:",
            storageError
          );
        } else {
          console.log("File berhasil dihapus dari storage:", storageData);
        }
      } catch (storageErr) {
        console.warn("Error saat menghapus file dari storage:", storageErr);
      }

      // Update UI
      setUserImages((images) =>
        images.filter((img) => img.id !== imageToDelete.id)
      );

      showToast("Gambar berhasil dihapus", "success");
    } catch (error) {
      console.error("Error penghapusan:", error);
      showToast(`Gagal menghapus gambar: ${error.message}`, "error");
    } finally {
      setShowDeleteModal(false);
      setImageToDelete(null);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">
          Silakan login terlebih dahulu
        </h1>
        <p className="mb-8">Anda perlu login untuk melihat dashboard</p>
        <Link href="/sign-in">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Anda</h1>
          <p className="text-gray-600 mt-1">
            Lihat riwayat kompresi dan statistik Anda
          </p>
        </div>
        <Link href="/compress">
          <Button className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Kembali ke Kompres
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userImages.length > 0 ? (
            userImages.map((image, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200"
              >
                <div className="p-4">
                  <div className="h-40 bg-gray-100 rounded flex items-center justify-center mb-4 overflow-hidden">
                    <ImageWithFallback src={image.url} alt={image.name} />
                  </div>
                  <div className="font-medium text-gray-800 mb-2">
                    {image.name}
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    Dikompresi pada{" "}
                    {new Date(image.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex justify-between">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => downloadImage(image.url, image.name)}
                    >
                      <Download className="h-4 w-4 mr-1" /> Download
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => confirmDelete(image.id, image.name)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <FileImage className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                Belum ada gambar terkompresi
              </h3>
              <p className="text-gray-500 mb-8">
                Mulai kompres gambar untuk melihatnya di sini
              </p>
              <Link href="/compress">
                <Button>Kompres Gambar Sekarang</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Konfirmasi Hapus
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus gambar ini? Tindakan ini tidak
              dapat dibatalkan.
            </p>

            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Batal
              </Button>
              <Button
                variant="secondary"
                className="bg-red-600 text-white hover:bg-red-700 border-red-600"
                onClick={handleDeleteImage}
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
