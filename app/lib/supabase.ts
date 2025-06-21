import { createClient } from "@supabase/supabase-js";

let supabase = null;

try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseUrl.startsWith("https://") && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } else {
    console.error("Konfigurasi Supabase tidak valid");
  }
} catch (error) {
  console.error("Error saat inisialisasi Supabase:", error);
}

export { supabase };

// Helper function untuk menggunakan Supabase secara aman
export function useSupabase() {
  if (!supabase) {
    console.warn(
      "Supabase client tidak diinisialisasi - periksa environment variables"
    );
    return null;
  }
  return supabase;
}

// Format User ID untuk path storage
export function formatUserId(userId: string | null | undefined): string {
  if (!userId) return "anonymous";

  // Hapus karakter khusus yang mungkin menyebabkan masalah di path storage
  const formattedId = userId
    .replace(/[^a-zA-Z0-9_-]/g, "_") // Ganti karakter khusus dengan underscore
    .toLowerCase(); // Lowercase untuk konsistensi

  return formattedId;
}
