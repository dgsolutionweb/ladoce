export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number
          name: string
          description: string | null
          price: number
          stock_quantity: number
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          price: number
          stock_quantity: number
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          price?: number
          stock_quantity?: number
          created_at?: string
        }
      }
      sales: {
        Row: {
          id: number
          total: number
          payment_method: string
          delivery: boolean
          created_at: string
        }
        Insert: {
          id?: number
          total: number
          payment_method: string
          delivery: boolean
          created_at?: string
        }
        Update: {
          id?: number
          total?: number
          payment_method?: string
          delivery?: boolean
          created_at?: string
        }
      }
      sale_items: {
        Row: {
          id: number
          sale_id: number
          product_id: number
          quantity: number
          created_at: string
        }
        Insert: {
          id?: number
          sale_id: number
          product_id: number
          quantity: number
          created_at?: string
        }
        Update: {
          id?: number
          sale_id?: number
          product_id?: number
          quantity?: number
          created_at?: string
        }
      }
      expenses: {
        Row: {
          id: number
          description: string
          amount: number
          created_at: string
        }
        Insert: {
          id?: number
          description: string
          amount: number
          created_at?: string
        }
        Update: {
          id?: number
          description?: string
          amount?: number
          created_at?: string
        }
      }
      goals: {
        Row: {
          id: number
          description: string
          target_amount: number
          current_amount: number
          created_at: string
        }
        Insert: {
          id?: number
          description: string
          target_amount: number
          current_amount: number
          created_at?: string
        }
        Update: {
          id?: number
          description?: string
          target_amount?: number
          current_amount?: number
          created_at?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 