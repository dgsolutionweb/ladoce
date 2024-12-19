import {
  Box,
  Button,
  Grid,
  HStack,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from '@chakra-ui/react';
import { FiDollarSign, FiShoppingBag, FiCreditCard, FiTrendingUp, FiRefreshCw } from 'react-icons/fi';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/format';
import { useSupabase } from '../hooks/useSupabase';
import { useRef } from 'react';

const Dashboard = () => {
  const { sales, products, expenses, monthlyGoal } = useApp();
  const { supabase } = useSupabase();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const bgCard = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconBg = useColorModeValue('brand.100', 'brand.900');
  const iconColor = useColorModeValue('brand.700', 'brand.200');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const currentMonthSales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    const today = new Date();
    return saleDate.getMonth() === today.getMonth() && 
           saleDate.getFullYear() === today.getFullYear();
  });

  const totalSales = currentMonthSales.reduce((total, sale) => total + sale.total_amount, 0);
  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  const profit = totalSales - totalExpenses;
  const goalProgress = (totalSales / monthlyGoal) * 100;

  const handleReset = async () => {
    try {
      await supabase.from('sale_items').delete().neq('id', 0);
      await supabase.from('sales').delete().neq('id', 0);
      await supabase.from('expenses').delete().neq('id', 0);
      await supabase.from('products').delete().neq('id', 0);
      
      toast({
        title: 'Dados resetados com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      window.location.reload();
    } catch (error) {
      toast({
        title: 'Erro ao resetar dados',
        description: 'Tente novamente mais tarde',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    onClose();
  };

  const StatCard = ({ label, value, icon, color }: { label: string; value: string; icon: any; color?: string }) => (
    <Box
      p={6}
      bg={bgCard}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={borderColor}
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-4px)',
        shadow: 'lg',
      }}
    >
      <HStack spacing={4} mb={4}>
        <Box
          p={3}
          borderRadius="xl"
          bg={iconBg}
          color={iconColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={icon} boxSize={6} />
        </Box>
        <VStack align="start" spacing={1}>
          <Text fontSize="sm" color={textColor} fontWeight="medium">
            {label}
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color={color}>
            {value}
          </Text>
        </VStack>
      </HStack>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <Box>
          <Text fontSize="sm" color={textColor} mb={1}>
            Meta Mensal
          </Text>
          <Text fontSize="md" fontWeight="semibold">
            {formatCurrency(monthlyGoal)}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color={textColor} mb={1}>
            Progresso
          </Text>
          <Text 
            fontSize="md" 
            fontWeight="semibold"
            color={goalProgress >= 100 ? 'green.500' : undefined}
          >
            {goalProgress.toFixed(1)}%
          </Text>
        </Box>
      </Grid>
    </Box>
  );

  return (
    <VStack spacing={8} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          Dashboard
        </Text>
        <Button
          leftIcon={<FiRefreshCw />}
          colorScheme="red"
          variant="ghost"
          onClick={onOpen}
          size="sm"
        >
          Resetar Dados
        </Button>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <StatCard
          label="Vendas do Mês"
          value={formatCurrency(totalSales)}
          icon={FiDollarSign}
          color={goalProgress >= 100 ? 'green.500' : undefined}
        />
        <StatCard
          label="Produtos Ativos"
          value={products.length.toString()}
          icon={FiShoppingBag}
        />
        <StatCard
          label="Despesas"
          value={formatCurrency(totalExpenses)}
          icon={FiCreditCard}
          color="red.500"
        />
        <StatCard
          label="Lucro"
          value={formatCurrency(profit)}
          icon={FiTrendingUp}
          color={profit >= 0 ? 'green.500' : 'red.500'}
        />
      </SimpleGrid>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Resetar Dados
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza? Você não poderá desfazer esta ação depois.
              Todos os dados serão apagados.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleReset} ml={3}>
                Resetar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
};

export default Dashboard; 