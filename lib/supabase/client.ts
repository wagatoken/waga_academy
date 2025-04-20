import { createBrowserClient } from '@supabase/ssr'
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'

// Create a singleton instance for the browser client
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export const getSupabaseBrowserClient = () => {
  if(!supabaseClient){
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    // Ensure that Supabase URL and key are available
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase URL or Anon Key is missing. Check your environment variables.")
      throw new Error("Supabase configuration is incomplete. Check your environment variables.")
    }

    supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      cookieOptions: {
        name: 'sb-access-token', 
        domain: 'academy-waga.netlify.app', 
        path: '/', 
        sameSite: 'none', 
        secure: true, 
        maxAge: 60 * 60 * 24 * 7,
      },
    })
  }
  return supabaseClient
}

// Use this in middleware, server components, or API routes
export const createServerClient = (cookies: any) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // Ensure that Supabase URL and key are available
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing. Check your environment variables.")
    throw new Error("Supabase configuration is incomplete. Check your environment variables.")
  }

  return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies,
    cookieOptions: {
      name: 'sb-access-token', 
      domain: 'academy-waga.netlify.app',
      path: '/', 
      sameSite: 'none', 
      secure: true, 
      maxAge: 60 * 60 * 24 * 7,
    },
  })
}
