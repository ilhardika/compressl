import { Upload } from "lucide-react";
import { Button } from "../ui/Button";

export function CTASection() {
  return (
    <section id="cta" className="w-full py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 shadow-xl">
          <div className="text-center text-white max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to optimize your images?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of professionals who trust Compressly for their
              image optimization needs.
            </p>
            <Button href="/compress" variant="white">
              <Upload size={20} className="mr-2" />
              Start for Free — No Signup Required
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
