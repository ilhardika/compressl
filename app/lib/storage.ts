import { supabase, useSupabase, formatUserId } from "./supabase";

// Perbaikan untuk konsistensi penamaan file

export async function uploadCompressedImage(file: File, userId: string) {
  const client = useSupabase();
  if (!client) {
    console.warn("Supabase tidak diinisialisasi, gambar tidak diunggah");
    return null;
  }

  try {
    // Format nama file dengan timestamp dan hapus spasi
    const sanitizedFileName = file.name.replace(/\s+/g, "_");
    const fileName = `public/${Date.now()}_${sanitizedFileName}`;

    console.log("Mengunggah file ke path:", fileName);

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
      fullFileName: fileName.split("/").pop(), // Hanya nama file tanpa 'public/'
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
          // Format nama file untuk storage
          const fileName = `public/${record.file_name.replace(/\s+/g, "_")}`;

          // Untuk bucket privat, gunakan signed URL
          const { data: signedUrlData, error: signedUrlError } =
            await client.storage
              .from("compressed-images")
              .createSignedUrl(fileName, 60 * 60); // 1 jam

          const imageUrl = signedUrlData?.signedUrl || "";

          if (signedUrlError) {
            console.warn(
              "Error signed URL untuk",
              fileName,
              ":",
              signedUrlError
            );
          }

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
