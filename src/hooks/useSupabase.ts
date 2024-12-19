import { useState, useEffect } from 'react';
import { supabase, checkSupabaseConnection } from '../services/supabase';

export const useSupabase = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await checkSupabaseConnection();
        setIsConnected(connected);
        if (!connected) {
          setError('Não foi possível conectar ao banco de dados');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  return {
    supabase,
    isConnected,
    isLoading,
    error,
  };
};

export default useSupabase; 