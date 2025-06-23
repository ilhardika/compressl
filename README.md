# Compressly

Compressly adalah aplikasi web modern untuk kompresi gambar berbasis [Next.js](https://nextjs.org) dan [Supabase](https://supabase.com).  
Aplikasi ini memungkinkan pengguna mengompres gambar secara massal, mengunduh hasilnya, serta menyimpan riwayat kompresi ke dashboard pribadi.

---

## ✨ Fitur Utama

- **Kompresi Gambar Massal**: Upload banyak gambar sekaligus, kompres otomatis, dan download hasilnya.
- **Batas Ukuran Otomatis**: Setiap gambar hasil kompresi otomatis dibatasi maksimal 1MB.
- **Dashboard Pribadi**: Simpan hasil kompresi ke dashboard, lihat riwayat, dan download ulang kapan saja.
- **Dukungan Format Populer**: JPG, PNG, WebP, dsb.
- **Login & Keamanan**: Otentikasi menggunakan Clerk, penyimpanan aman di Supabase Storage.
- **UI Modern & Responsif**: Menggunakan Tailwind CSS dan komponen custom.

---

## 🚀 Cara Menjalankan Project

1. **Clone repository ini**

   ```bash
   git clone <repo-url>
   cd compressly
   ```

2. **Install dependencies**

   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Buat file environment**

   ```
   cp .env.example .env.local
   ```

   Lalu isi variabel Supabase dan Clerk sesuai kebutuhan.

4. **Jalankan development server**

   ```bash
   npm run dev
   # atau
   yarn dev
   ```

5. **Akses di browser**
   ```
   http://localhost:3000
   ```

---

## ⚙️ Konfigurasi Environment

Buat file `.env.local` dan isi dengan:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

---

## 🗂️ Struktur Folder Penting

```
app/
  compress/           # Halaman & komponen kompresi gambar
  dashboard/          # Halaman dashboard user
  components/         # Komponen UI reusable
  lib/                # Logic Supabase, analytics, utils
  sign-in/, sign-up/  # Halaman otentikasi
```

---

## 📝 Catatan Pengembangan

- Kompresi gambar menggunakan [browser-image-compression](https://www.npmjs.com/package/browser-image-compression).
- Semua gambar hasil kompresi otomatis dibatasi maksimal 1MB (`maxSizeMB: 1`).
- Untuk produksi, pastikan policy Supabase Storage dan RLS sudah aman.
- Untuk pengembangan, bucket bisa di-set public agar testing lebih mudah.

---

## 📦 Deploy

Deploy mudah ke [Vercel](https://vercel.com/) atau platform Next.js lain.  
Pastikan environment variable sudah diatur di dashboard hosting.

---

## 🙏 Kontribusi

Pull request, issue, dan feedback sangat diterima!  
Silakan fork repo ini dan buat PR untuk fitur/bugfix.

---
