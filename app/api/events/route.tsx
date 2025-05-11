import { getUpcomingEvents, getPastEvents, getPaginatedEvents } from "./actions";

export async function GET(req) {
  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  const limit = parseInt(url.searchParams.get("limit")) || 6;
  const page = parseInt(url.searchParams.get("page")) || 1;

  if (type === "upcoming") {
    const { data, error } = await getUpcomingEvents(limit);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    return new Response(JSON.stringify(data), { status: 200 });
  }

  if (type === "past") {
    const { data, error } = await getPastEvents(limit);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    return new Response(JSON.stringify(data), { status: 200 });
  }

  if (type === "all") {
    const { data, meta, error } = await getPaginatedEvents(page, limit);
    if (error) {
      return new Response(
        JSON.stringify({
          error: error.message
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        data,
        meta
      }),
      { status: 200 }
    );
  }

  return new Response(JSON.stringify({ error: "Invalid type parameter" }), { status: 400 });
}
