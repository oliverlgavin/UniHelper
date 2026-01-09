import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET - Fetch all user modules
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("learning_modules")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Transform snake_case to camelCase for frontend
    const transformedModules = data?.map((module: Record<string, unknown>) => ({
      ...module,
      learningPlan: module.learning_plan,
      learning_plan: undefined,
    })) || [];

    return NextResponse.json({ modules: transformedModules });
  } catch (error) {
    console.error("Error fetching modules:", error);
    return NextResponse.json(
      { error: "Failed to fetch modules" },
      { status: 500 }
    );
  }
}

// POST - Create new module
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, summary, learningPlan, quiz, original_filename, file_type } = body;

    if (!title || !summary || !learningPlan || !quiz || !original_filename) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("learning_modules")
      .insert({
        user_id: user.id,
        title,
        summary,
        learning_plan: learningPlan,
        quiz,
        original_filename,
        file_type: file_type || "application/pdf",
      })
      .select()
      .single();

    if (error) throw error;

    // Also log to upload_history
    await supabase.from("upload_history").insert({
      user_id: user.id,
      module_id: data.id,
      filename: original_filename,
      file_type: file_type || "application/pdf",
      file_size: 0, // Can be passed from frontend if needed
      status: "completed",
    });

    // Transform snake_case to camelCase for frontend
    const transformedModule = {
      ...data,
      learningPlan: data.learning_plan,
      learning_plan: undefined,
    };

    return NextResponse.json({ module: transformedModule });
  } catch (error) {
    console.error("Error creating module:", error);
    return NextResponse.json(
      { error: "Failed to create module" },
      { status: 500 }
    );
  }
}
