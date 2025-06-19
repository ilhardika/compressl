import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Clock } from "lucide-react";

export default async function HistoryPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Compression History
          </h1>
          <p className="text-gray-600">
            View and download your previously compressed images
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center py-12">
            <div className="mb-4 text-gray-400">
              <Clock className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-600">No compression history yet</p>
          </div>
        </div>
      </div>
    </main>
  );
}
