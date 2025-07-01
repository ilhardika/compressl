// Test koneksi Supabase dan setup bucket
import { useSupabase } from './supabase';

export async function testSupabaseConnection() {
  const client = useSupabase();
  
  if (!client) {
    return {
      success: false,
      error: 'Supabase client tidak diinisialisasi'
    };
  }

  try {
    // Test 1: List buckets
    const { data: buckets, error: bucketsError } = await client.storage.listBuckets();
    
    if (bucketsError) {
      return {
        success: false,
        error: `Error listing buckets: ${bucketsError.message}`
      };
    }

    // Test 2: Check compressed-images bucket
    const compressedBucket = buckets?.find(b => b.name === 'compressed-images');
    
    if (!compressedBucket) {
      // Try to create bucket
      const { data: newBucket, error: createError } = await client.storage.createBucket('compressed-images', {
        public: false,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 50 * 1024 * 1024 // 50MB
      });
      
      if (createError) {
        return {
          success: false,
          error: `Failed to create bucket: ${createError.message}`
        };
      }
      
      return {
        success: true,
        message: 'Bucket compressed-images created successfully',
        bucketsCount: buckets.length + 1
      };
    }

    // Test 3: Try to access table (if exists)
    const { data: tableTest, error: tableError } = await client
      .from('compressions')
      .select('count')
      .limit(1);

    const hasTable = !tableError || tableError.code !== '42P01';

    return {
      success: true,
      message: 'Connection successful',
      bucketsCount: buckets.length,
      hasCompressedBucket: true,
      hasTable,
      tableError: tableError?.message
    };

  } catch (error) {
    return {
      success: false,
      error: `Connection test failed: ${error}`
    };
  }
}
