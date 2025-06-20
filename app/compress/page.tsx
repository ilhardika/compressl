import MultiCompressComponent from "./MultiCompressComponent";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CompressPage() {
  return (
    <div className="py-8 px-4 max-w-6xl mx-auto bg-white min-h-screen">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Beranda
        </Link>
        <h1 className="text-3xl font-bold mt-4 text-gray-900">
          Compress Image
        </h1>
        <p className="text-gray-700 mt-2 text-lg">
          Kompres gambar Anda dengan cepat dan mudah tanpa mengorbankan
          kualitas.
        </p>
      </div>

      {/* Card container with white background and shadow */}
      <MultiCompressComponent />
    </div>
  );
}
