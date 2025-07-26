export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          created_at?: string
        }
      }
      designs: {
        Row: {
          id: string
          user_id: string
          name: string
          sole_color: string
          sole_material: string
          trim_color: string
          trim_material: string
          head_color: string
          head_material: string
          laces_color: string
          laces_material: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          sole_color: string
          sole_material: string
          trim_color: string
          trim_material: string
          head_color: string
          head_material: string
          laces_color: string
          laces_material: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          sole_color?: string
          sole_material?: string
          trim_color?: string
          trim_material?: string
          head_color?: string
          head_material?: string
          laces_color?: string
          laces_material?: string
          created_at?: string
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          design_id: string | null
          name: string
          price: number
          quantity: number
          size: string
          image: string | null
          design: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          design_id?: string | null
          name: string
          price: number
          quantity: number
          size: string
          image?: string | null
          design: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          design_id?: string | null
          name?: string
          price?: number
          quantity?: number
          size?: string
          image?: string | null
          design?: Json
          created_at?: string
        }
      }
      // Other tables...
    }
  }
}
