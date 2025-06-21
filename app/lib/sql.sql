-- Create the compressions table to track image compression history
CREATE TABLE IF NOT EXISTS public.compressions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    original_size BIGINT NOT NULL,
    compressed_size BIGINT NOT NULL,
    compression_rate FLOAT NOT NULL,
    file_name TEXT NOT NULL,
    image_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comment to the table
COMMENT ON TABLE public.compressions IS 'Stores image compression history and statistics';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS compressions_user_id_idx ON public.compressions (user_id);
CREATE INDEX IF NOT EXISTS compressions_created_at_idx ON public.compressions (created_at);

-- Create RLS (Row Level Security) policies to secure the data
ALTER TABLE public.compressions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid errors on re-run
DROP POLICY IF EXISTS "Users can insert their own compression data" ON public.compressions;
DROP POLICY IF EXISTS "Users can view their own compression data" ON public.compressions;
DROP POLICY IF EXISTS "Users can update their own compression data" ON public.compressions;
DROP POLICY IF EXISTS "Users can delete their own compression data" ON public.compressions;

-- Create new policies
CREATE POLICY "Users can insert their own compression data" ON public.compressions
    FOR INSERT WITH CHECK (true);  -- Allow all authenticated users to insert

CREATE POLICY "Users can view their own compression data" ON public.compressions
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own compression data" ON public.compressions
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own compression data" ON public.compressions
    FOR DELETE USING (auth.uid()::text = user_id);

-- NOTE: You must create the storage bucket manually first from the Supabase dashboard
-- AFTER creating the bucket "compressed-images", you can run the following SQL to set up policies

-- Storage policies for compressed-images bucket
-- These will only work AFTER you've manually created the bucket through the UI

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Allow users to upload to their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to download from their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete from their own folder" ON storage.objects;

-- Create new storage policies
CREATE POLICY "Allow users to upload to their own folder"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'compressed-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow users to download from their own folder"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'compressed-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow users to delete from their own folder"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'compressed-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Temporary open policy for testing
CREATE POLICY "Allow all inserts"
ON public.compressions
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all selects" 
ON public.compressions
FOR SELECT USING (true);

-- Tambahkan di bagian bawah file

-- TEMPORARY: Completely open storage policy for testing
DROP POLICY IF EXISTS "Allow all operations on storage" ON storage.objects;
CREATE POLICY "Allow all operations on storage" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'compressed-images')
WITH CHECK (bucket_id = 'compressed-images');

-- IMPORTANT: Ini hanya untuk testing, jangan gunakan di production!

-- Disable RLS untuk testing
ALTER TABLE public.compressions DISABLE ROW LEVEL SECURITY;

-- Set bucket policy yang sangat terbuka (hanya untuk testing)
DROP POLICY IF EXISTS "Allow all bucket operations" ON storage.objects;
CREATE POLICY "Allow all bucket operations" 
ON storage.objects 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Aktifkan kembali RLS untuk keamanan
ALTER TABLE public.compressions ENABLE ROW LEVEL SECURITY;

-- Hapus policy terbuka yang digunakan untuk testing
DROP POLICY IF EXISTS "Allow all bucket operations" ON storage.objects;

-- Buat storage policy yang aman tapi fleksibel
CREATE POLICY "Allow authenticated users to use bucket"
ON storage.objects
FOR ALL
USING (bucket_id = 'compressed-images')
WITH CHECK (bucket_id = 'compressed-images' AND auth.role() = 'authenticated');

-- Create public folder policy yang lebih fleksibel
CREATE POLICY "Allow public folder access" 
ON storage.objects 
FOR SELECT
USING (
  bucket_id = 'compressed-images' AND 
  (storage.foldername(name))[1] = 'public'
);

-- Update database policy
DROP POLICY IF EXISTS "Allow all inserts" ON public.compressions;
DROP POLICY IF EXISTS "Allow all selects" ON public.compressions;

-- Buat policy yang lebih tepat
CREATE POLICY "Users can view own and public compressions" 
ON public.compressions
FOR SELECT 
USING (true); -- Semua user dapat melihat data

CREATE POLICY "Users can insert their own compression data" 
ON public.compressions
FOR INSERT 
WITH CHECK (true); -- Semua user dapat memasukkan data

-- Pastikan Row Level Security diaktifkan
ALTER TABLE public.compressions ENABLE ROW LEVEL SECURITY;

-- Hapus policy lama jika ada
DROP POLICY IF EXISTS "Allow all operations on storage" ON storage.objects;
DROP POLICY IF EXISTS "Allow all bucket operations" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to use bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public folder access" ON storage.objects;

-- Buat policy baru yang lebih permisif untuk bucket
CREATE POLICY "Allow authenticated users all operations" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'compressed-images' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'compressed-images' AND auth.role() = 'authenticated');

-- Buat policy untuk folder public - PERBAIKAN SINTAKS
CREATE POLICY "Allow public folder access" 
ON storage.objects 
FOR SELECT
USING (
  bucket_id = 'compressed-images' AND 
  position('public/' in name) = 1
);

-- Perbarui policy database
CREATE POLICY "Database access for authenticated" 
ON public.compressions
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Reset semua policy yang mungkin bertentangan

-- 1. Reset semua database policy
DROP POLICY IF EXISTS "Users can insert their own compression data" ON public.compressions;
DROP POLICY IF EXISTS "Users can view their own compression data" ON public.compressions;
DROP POLICY IF EXISTS "Users can update their own compression data" ON public.compressions;
DROP POLICY IF EXISTS "Users can delete their own compression data" ON public.compressions;
DROP POLICY IF EXISTS "Allow all inserts" ON public.compressions;
DROP POLICY IF EXISTS "Allow all selects" ON public.compressions;
DROP POLICY IF EXISTS "Users can view own and public compressions" ON public.compressions;
DROP POLICY IF EXISTS "Database access for authenticated" ON public.compressions;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.compressions;

-- 2. Reset semua storage policy
DROP POLICY IF EXISTS "Allow users to upload to their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to download from their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete from their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Allow all operations on storage" ON storage.objects;
DROP POLICY IF EXISTS "Allow all bucket operations" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to use bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public folder access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users all operations" ON storage.objects;
DROP POLICY IF EXISTS "Allow all storage operations for authenticated users" ON storage.objects;

-- 3. Aktifkan RLS (Row Level Security)
ALTER TABLE public.compressions ENABLE ROW LEVEL SECURITY;

-- 4. Buat policy baru yang sederhana dan permisif
-- Policy database
CREATE POLICY "Allow all operations for authenticated users" 
ON public.compressions
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Policy storage
CREATE POLICY "Allow all storage operations for authenticated users"
ON storage.objects
FOR ALL
USING (bucket_id = 'compressed-images')
WITH CHECK (bucket_id = 'compressed-images');