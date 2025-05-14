import { createServerClientInstance } from "@/server";


export async function POST(req: Request) {
  const { resourceId } = await req.json();

  if (!resourceId) {
    return new Response(JSON.stringify({ error: "Resource ID is required" }), {
      status: 400,
    });
  }

  const supabase = await createServerClientInstance();

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
    .insert({ user_id: userId, resource_id: resourceId });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data), { status: 201 });
}

export async function DELETE(req: Request) {
  const { resourceId } = await req.json();

  if (!resourceId) {
    return new Response(JSON.stringify({ error: "Resource ID is required" }), {
      status: 400,
    });
  }

  const supabase = await createServerClientInstance();

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

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", userId)
    .eq("resource_id", resourceId);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ message: "Bookmark removed" }), {
    status: 200,
  });
}

