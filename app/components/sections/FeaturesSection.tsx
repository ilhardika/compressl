import { FileImage, Globe, Zap } from "lucide-react";
import { FeatureCard } from "../ui/FeatureCard";

export function FeaturesSection() {
  const features = [
    {
      icon: <Zap size={28} className="text-blue-600" />,
      title: "Lightning Fast",
      description:
        "Advanced algorithms process your images in seconds, no matter how many you upload.",
    },
    {
      icon: <FileImage size={28} className="text-blue-600" />,
      title: "Quality Preserved",
      description:
        "Smart compression technology that maintains visual quality while significantly reducing file size.",
    },
    {
      icon: <Globe size={28} className="text-blue-600" />,
      title: "Web Optimized",
      description:
        "Get perfectly optimized images for websites and apps, improving load times and user experience.",
    },
  ];

  return (
    <section id="features" className="w-full py-20 bg-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Why Choose Compressly?
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Our advanced compression algorithms provide the perfect balance
            between file size and image quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
