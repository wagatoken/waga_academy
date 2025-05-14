import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createServerClientInstance = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are not set.");
  }

  // Await cookies() to retrieve all cookies
  const cookieStore = await cookies();

  const cookieMethods = {
    getAll: async () => cookieStore.getAll(), // Retrieve all cookies asynchronously
    setAll: async (newCookies: { name: string; value: string }[]) => {
      for (const { name, value } of newCookies) {
        await cookieStore.set(name, value); // Set cookies asynchronously
      }
    },
  };

  return createServerClient(supabaseUrl, supabaseKey, { cookies: cookieMethods });
};
