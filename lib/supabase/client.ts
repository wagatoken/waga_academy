import { createBrowserClient } from '@supabase/ssr'
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'

// Create a singleton instance for the browser client
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

// Only used in production — assumed this file is only used in production environment

export const getSupabaseBrowserClient = () => {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase URL or Anon Key is missing. Check your environment variables.")
      throw new Error("Supabase configuration is incomplete. Check your environment variables.")
    }

    supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        name: 'sb-access-token',
        path: '/',
        sameSite: 'Lax',
        secure: true,
        domain: '.academy-waga.netlify.app', 
      },
    })
  }

  return supabaseClient
}

// Use this in middleware, server components, or API routes
export const createServerClient = (cookies: any) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing. Check your environment variables.")
    throw new Error("Supabase configuration is incomplete. Check your environment variables.")
  }

  return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies,
  })
}
