import {
  Box,
  Button,
  Grid,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
  Select,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiShoppingBag, FiTarget, FiPieChart } from 'react-icons/fi';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/format';
import { useState, useMemo } from 'react';

const Reports = () => {
  const { sales, expenses, monthlyGoal } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const bgCard = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconBg = useColorModeValue('brand.50', 'brand.900');
  const iconColor = useColorModeValue('brand.600', 'brand.200');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const data = useMemo(() => {
    const [year, month] = selectedMonth.split('-');
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    const filteredSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= startDate && saleDate <= endDate;
    });

    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });

    const totalSales = filteredSales.reduce((total, sale) => total + sale.total_amount, 0);
    const totalExpenses = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
    const profit = totalSales - totalExpenses;
    const goalProgress = (totalSales / monthlyGoal) * 100;

    const salesByProduct = new Map<string, { quantity: number; revenue: number }>();
    filteredSales.forEach(sale => {
      sale.sale_items?.forEach(item => {
        const current = salesByProduct.get(item.product_name) || { quantity: 0, revenue: 0 };
        salesByProduct.set(item.product_name, {
          quantity: current.quantity + item.quantity,
          revenue: current.revenue + (item.price_at_time * item.quantity),
        });
      });
    });

    const topProducts = Array.from(salesByProduct.entries())
      .map(([name, stats]) => ({
        name,
        quantity: stats.quantity,
        revenue: stats.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const topExpenses = Object.entries(expensesByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      totalSales,
      totalExpenses,
      profit,
      goalProgress,
      topProducts,
      topExpenses,
      salesCount: filteredSales.length,
      expensesCount: filteredExpenses.length,
    };
  }, [sales, expenses, selectedMonth, monthlyGoal]);

  const StatCard = ({ label, value, icon, color, helpText }: { label: string; value: string; icon: any; color?: string; helpText?: string }) => (
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
          <Icon as={icon} boxSize={5} />
        </Box>
        <VStack align="start" spacing={1}>
          <Text fontSize="sm" color={textColor} fontWeight="medium">
            {label}
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color={color}>
            {value}
          </Text>
          {helpText && (
            <Text fontSize="sm" color={textColor}>
              {helpText}
            </Text>
          )}
        </VStack>
      </HStack>
    </Box>
  );

  return (
    <VStack spacing={8} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          Relatórios
        </Text>
        <Select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          w="200px"
        >
          {Array.from({ length: 12 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const value = date.toISOString().slice(0, 7);
            const label = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </Select>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <StatCard
          label="Vendas"
          value={formatCurrency(data.totalSales)}
          icon={FiTrendingUp}
          color="green.500"
          helpText={`${data.salesCount} vendas no período`}
        />
        <StatCard
          label="Despesas"
          value={formatCurrency(data.totalExpenses)}
          icon={FiTrendingDown}
          color="red.500"
          helpText={`${data.expensesCount} despesas no período`}
        />
        <StatCard
          label="Lucro"
          value={formatCurrency(data.profit)}
          icon={FiDollarSign}
          color={data.profit >= 0 ? 'green.500' : 'red.500'}
        />
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
              <Icon as={FiTarget} boxSize={5} />
            </Box>
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" color={textColor} fontWeight="medium">
                Meta Mensal
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color={data.goalProgress >= 100 ? 'green.500' : undefined}>
                {data.goalProgress.toFixed(1)}%
              </Text>
            </VStack>
          </HStack>
          <Progress
            value={data.goalProgress}
            colorScheme={data.goalProgress >= 100 ? 'green' : 'brand'}
            borderRadius="full"
            size="sm"
            mb={2}
            hasStripe={data.goalProgress < 100}
            isAnimated={data.goalProgress < 100}
          />
          <Text fontSize="sm" color={textColor}>
            Meta: {formatCurrency(monthlyGoal)}
          </Text>
        </Box>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Box
          p={6}
          bg={bgCard}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <HStack spacing={4} mb={6}>
            <Icon as={FiShoppingBag} color={iconColor} boxSize={5} />
            <Text fontSize="lg" fontWeight="semibold">
              Produtos Mais Vendidos
            </Text>
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
              {data.topProducts.map((product, index) => (
                <Tr key={index}>
                  <Td>{product.name}</Td>
                  <Td isNumeric>{product.quantity}</Td>
                  <Td isNumeric>{formatCurrency(product.revenue)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Box
          p={6}
          bg={bgCard}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <HStack spacing={4} mb={6}>
            <Icon as={FiPieChart} color={iconColor} boxSize={5} />
            <Text fontSize="lg" fontWeight="semibold">
              Maiores Despesas
            </Text>
          </HStack>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Categoria</Th>
                <Th isNumeric>Valor</Th>
                <Th isNumeric>%</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.topExpenses.map(([category, amount], index) => (
                <Tr key={index}>
                  <Td>{category}</Td>
                  <Td isNumeric>{formatCurrency(amount)}</Td>
                  <Td isNumeric>
                    {((amount / data.totalExpenses) * 100).toFixed(1)}%
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </SimpleGrid>
    </VStack>
  );
};

export default Reports; 