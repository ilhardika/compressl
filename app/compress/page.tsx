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
      </div>

      {/* Card container with white background and shadow */}
      <MultiCompressComponent />
    </div>
  );
}
