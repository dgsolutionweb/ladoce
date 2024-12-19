import { supabase } from './supabase';
import { Product, Sale, SaleProduct, MonthlyGoal, Expense } from '../types';

// Products
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
};

export const createProduct = async (product: Omit<Product, 'id' | 'created_at'>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateProduct = async (id: number, product: Partial<Product>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Sales
export const getSales = async (startDate?: string, endDate?: string): Promise<Sale[]> => {
  let query = supabase
    .from('sales')
    .select(`
      *,
      products:sale_items(
        product_id,
        quantity,
        price_at_time
      )
    `)
    .order('date', { ascending: false });

  if (startDate) {
    query = query.gte('date', startDate);
  }
  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
};

export const createSale = async (
  sale: Omit<Sale, 'id' | 'created_at'>,
  saleProducts: Omit<SaleProduct, 'sale_id'>[]
): Promise<Sale> => {
  const { data: saleData, error: saleError } = await supabase
    .from('sales')
    .insert([sale])
    .select()
    .single();

  if (saleError) throw saleError;

  const saleItemsToInsert = saleProducts.map(product => ({
    ...product,
    sale_id: saleData.id
  }));

  const { error: itemsError } = await supabase
    .from('sale_items')
    .insert(saleItemsToInsert);

  if (itemsError) throw itemsError;

  return saleData;
};

// Monthly Goals
export const getMonthlyGoals = async (): Promise<MonthlyGoal[]> => {
  const { data, error } = await supabase
    .from('monthly_goals')
    .select('*')
    .order('month', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createMonthlyGoal = async (goal: Omit<MonthlyGoal, 'id'>): Promise<MonthlyGoal> => {
  const { data, error } = await supabase
    .from('monthly_goals')
    .insert([goal])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Expenses
export const getExpenses = async (startDate?: string, endDate?: string): Promise<Expense[]> => {
  let query = supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false });

  if (startDate) {
    query = query.gte('date', startDate);
  }
  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
};

export const createExpense = async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
  const { data, error } = await supabase
    .from('expenses')
    .insert([expense])
    .select()
    .single();

  if (error) throw error;
  return data;
}; 