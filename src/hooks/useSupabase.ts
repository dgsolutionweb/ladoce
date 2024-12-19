import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const useSupabase = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('products').select('count');
        if (error) throw error;
        setIsConnected(true);
      } catch (err) {
        setError(err as Error);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  return {
    isConnected,
    isLoading,
    error,
    supabase,
  };
};

export default useSupabase; 