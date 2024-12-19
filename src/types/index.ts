export interface Product {
  id: number;
  name: string;
  cost_price: number;
  sale_price: number;
  stock_quantity: number;
  created_at: string;
}

export interface Sale {
  id: number;
  date: string;
  payment_method: 'cash' | 'credit' | 'debit' | 'pix';
  delivery: boolean;
  total_amount: number;
  created_at: string;
  sale_items?: SaleItem[];
}

export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  price_at_time: number;
  created_at: string;
  product?: Product;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  created_at: string;
} 