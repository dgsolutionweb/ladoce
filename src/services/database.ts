import { supabase } from './supabase';
import { Product, Sale, Expense, Goal } from '../types';

// Products
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createProduct = async (product: Omit<Product, 'created_at' | 'id'>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateProduct = async (product: Omit<Product, 'created_at'>): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', product.id)
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
export const getSales = async (): Promise<Sale[]> => {
  const { data: salesData, error: salesError } = await supabase
    .from('sales')
    .select('*, sale_items(product_id, quantity)')
    .order('created_at', { ascending: false });

  if (salesError) throw salesError;

  const salesWithProducts = await Promise.all(
    (salesData || []).map(async (sale) => {
      const saleProducts = await Promise.all(
        sale.sale_items.map(async (item: any) => {
          const { data: productData } = await supabase
            .from('products')
            .select('name, price')
            .eq('id', item.product_id)
            .single();

          return {
            id: item.product_id,
            name: productData?.name || '',
            price: productData?.price || 0,
            quantity: item.quantity,
          };
        })
      );

      return {
        id: sale.id,
        total: sale.total,
        payment_method: sale.payment_method,
        delivery: sale.delivery,
        created_at: sale.created_at,
        products: saleProducts,
      };
    })
  );

  return salesWithProducts;
};

export const createSale = async (sale: Omit<Sale, 'created_at' | 'id'>): Promise<Sale> => {
  const { data: saleData, error: saleError } = await supabase
    .from('sales')
    .insert([{
      total: sale.total,
      payment_method: sale.payment_method,
      delivery: sale.delivery,
    }])
    .select()
    .single();

  if (saleError) throw saleError;

  const saleItems = sale.products.map(product => ({
    sale_id: saleData.id,
    product_id: product.id,
    quantity: product.quantity,
  }));

  const { error: itemsError } = await supabase
    .from('sale_items')
    .insert(saleItems);

  if (itemsError) throw itemsError;

  return {
    ...saleData,
    products: sale.products,
  };
};

export const updateSale = async (sale: Omit<Sale, 'created_at'>): Promise<Sale> => {
  const { error: saleError } = await supabase
    .from('sales')
    .update({
      total: sale.total,
      payment_method: sale.payment_method,
      delivery: sale.delivery,
    })
    .eq('id', sale.id);

  if (saleError) throw saleError;

  const { error: deleteError } = await supabase
    .from('sale_items')
    .delete()
    .eq('sale_id', sale.id);

  if (deleteError) throw deleteError;

  const saleItems = sale.products.map(product => ({
    sale_id: sale.id,
    product_id: product.id,
    quantity: product.quantity,
  }));

  const { error: itemsError } = await supabase
    .from('sale_items')
    .insert(saleItems);

  if (itemsError) throw itemsError;

  return sale;
};

export const deleteSale = async (id: number): Promise<void> => {
  const { error: itemsError } = await supabase
    .from('sale_items')
    .delete()
    .eq('sale_id', id);

  if (itemsError) throw itemsError;

  const { error: saleError } = await supabase
    .from('sales')
    .delete()
    .eq('id', id);

  if (saleError) throw saleError;
};

// Expenses
export const getExpenses = async (): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createExpense = async (expense: Omit<Expense, 'created_at' | 'id'>): Promise<Expense> => {
  const { data, error } = await supabase
    .from('expenses')
    .insert([expense])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateExpense = async (expense: Omit<Expense, 'created_at'>): Promise<Expense> => {
  const { data, error } = await supabase
    .from('expenses')
    .update(expense)
    .eq('id', expense.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteExpense = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Goals
export const getGoals = async (): Promise<Goal[]> => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createGoal = async (goal: Omit<Goal, 'created_at' | 'id'>): Promise<Goal> => {
  const { data, error } = await supabase
    .from('goals')
    .insert([goal])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateGoal = async (goal: Omit<Goal, 'created_at'>): Promise<Goal> => {
  const { data, error } = await supabase
    .from('goals')
    .update(goal)
    .eq('id', goal.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteGoal = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id);

  if (error) throw error;
}; 