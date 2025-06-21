"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { getUserImages } from "../lib/storage";
import { getUserStats } from "../lib/analytics";
import Link from "next/link";
import { ArrowLeft, FileImage, Download, Trash2 } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function DashboardPage() {
  const { userId, isSignedIn } = useAuth();
  const [userImages, setUserImages] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      if (!userId) return;

      try {
        setLoading(true);
        const [images, userStats] = await Promise.all([
          getUserImages(userId),
          getUserStats(userId),
        ]);

        setUserImages(images);
        setStats(userStats);
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isSignedIn) {
      loadUserData();
    }
  }, [userId, isSignedIn]);

  if (!isSignedIn) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Please sign in</h1>
        <p className="mb-8">You need to be signed in to view your dashboard</p>
        <Link href="/sign-in">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold mt-4 text-gray-900">
          Your Compression History
        </h1>
        <p className="text-gray-700 mt-2">
          View and manage your previously compressed images
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* This is a placeholder for the actual image cards you would display */}
          {userImages.length > 0 ? (
            userImages.map((image, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200"
              >
                <div className="p-4">
                  <div className="h-40 bg-gray-100 rounded flex items-center justify-center mb-4">
                    <FileImage className="h-16 w-16 text-gray-400" />
                  </div>
                  <div className="font-medium text-gray-800 mb-2">
                    {image.name}
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    Compressed on{" "}
                    {new Date(image.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex justify-between">
                    <Button size="sm" variant="secondary">
                      <Download className="h-4 w-4 mr-1" /> Download
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <FileImage className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No compressed images yet
              </h3>
              <p className="text-gray-500 mb-8">
                Start compressing images to see them here
              </p>
              <Link href="/compress">
                <Button>Compress Images Now</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
