-- Schema untuk aplikasi Compressly
-- Copy dan paste script ini ke Supabase SQL Editor: https://supabase.com/dashboard/project/cxpawjjlfvfvdkgabmrc/sql/new

-- 1. Buat tabel compressions untuk menyimpan data kompresi gambar
CREATE TABLE IF NOT EXISTS compressions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    original_size BIGINT NOT NULL,
    compressed_size BIGINT NOT NULL,
    compression_rate DECIMAL(5,2) NOT NULL,
    file_name TEXT NOT NULL,
    image_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Buat index untuk performa query yang lebih baik
CREATE INDEX IF NOT EXISTS idx_compressions_user_id ON compressions(user_id);
CREATE INDEX IF NOT EXISTS idx_compressions_created_at ON compressions(created_at DESC);

-- 3. Enable Row Level Security (RLS) - Opsional untuk keamanan ekstra
-- ALTER TABLE compressions ENABLE ROW LEVEL SECURITY;

-- 4. Storage policies untuk bucket compressed-images
-- Policy untuk upload file (user hanya bisa upload ke folder mereka sendiri)
CREATE POLICY "Users can upload to own folder" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'compressed-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy untuk download file (user hanya bisa download file mereka sendiri)
CREATE POLICY "Users can view own files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'compressed-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy untuk delete file (user hanya bisa delete file mereka sendiri)
CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'compressed-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
