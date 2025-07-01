# 🖼️ Compressly

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-Storage-green?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Clerk-Auth-purple?style=for-the-badge&logo=clerk" alt="Clerk" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-cyan?style=for-the-badge&logo=tailwindcss" alt="Tailwind" />
</div>

<br />

<div align="center">
  <h3>🚀 Modern Image Compression Tool</h3>
  <p>Aplikasi web modern untuk kompresi gambar berbasis Next.js dan Supabase.<br />
  Kompres gambar secara massal, simpan ke dashboard pribadi, dan download kapan saja.</p>
</div>

---

## ✨ Fitur Utama

🔥 **Kompresi Gambar Massal** - Upload banyak gambar sekaligus dan kompres otomatis
📏 **Optimasi Ukuran Cerdas** - Setiap gambar hasil kompresi dibatasi maksimal 1MB
📊 **Dashboard Pribadi** - Simpan riwayat kompresi dan download ulang kapan saja
🎨 **Multi Format Support** - JPG, PNG, WebP, dan format populer lainnya
🔐 **Keamanan Terjamin** - Autentikasi Clerk + penyimpanan aman Supabase Storage
📱 **UI Modern & Responsif** - Desain clean dengan Tailwind CSS

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm atau yarn
- Akun [Clerk](https://clerk.com/) untuk authentication
- Akun [Supabase](https://supabase.com/) untuk database & storage

### Installation

1. **Clone repository**

   ```bash
   git clone https://github.com/yourusername/compressly.git
   cd compressly
   ```

2. **Install dependencies**

   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.example .env
   ```

   Isi file `.env` dengan konfigurasi Anda:

   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   CLERK_SECRET_KEY=sk_test_your_secret_here

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

4. **Setup database**

   Jalankan SQL script di Supabase SQL Editor:

   ```bash
   # Copy isi file app/lib/database-schema.sql
   # Paste dan jalankan di: https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new
   ```

5. **Jalankan development server**

   ```bash
   npm run dev
   ```

6. **Buka aplikasi**

   Akses [http://localhost:3000](http://localhost:3000) di browser Anda

---

## 🛠️ Tech Stack

| Category             | Technology                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| **Framework**        | [Next.js 15](https://nextjs.org/) (App Router)                                                   |
| **Language**         | [TypeScript](https://www.typescriptlang.org/)                                                    |
| **Styling**          | [Tailwind CSS](https://tailwindcss.com/)                                                         |
| **Authentication**   | [Clerk](https://clerk.com/)                                                                      |
| **Database**         | [Supabase](https://supabase.com/) (PostgreSQL)                                                   |
| **Storage**          | [Supabase Storage](https://supabase.com/storage)                                                 |
| **Image Processing** | [browser-image-compression](https://www.npmjs.com/package/browser-image-compression)             |
| **Icons**            | [Lucide React](https://lucide.dev/)                                                              |
| **File Handling**    | [JSZip](https://stuk.github.io/jszip/), [FileSaver.js](https://github.com/eligrey/FileSaver.js/) |

---

## 🗂️ Project Structure

```
compressly/
├── app/
│   ├── api/                    # API routes
│   │   └── upload/            # Upload endpoint
│   ├── components/            # Reusable UI components
│   │   ├── layout/           # Header, Footer
│   │   ├── sections/         # Landing page sections
│   │   └── ui/               # Base UI components
│   ├── compress/             # Image compression page
│   ├── dashboard/            # User dashboard
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Core utilities & database
│   │   ├── analytics.ts      # Compression analytics
│   │   ├── storage.ts        # File upload/download
│   │   ├── supabase.ts       # Database client
│   │   └── database-schema.sql
│   ├── sign-in/              # Authentication pages
│   ├── sign-up/
│   ├── types/                # TypeScript definitions
│   └── globals.css           # Global styles
├── public/                   # Static assets
└── ...config files
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
