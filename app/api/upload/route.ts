import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const clientUserId = formData.get("userId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Verify user ID matches
    if (userId !== clientUserId) {
      return NextResponse.json({ error: "User ID mismatch" }, { status: 403 });
    }

    // Initialize Supabase with service role key (server-side only)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Format filename
    const sanitizedFileName = file.name.replace(/\s+/g, "_");
    const fileName = `${Date.now()}_${sanitizedFileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("compressed-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        path: data.path,
        fullFileName: fileName,
        fullPath: fileName,
      },
    });
  } catch (error) {
    console.error("API upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
