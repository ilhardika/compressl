import { Upload, FileImage } from "lucide-react";
import { Button } from "../ui/Button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section
      id="feature"
      className="w-full py-20 md:py-32 bg-gradient-to-br from-blue-50 to-white"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-600 tracking-tight mb-6">
            <span className="text-blue-400">Simplify</span> your images
            <br />
            <span className="text-gray-800">without sacrificing quality</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Reduce file sizes by up to 80% while preserving visual quality.
            Fast, secure, and completely free.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/compress" className="w-full sm:w-auto">
              <Button variant="primary">
                <Upload size={20} className="mr-2" />
                Start Compressing
              </Button>
            </Link>
            <Button href="#features" variant="secondary">
              Learn More
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md h-80 md:h-96">
            <div className="absolute top-0 right-0 w-4/5 h-4/5 bg-white rounded-lg shadow-2xl p-4 z-10 border border-gray-100">
              <div className="w-full h-3/4 bg-gray-200 rounded mb-3 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600">
                  <FileImage size={60} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500">
                  image_compressed.jpg
                </div>
                <div className="text-xs text-green-600 font-semibold">
                  480 KB
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-4/5 h-4/5 bg-white rounded-lg shadow-2xl p-4 border border-gray-100">
              <div className="w-full h-3/4 bg-gray-200 rounded mb-3 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600">
                  <FileImage size={60} />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500">
                  image.jpg
                </div>
                <div className="text-xs text-blue-600 font-semibold">
                  2.4 MB
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
