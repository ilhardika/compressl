import { supabase, useSupabase } from "./supabase";

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
    console.warn("Supabase not initialized, compression not recorded");
    return false;
  }

  const { error } = await client.from("compressions").insert(data);

  if (error) {
    console.error("Error recording compression:", error);
    throw new Error(`Error recording compression: ${error.message}`);
  }

  return true;
}

export async function getUserStats(userId: string) {
  const client = useSupabase();
  if (!client) {
    console.warn("Supabase not initialized, cannot fetch stats");
    return [];
  }

  const { data, error } = await client
    .from("compressions")
    .select("*")
    .eq("userId", userId);

  if (error) {
    console.error("Error fetching stats:", error);
    throw new Error(`Error fetching stats: ${error.message}`);
  }

  return data || [];
}
