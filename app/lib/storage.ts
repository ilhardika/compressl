import { supabase, useSupabase, formatUserId } from "./supabase";
import { createClient } from "@supabase/supabase-js";

// Perbaikan untuk konsistensi penamaan file

export async function uploadCompressedImage(file: File, userId: string) {
  // Gunakan service role key untuk upload (bypass RLS)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4cGF3ampsZnZmdmRrZ2FibXJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTM4Njk4MCwiZXhwIjoyMDY2OTYyOTgwfQ.raX9PuvL7tAj-gYUoV2Br3XRTs65UjyA5MerbJkM9mk";

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn("Supabase config missing");
    return null;
  }

  const client = createClient(supabaseUrl, serviceRoleKey);

  try {
    // Format nama file dengan timestamp dan hapus spasi
    const sanitizedFileName = file.name.replace(/\s+/g, "_");
    const fileName = `${Date.now()}_${sanitizedFileName}`;

    const { data, error } = await client.storage
      .from("compressed-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      throw new Error(`Error mengunggah file: ${error.message}`);
    }

    // PENTING: Simpan nama file lengkap (dengan timestamp) ke database
    // agar mudah diambil kembali
    return {
      path: data?.path,
      fullFileName: fileName, // Nama file lengkap
      fullPath: fileName, // Path lengkap
    };
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
