export function StatsSection() {
  return (
    <section id="stats" className="w-full py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">80%</div>
            <div className="text-gray-700">Average Size Reduction</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">5M+</div>
            <div className="text-gray-700">Images Compressed</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
            <div className="text-gray-700">Free Service</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">2s</div>
            <div className="text-gray-700">Average Processing Time</div>
          </div>
        </div>
      </div>
    </section>
  );
}
