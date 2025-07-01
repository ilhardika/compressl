# Database & Storage Library

Folder ini berisi semua file yang berhubungan dengan database dan storage untuk aplikasi Compressly.

## 📁 File Structure

### Core Files
- **`supabase.ts`** - Konfigurasi client Supabase dan helper functions
- **`analytics.ts`** - Functions untuk menyimpan dan mengambil data kompresi
- **`storage.ts`** - Functions untuk upload dan download gambar
- **`utils.ts`** - Utility functions umum

### Database
- **`database-schema.sql`** - SQL script untuk membuat tabel database
- **`debug-supabase.ts`** - Debug functions untuk troubleshooting
- **`test-connection.ts`** - Test functions untuk verifikasi koneksi

## 🚀 Setup Database

1. Buka [Supabase SQL Editor](https://supabase.com/dashboard/project/cxpawjjlfvfvdkgabmrc/sql/new)
2. Copy isi file `database-schema.sql`
3. Paste dan jalankan SQL script

## 📊 Database Schema

### Table: `compressions`
```sql
- id: UUID (Primary Key)
- user_id: TEXT (Clerk User ID)
- original_size: BIGINT (bytes)
- compressed_size: BIGINT (bytes)
- compression_rate: DECIMAL(5,2) (percentage)
- file_name: TEXT
- image_type: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Storage Bucket: `compressed-images`
- Private bucket
- Max file size: 50MB
- Allowed types: JPEG, PNG, WebP, GIF

## 🔧 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://cxpawjjlfvfvdkgabmrc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
