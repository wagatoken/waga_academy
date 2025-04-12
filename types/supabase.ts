export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      camp_registrations: {
        Row: {
          id: string
          created_at: string
          role: "trainer" | "trainee"
          first_name: string
          last_name: string
          email: string
          phone: string
          country: string
          expertise: string | null
          availability: string
          motivation: string
          experience: string | null
          status: "pending" | "approved" | "rejected"
          user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          role: "trainer" | "trainee"
          first_name: string
          last_name: string
          email: string
          phone: string
          country: string
          expertise?: string | null
          availability: string
          motivation: string
          experience?: string | null
          status?: "pending" | "approved" | "rejected"
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          role?: "trainer" | "trainee"
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          country?: string
          expertise?: string | null
          availability?: string
          motivation?: string
          experience?: string | null
          status?: "pending" | "approved" | "rejected"
          user_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
