export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  created_at?: string;
}

export interface SaleProduct {
  product_id: number;
  quantity: number;
  price_at_time: number;
  product?: Product;
  total?: number;
}

export interface Sale {
  id: number;
  date: string;
  payment_method: 'cash' | 'credit' | 'debit' | 'pix';
  delivery: boolean;
  total_amount: number;
  created_at: string;
  sale_items?: SaleItem[];
  products?: SaleProduct[];
}

export interface SaleItem {
  id?: number;
  sale_id?: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price_at_time: number;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  created_at: string;
}

export interface MonthlyGoal {
  id: number;
  amount: number;
  created_at: string;
}

export interface AppContextData {
  products: Product[];
  sales: Sale[];
  expenses: Expense[];
  monthlyGoal: number;
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  addSale: (sale: Omit<Sale, 'id'>) => Promise<void>;
  deleteSale: (id: number) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
  updateMonthlyGoal: (goal: number) => Promise<void>;
} 