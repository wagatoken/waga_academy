import { createServerClientInstance } from "@/server";

export async function GET(req: Request) {
    const supabase = await createServerClientInstance();
    console.log("Supabase client created"); 
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
  
    const userId = session.user.id;
  
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*, resource:resources(*)") // Load related resource data
      .eq("user_id", userId);
  
    if (error) {
      console.error("Error fetching bookmarks:", error); // Log the error for debugging
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
  
    return new Response(JSON.stringify(data), { status: 200 });
}
