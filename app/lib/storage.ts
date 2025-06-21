import { supabase, useSupabase } from "./supabase";

export async function uploadCompressedImage(file: File, userId: string) {
  const client = useSupabase();
  if (!client) {
    console.warn("Supabase not initialized, image not uploaded");
    return null;
  }

  const fileName = `${userId}/${Date.now()}_${file.name}`;

  const { data, error } = await client.storage
    .from("compressed-images")
    .upload(fileName, file);

  if (error) {
    console.error("Error uploading file:", error);
    throw new Error(`Error uploading file: ${error.message}`);
  }

  return data?.path;
}

export async function getUserImages(userId: string) {
  const client = useSupabase();
  if (!client) {
    console.warn("Supabase not initialized, cannot fetch images");
    return [];
  }

  const { data, error } = await client.storage
    .from("compressed-images")
    .list(userId);

  if (error) {
    console.error("Error fetching images:", error);
    throw new Error(`Error fetching images: ${error.message}`);
  }

  return data || [];
}

export async function deleteImage(path: string) {
  const client = useSupabase();
  if (!client) {
    console.warn("Supabase not initialized, cannot delete image");
    return false;
  }

  const { error } = await client.storage
    .from("compressed-images")
    .remove([path]);

  if (error) {
    throw new Error(`Error deleting image: ${error.message}`);
  }

  return true;
}
