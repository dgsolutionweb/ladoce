export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  created_at: string;
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
  total: number;
  payment_method: string;
  delivery: boolean;
  created_at: string;
  products: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
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
  created_at: string;
}

export interface Goal {
  id: number;
  description: string;
  target_amount: number;
  current_amount: number;
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
  addSale: (sale: Omit<Sale, 'id' | 'created_at'>) => Promise<void>;
  deleteSale: (id: number) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
  updateMonthlyGoal: (goal: number) => Promise<void>;
} 