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
          cost_price: number
          sale_price: number
          stock_quantity: number
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          cost_price: number
          sale_price: number
          stock_quantity?: number
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          cost_price?: number
          sale_price?: number
          stock_quantity?: number
          created_at?: string
        }
      }
      sales: {
        Row: {
          id: number
          date: string
          payment_method: 'cash' | 'credit' | 'debit' | 'pix'
          delivery: boolean
          total_amount: number
          created_at: string
        }
        Insert: {
          id?: number
          date: string
          payment_method: 'cash' | 'credit' | 'debit' | 'pix'
          delivery?: boolean
          total_amount: number
          created_at?: string
        }
        Update: {
          id?: number
          date?: string
          payment_method?: 'cash' | 'credit' | 'debit' | 'pix'
          delivery?: boolean
          total_amount?: number
          created_at?: string
        }
      }
      sale_items: {
        Row: {
          id: number
          sale_id: number
          product_id: number
          quantity: number
          price_at_time: number
          created_at: string
        }
        Insert: {
          id?: number
          sale_id: number
          product_id: number
          quantity: number
          price_at_time: number
          created_at?: string
        }
        Update: {
          id?: number
          sale_id?: number
          product_id?: number
          quantity?: number
          price_at_time?: number
          created_at?: string
        }
      }
      monthly_goals: {
        Row: {
          id: number
          month: string
          target_amount: number
          achieved_amount: number
          created_at: string
        }
        Insert: {
          id?: number
          month: string
          target_amount: number
          achieved_amount?: number
          created_at?: string
        }
        Update: {
          id?: number
          month?: string
          target_amount?: number
          achieved_amount?: number
          created_at?: string
        }
      }
      expenses: {
        Row: {
          id: number
          description: string
          amount: number
          date: string
          category: string
          created_at: string
        }
        Insert: {
          id?: number
          description: string
          amount: number
          date: string
          category: string
          created_at?: string
        }
        Update: {
          id?: number
          description?: string
          amount?: number
          date?: string
          category?: string
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
  }
} 