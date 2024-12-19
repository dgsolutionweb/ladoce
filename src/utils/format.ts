import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDateTime = (date: string): string => {
  return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", {
    locale: ptBR
  });
};

export const formatDateOnly = (date: string): string => {
  return format(new Date(date), 'dd/MM/yyyy', {
    locale: ptBR
  });
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}; 