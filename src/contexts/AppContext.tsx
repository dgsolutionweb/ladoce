import { createContext, useContext, useState, useEffect } from 'react';
import { useSupabase } from '../hooks/useSupabase';
import { Product, Sale, Expense, Goal } from '../types';

interface AppContextData {
  products: Product[];
  sales: Sale[];
  expenses: Expense[];
  goals: Goal[];
  addProduct: (product: Omit<Product, 'created_at' | 'id'>) => Promise<void>;
  updateProduct: (product: Omit<Product, 'created_at'>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  addSale: (sale: Omit<Sale, 'created_at' | 'id'>) => Promise<void>;
  updateSale: (sale: Omit<Sale, 'created_at'>) => Promise<void>;
  deleteSale: (id: number) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'created_at' | 'id'>) => Promise<void>;
  updateExpense: (expense: Omit<Expense, 'created_at'>) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'created_at' | 'id'>) => Promise<void>;
  updateGoal: (goal: Omit<Goal, 'created_at'>) => Promise<void>;
  deleteGoal: (id: number) => Promise<void>;
  resetData: () => Promise<void>;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { supabase } = useSupabase();
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchSales();
    fetchExpenses();
    fetchGoals();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setProducts(data || []);
  };

  const fetchSales = async () => {
    const { data, error } = await supabase
      .from('sales')
      .select('*, sale_items(product_id, quantity)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const salesWithProducts = await Promise.all(
      (data || []).map(async (sale) => {
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

    setSales(salesWithProducts);
  };

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setExpenses(data || []);
  };

  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setGoals(data || []);
  };

  const addProduct = async (product: Omit<Product, 'created_at' | 'id'>) => {
    const { error } = await supabase.from('products').insert([product]);
    if (error) throw error;
    await fetchProducts();
  };

  const updateProduct = async (product: Omit<Product, 'created_at'>) => {
    const { error } = await supabase
      .from('products')
      .update(product)
      .eq('id', product.id);
    if (error) throw error;
    await fetchProducts();
  };

  const deleteProduct = async (id: number) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    await fetchProducts();
  };

  const addSale = async (sale: Omit<Sale, 'created_at' | 'id'>) => {
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

    const saleItems = sale.products.map((product) => ({
      sale_id: saleData.id,
      product_id: product.id,
      quantity: product.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItems);

    if (itemsError) throw itemsError;

    await fetchSales();
  };

  const updateSale = async (sale: Omit<Sale, 'created_at'>) => {
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

    const saleItems = sale.products.map((product) => ({
      sale_id: sale.id,
      product_id: product.id,
      quantity: product.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItems);

    if (itemsError) throw itemsError;

    await fetchSales();
  };

  const deleteSale = async (id: number) => {
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

    await fetchSales();
  };

  const addExpense = async (expense: Omit<Expense, 'created_at' | 'id'>) => {
    const { error } = await supabase.from('expenses').insert([expense]);
    if (error) throw error;
    await fetchExpenses();
  };

  const updateExpense = async (expense: Omit<Expense, 'created_at'>) => {
    const { error } = await supabase
      .from('expenses')
      .update(expense)
      .eq('id', expense.id);
    if (error) throw error;
    await fetchExpenses();
  };

  const deleteExpense = async (id: number) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
    await fetchExpenses();
  };

  const addGoal = async (goal: Omit<Goal, 'created_at' | 'id'>) => {
    const { error } = await supabase.from('goals').insert([goal]);
    if (error) throw error;
    await fetchGoals();
  };

  const updateGoal = async (goal: Omit<Goal, 'created_at'>) => {
    const { error } = await supabase
      .from('goals')
      .update(goal)
      .eq('id', goal.id);
    if (error) throw error;
    await fetchGoals();
  };

  const deleteGoal = async (id: number) => {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) throw error;
    await fetchGoals();
  };

  const resetData = async () => {
    await supabase.from('sale_items').delete().neq('id', 0);
    await supabase.from('sales').delete().neq('id', 0);
    await supabase.from('expenses').delete().neq('id', 0);
    await supabase.from('products').delete().neq('id', 0);
    await supabase.from('goals').delete().neq('id', 0);
    
    await fetchProducts();
    await fetchSales();
    await fetchExpenses();
    await fetchGoals();
  };

  return (
    <AppContext.Provider
      value={{
        products,
        sales,
        expenses,
        goals,
        addProduct,
        updateProduct,
        deleteProduct,
        addSale,
        updateSale,
        deleteSale,
        addExpense,
        updateExpense,
        deleteExpense,
        addGoal,
        updateGoal,
        deleteGoal,
        resetData,
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