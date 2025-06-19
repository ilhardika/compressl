import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { FileImage, Clock, Settings } from "lucide-react";
import { Button } from "@/app/components/ui/Button";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user.firstName || "User"}!
          </h1>
          <p className="text-gray-600">
            Manage your image compression tasks and history
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FileImage className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">0</h2>
            </div>
            <p className="text-gray-600">Total Compressed Images</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">0 MB</h2>
            </div>
            <p className="text-gray-600">Total Storage Saved</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Free</h2>
            </div>
            <p className="text-gray-600">Current Plan</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Recent Activity
          </h2>

          <div className="text-center py-12">
            <div className="mb-4 text-gray-400">
              <FileImage className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-600 mb-4">
              You haven't compressed any images yet
            </p>
            <Button href="/compress" variant="primary">
              Start Compressing
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
