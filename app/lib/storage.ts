import { supabase, useSupabase, formatUserId } from "./supabase";
import { createClient } from "@supabase/supabase-js";

// Perbaikan untuk konsistensi penamaan file

export async function uploadCompressedImage(file: File, userId: string) {
  try {
    // Gunakan API route untuk upload (server-side dengan service role key)
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Upload failed");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Upload failed");
    }

    return result.data;
  } catch (error) {
    console.error("Error saat upload gambar:", error);
    throw error;
  }
}

export async function getUserImages(userId: string) {
  const client = useSupabase();
  if (!client) {
    console.warn("Supabase tidak diinisialisasi, tidak dapat mengambil gambar");
    return [];
  }

  try {
    // Ambil data dari tabel compressions
    const { data: compressions, error: dbError } = await client
      .from("compressions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (dbError) {
      console.error("Error database:", dbError);
      return [];
    }

    if (!compressions || compressions.length === 0) {
      return [];
    }

    console.log("Total compression records:", compressions.length);

    // Transform each record to include signed URL
    const imagesWithUrls = await Promise.all(
      compressions.map(async (record) => {
        try {
          // Sementara ambil dari root folder
          const fileName = record.file_name.replace(/\s+/g, "_");

          // Untuk bucket public, gunakan public URL
          const { data: urlData } = client.storage
            .from("compressed-images")
            .getPublicUrl(fileName);

          const imageUrl = urlData?.publicUrl || "";

          console.log("Public URL untuk", fileName, ":", imageUrl);

          return {
            id: record.id,
            name: record.file_name,
            url: imageUrl,
            size: record.compressed_size,
            original_size: record.original_size,
            compressed_size: record.compressed_size,
            compression_rate: record.compression_rate,
            created_at: record.created_at,
          };
        } catch (err) {
          console.error("Error saat mengambil URL:", err);
          return {
            id: record.id,
            name: record.file_name,
            url: "",
            size: record.compressed_size,
            original_size: record.original_size,
            compressed_size: record.compressed_size,
            compression_rate: record.compression_rate,
            created_at: record.created_at,
          };
        }
      })
    );

    console.log("Images with URLs processed:", imagesWithUrls.length);
    return imagesWithUrls;
  } catch (error) {
    console.error("Error saat mengambil gambar:", error);
    return [];
  }
}
