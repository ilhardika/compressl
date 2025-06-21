import { useSupabase } from "./supabase";

export async function recordCompression(data: {
  userId: string;
  originalSize: number;
  compressedSize: number;
  compressionRate: number;
  fileName: string;
  imageType: string;
}) {
  const client = useSupabase();
  if (!client) {
    console.warn("Supabase tidak diinisialisasi, kompresi tidak dicatat");
    return { data: null, error: new Error("Supabase tidak diinisialisasi") };
  }

  try {
    console.log("Mencoba menyimpan data kompresi:", data);

    // Map property names to match database column names
    const dbRecord = {
      user_id: data.userId,
      original_size: data.originalSize,
      compressed_size: data.compressedSize,
      compression_rate: data.compressionRate,
      file_name: data.fileName,
      image_type: data.imageType,
    };

    // Tambahkan log untuk memastikan data yang dimasukkan
    console.log("Record yang akan dimasukkan:", dbRecord);

    const { data: result, error } = await client
      .from("compressions")
      .insert(dbRecord);

    if (error) {
      console.error("Error saat menyisipkan data:", error);
      return { data: null, error };
    }

    return { data: result, error: null };
  } catch (error) {
    console.error("Exception saat menyimpan data:", error);
    return { data: null, error };
  }
}

export async function getUserStats(userId: string) {
  const client = useSupabase();
  if (!client) {
    console.warn(
      "Supabase tidak diinisialisasi, tidak dapat mengambil statistik"
    );
    return [];
  }

  try {
    // Gunakan nama kolom yang benar (user_id)
    const { data, error } = await client
      .from("compressions")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Error mengambil statistik: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error("Error saat mengambil statistik:", error);
    return [];
  }
}
