import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Product, Sale, Expense } from '../types';
import { supabase } from '../services/supabase';

interface AppContextData {
  products: Product[];
  sales: Sale[];
  expenses: Expense[];
  currentSale: Sale | null;
  loading: boolean;
  error: string | null;
  monthlyGoal: number;
  setProducts: (products: Product[]) => void;
  setSales: (sales: Sale[]) => void;
  setCurrentSale: (sale: Sale | null) => void;
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<void>;
  updateProduct: (product: Omit<Product, 'created_at'>) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
  addSale: (sale: Omit<Sale, 'id' | 'created_at'>) => Promise<void>;
  fetchSales: () => Promise<void>;
  updateMonthlyGoal: (amount: number) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'created_at'>) => Promise<void>;
  updateExpense: (expense: Omit<Expense, 'created_at'>) => Promise<void>;
  deleteExpense: (expenseId: number) => Promise<void>;
  fetchExpenses: () => Promise<void>;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [monthlyGoal, setMonthlyGoal] = useState<number>(5000);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;

      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          sale_items (
            *,
            product:products (*)
          )
        `)
        .order('date', { ascending: false });

      if (error) throw error;

      setSales(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar vendas');
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = useCallback(async (product: Omit<Product, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => [...prev, data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar produto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (product: Omit<Product, 'created_at'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .update({
          name: product.name,
          cost_price: product.cost_price,
          sale_price: product.sale_price,
          stock_quantity: product.stock_quantity
        })
        .eq('id', product.id)
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => prev.map(p => p.id === product.id ? data : p));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar produto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (productId: number) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir produto');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addSale = useCallback(async (sale: Omit<Sale, 'id' | 'created_at'>) => {
    try {
      setLoading(true);

      // First, insert the sale
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .insert([{
          date: sale.date,
          payment_method: sale.payment_method,
          delivery: sale.delivery,
          total_amount: sale.total_amount
        }])
        .select()
        .single();

      if (saleError) throw saleError;

      // Then, insert the sale items
      const saleItems = sale.products.map(product => ({
        sale_id: saleData.id,
        product_id: product.product_id,
        quantity: product.quantity,
        price_at_time: product.price_at_time
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);

      if (itemsError) throw itemsError;

      // Update products stock
      for (const item of sale.products) {
        const product = products.find(p => p.id === item.product_id);
        if (product) {
          const { error: updateError } = await supabase
            .from('products')
            .update({ stock_quantity: product.stock_quantity - item.quantity })
            .eq('id', item.product_id);

          if (updateError) throw updateError;
        }
      }

      // Fetch updated data
      await Promise.all([
        fetchProducts(),
        fetchSales()
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar venda');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [products, fetchProducts, fetchSales]);

  const updateMonthlyGoal = useCallback(async (amount: number) => {
    try {
      setLoading(true);
      // Here you would typically update the goal in your database
      // For now, we'll just update it in the state
      setMonthlyGoal(amount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar meta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar despesas');
    } finally {
      setLoading(false);
    }
  }, []);

  const addExpense = useCallback(async (expense: Omit<Expense, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .insert([expense])
        .select()
        .single();

      if (error) throw error;

      setExpenses(prev => [...prev, data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar despesa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateExpense = useCallback(async (expense: Omit<Expense, 'created_at'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .update({
          description: expense.description,
          amount: expense.amount,
          date: expense.date,
          category: expense.category
        })
        .eq('id', expense.id)
        .select()
        .single();

      if (error) throw error;

      setExpenses(prev => prev.map(e => e.id === expense.id ? data : e));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar despesa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteExpense = useCallback(async (expenseId: number) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;

      setExpenses(prev => prev.filter(e => e.id !== expenseId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir despesa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchSales();
    fetchExpenses();
  }, [fetchProducts, fetchSales, fetchExpenses]);

  return (
    <AppContext.Provider
      value={{
        products,
        sales,
        expenses,
        currentSale,
        loading,
        error,
        monthlyGoal,
        setProducts,
        setSales,
        setCurrentSale,
        addProduct,
        updateProduct,
        deleteProduct,
        addSale,
        fetchSales,
        updateMonthlyGoal,
        addExpense,
        updateExpense,
        deleteExpense,
        fetchExpenses,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext; 