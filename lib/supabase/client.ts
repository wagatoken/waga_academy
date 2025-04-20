import { createBrowserClient } from '@supabase/ssr'
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'

// Create a singleton instance for the browser client
let supabaseClient: ReturnType<typeof createClient> | null = null

export const getSupabaseBrowserClient = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    if (!supabaseUrl || !supabaseAnonKey) {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase URL or Anon Key is missing. Check your environment variables.")
      throw new Error("Supabase configuration is incomplete. Check your environment variables.")
    }

    // Removed cookies config here
    supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }

  return supabaseClient
}

// Add the missing export that's being referenced elsewhere
export const createServerClient = (cookies: any) => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing. Check your environment variables.")
    throw new Error("Supabase configuration is incomplete. Check your environment variables.")
  }

  // For server-side, you can still pass cookies if needed
  return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, { cookies })
}
