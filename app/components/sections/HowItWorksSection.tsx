import { Upload, Settings, Download } from "lucide-react";
import { StepCard } from "../ui/StepCard";

export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      icon: <Upload size={32} />,
      title: "Upload Your Images",
      description:
        "Drag and drop your files or select them from your device. We support JPG, PNG, WebP, and SVG formats.",
    },
    {
      number: 2,
      icon: <Settings size={32} />,
      title: "Adjust Settings (Optional)",
      description:
        "Choose your preferred compression level or use our smart default settings for optimal results.",
    },
    {
      number: 3,
      icon: <Download size={32} />,
      title: "Download Compressed Files",
      description:
        "Save your optimized images individually or as a batch ZIP file. See the size reduction immediately.",
    },
  ];

  return (
    <section id="how-it-works" className="w-full py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            How It Works
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Three simple steps to optimize your images in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              number={step.number}
              icon={step.icon}
              title={step.title}
              description={step.description}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
