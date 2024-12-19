import {
  Box,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  useColorModeValue,
  Icon,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Card,
  CardBody,
  VStack,
  HStack,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/format';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiShoppingBag, FiTarget, FiEdit2, FiTrash2 } from 'react-icons/fi';
import ExpenseModal from '../components/ExpenseModal';
import GoalModal from '../components/GoalModal';
import { supabase } from '../services/supabase';

interface DashboardStats {
  todaySales: number;
  todayTransactions: number;
  monthSales: number;
  monthTransactions: number;
  monthExpenses: number;
  netProfit: number;
  goalProgress: number;
  lowStockCount: number;
  mostSoldProducts: {
    name: string;
    quantity: number;
    revenue: number;
  }[];
}

const Dashboard = () => {
  const { sales, products, expenses, monthlyGoal, fetchSales, fetchProducts, fetchExpenses } = useApp();
  const [stats, setStats] = useState<DashboardStats>({
    todaySales: 0,
    todayTransactions: 0,
    monthSales: 0,
    monthTransactions: 0,
    monthExpenses: 0,
    netProfit: 0,
    goalProgress: 0,
    lowStockCount: 0,
    mostSoldProducts: [],
  });
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');

  const handleResetData = async () => {
    try {
      // Delete all records from each table
      await supabase.from('sale_items').delete().neq('id', 0);
      await supabase.from('sales').delete().neq('id', 0);
      await supabase.from('expenses').delete().neq('id', 0);
      await supabase.from('products').delete().neq('id', 0);

      // Refresh the data
      await Promise.all([
        fetchSales(),
        fetchProducts(),
        fetchExpenses()
      ]);

      toast({
        title: 'Dados resetados',
        description: 'Todos os dados foram apagados com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao resetar os dados',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsResetDialogOpen(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Calculate today's stats
    const todaySales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= today;
    });

    // Calculate month's stats
    const monthSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= firstDayOfMonth;
    });

    // Calculate month's expenses
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= firstDayOfMonth;
    });

    // Calculate most sold products
    const productSales = new Map<string, { quantity: number; revenue: number }>();
    monthSales.forEach(sale => {
      if (sale.sale_items) {
        sale.sale_items.forEach(item => {
          const product = products.find(p => p.id === item.product_id);
          if (product) {
            const current = productSales.get(product.name) || { quantity: 0, revenue: 0 };
            productSales.set(product.name, {
              quantity: current.quantity + item.quantity,
              revenue: current.revenue + (item.price_at_time * item.quantity),
            });
          }
        });
      }
    });

    const mostSoldProducts = Array.from(productSales.entries())
      .map(([name, stats]) => ({
        name,
        quantity: stats.quantity,
        revenue: stats.revenue,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Count low stock products
    const lowStockCount = products.filter(product => product.stock_quantity < 10).length;

    // Calculate total values
    const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total_amount, 0);
    const monthTotal = monthSales.reduce((sum, sale) => sum + sale.total_amount, 0);
    const monthExpensesTotal = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netProfit = monthTotal - monthExpensesTotal;
    const goalProgress = (monthTotal / monthlyGoal) * 100;

    setStats({
      todaySales: todayTotal,
      todayTransactions: todaySales.length,
      monthSales: monthTotal,
      monthTransactions: monthSales.length,
      monthExpenses: monthExpensesTotal,
      netProfit,
      goalProgress,
      lowStockCount,
      mostSoldProducts,
    });
  }, [sales, products, expenses, monthlyGoal]);

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg">Dashboard</Heading>
        <Button
          leftIcon={<FiTrash2 />}
          colorScheme="red"
          variant="ghost"
          onClick={() => setIsResetDialogOpen(true)}
        >
          Resetar Dados
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Card bg={bgColor} shadow="sm">
          <CardBody>
            <Stat>
              <StatLabel>Vendas Hoje</StatLabel>
              <StatNumber color="green.500">
                <Icon as={FiTrendingUp} mr={2} />
                {formatCurrency(stats.todaySales)}
              </StatNumber>
              <StatHelpText>{stats.todayTransactions} transações</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} shadow="sm">
          <CardBody>
            <Stat>
              <StatLabel>Vendas do Mês</StatLabel>
              <StatNumber color="green.500">
                <Icon as={FiTrendingUp} mr={2} />
                {formatCurrency(stats.monthSales)}
              </StatNumber>
              <StatHelpText>{stats.monthTransactions} transações</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} shadow="sm">
          <CardBody>
            <Stat>
              <StatLabel>Despesas do Mês</StatLabel>
              <StatNumber color="red.500">
                <Icon as={FiTrendingDown} mr={2} />
                {formatCurrency(stats.monthExpenses)}
              </StatNumber>
              <StatHelpText>
                <Button
                  size="xs"
                  colorScheme="purple"
                  variant="ghost"
                  onClick={() => setIsExpenseModalOpen(true)}
                >
                  Adicionar Despesa
                </Button>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgColor} shadow="sm">
          <CardBody>
            <Stat>
              <StatLabel>Lucro Líquido</StatLabel>
              <StatNumber color={stats.netProfit >= 0 ? "green.500" : "red.500"}>
                <Icon as={FiDollarSign} mr={2} />
                {formatCurrency(stats.netProfit)}
              </StatNumber>
              <StatHelpText>Este mês</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
        <Card bg={bgColor} shadow="sm">
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <Flex justify="space-between" align="center">
                <HStack>
                  <Icon as={FiTarget} color="purple.500" boxSize={5} />
                  <Heading size="md">Meta Mensal</Heading>
                </HStack>
                <Button
                  size="sm"
                  leftIcon={<FiEdit2 />}
                  variant="ghost"
                  onClick={() => setIsGoalModalOpen(true)}
                >
                  Editar
                </Button>
              </Flex>
              <Box>
                <Flex justify="space-between" mb={2}>
                  <Text>{formatCurrency(stats.monthSales)}</Text>
                  <Text>{formatCurrency(monthlyGoal)}</Text>
                </Flex>
                <Progress
                  value={stats.goalProgress}
                  colorScheme={stats.goalProgress >= 100 ? 'green' : 'purple'}
                  borderRadius="full"
                  size="sm"
                  mb={2}
                />
                <Text fontSize="sm" color="gray.500">
                  {stats.goalProgress.toFixed(1)}% da meta atingida
                </Text>
              </Box>
            </VStack>
          </CardBody>
        </Card>

        <Card bg={bgColor} shadow="sm">
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <HStack>
                <Icon as={FiShoppingBag} color="purple.500" boxSize={5} />
                <Heading size="md">Produtos Mais Vendidos</Heading>
              </HStack>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Produto</Th>
                    <Th isNumeric>Qtd.</Th>
                    <Th isNumeric>Receita</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {stats.mostSoldProducts.map((product, index) => (
                    <Tr key={index}>
                      <Td>{product.name}</Td>
                      <Td isNumeric>{product.quantity}</Td>
                      <Td isNumeric>{formatCurrency(product.revenue)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      <AlertDialog
        isOpen={isResetDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsResetDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Resetar Dados
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza? Esta ação irá apagar todos os dados cadastrados (produtos, vendas, despesas).
              Esta ação não pode ser desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsResetDialogOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleResetData} ml={3}>
                Resetar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
      />
    </Container>
  );
};

export default Dashboard; 