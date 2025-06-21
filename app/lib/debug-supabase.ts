import { useSupabase } from "./supabase";

export async function diagnoseSupabase() {
  const client = useSupabase();
  if (!client) {
    console.error("❌ DEBUG - Supabase client not initialized");
    return {
      success: false,
      error: "Client not initialized",
    };
  }

  try {
    // 1. Test connection dengan cara yang lebih reliable
    // Coba pilih 'now()' sebagai pengganti 'version'
    const { data: connectionTest, error: connectionError } = await client
      .from("compressions")
      .select("count") // Ganti count(*) dengan count
      .limit(1);

    if (connectionError) {
      console.error("❌ DEBUG - Connection error:", connectionError);
      return {
        success: false,
        error: connectionError,
      };
    }
    console.log("✅ DEBUG - Supabase connection successful");

    // 2. List buckets
    const { data: buckets, error: bucketsError } =
      await client.storage.listBuckets();
    if (bucketsError) {
      console.error("❌ DEBUG - Cannot list buckets:", bucketsError);
      return {
        success: false,
        error: bucketsError,
      };
    }

    console.log("✅ DEBUG - Found buckets:", buckets?.length || 0);

    // 3. Check if compressed-images bucket exists
    const compressedBucket = buckets?.find(
      (b) => b.name === "compressed-images"
    );

    if (!compressedBucket) {
      console.log(
        "ℹ️ DEBUG - compressed-images bucket not found, trying to create it"
      );

      try {
        // Try to create bucket
        const { data: newBucket, error: createError } =
          await client.storage.createBucket("compressed-images", {
            public: false,
          });

        if (createError) {
          console.error("❌ DEBUG - Failed to create bucket:", createError);
          // Even if bucket creation fails, continue testing
        } else {
          console.log("✅ DEBUG - Created compressed-images bucket");
        }
      } catch (bucketError) {
        console.error("❌ DEBUG - Bucket creation exception:", bucketError);
      }
    } else {
      console.log("✅ DEBUG - compressed-images bucket exists");

      // 4. Try to list files in bucket for further diagnosis
      try {
        const { data: files, error: filesError } = await client.storage
          .from("compressed-images")
          .list();

        if (filesError) {
          console.error("❌ DEBUG - Cannot list files:", filesError);
        } else {
          console.log(
            "✅ DEBUG - Bucket listing successful, files:",
            files?.length || 0
          );
        }
      } catch (listError) {
        console.error("❌ DEBUG - Bucket listing exception:", listError);
      }
    }

    // 5. Try a simple upload as test
    try {
      console.log("🔍 DEBUG - Testing upload capability...");

      // Create a small test file (1x1 pixel transparent PNG)
      const base64Data =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const testFile = new File([byteArray], "test-pixel.png", {
        type: "image/png",
      });

      // Try uploading to the 'test' folder
      const { data: uploadData, error: uploadError } = await client.storage
        .from("compressed-images")
        .upload("test/diagnostic-test.png", testFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("❌ DEBUG - Upload test failed:", uploadError);
      } else {
        console.log("✅ DEBUG - Upload test successful:", uploadData);
      }
    } catch (uploadError) {
      console.error("❌ DEBUG - Upload test exception:", uploadError);
    }

    return {
      success: true,
      bucketsCount: buckets?.length || 0,
      hasCompressedBucket: !!compressedBucket,
    };
  } catch (error) {
    console.error("❌ DEBUG - Unhandled error:", error);
    return {
      success: false,
      error,
    };
  }
}
