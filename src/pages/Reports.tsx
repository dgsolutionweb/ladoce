import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  Select,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Card,
  CardBody,
  Progress,
  Text,
} from '@chakra-ui/react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/format';
import { useMemo, useState } from 'react';

const Reports = () => {
  const { sales, expenses, goals } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const data = useMemo(() => {
    const [year, month] = selectedMonth.split('-');
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    const filteredSales = sales.filter(sale => {
      const saleDate = new Date(sale.created_at);
      return saleDate >= startDate && saleDate <= endDate;
    });

    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.created_at);
      return expenseDate >= startDate && expenseDate <= endDate;
    });

    const totalSales = filteredSales.reduce((total, sale) => total + sale.total, 0);
    const totalExpenses = filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
    const profit = totalSales - totalExpenses;

    const currentGoal = goals.find(goal => {
      const goalDate = new Date(goal.created_at);
      return goalDate.getMonth() === startDate.getMonth() && goalDate.getFullYear() === startDate.getFullYear();
    });

    const goalProgress = currentGoal ? (totalSales / currentGoal.target_amount) * 100 : 0;

    const salesByProduct = new Map<string, { quantity: number; revenue: number }>();
    filteredSales.forEach(sale => {
      sale.products.forEach(product => {
        const current = salesByProduct.get(product.name) || { quantity: 0, revenue: 0 };
        salesByProduct.set(product.name, {
          quantity: current.quantity + product.quantity,
          revenue: current.revenue + (product.price * product.quantity),
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
      const category = expense.description;
      acc[category] = (acc[category] || 0) + expense.amount;
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
      currentGoal,
    };
  }, [sales, expenses, goals, selectedMonth]);

  const months = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    const result = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      result.push({ value, label });
    }
    return result;
  }, []);

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg">Relatórios</Heading>
        <Select
          maxW="300px"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {months.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Flex>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Vendas</StatLabel>
              <StatNumber>{formatCurrency(data.totalSales)}</StatNumber>
              <StatHelpText>
                {data.salesCount} {data.salesCount === 1 ? 'venda' : 'vendas'}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Despesas</StatLabel>
              <StatNumber>{formatCurrency(data.totalExpenses)}</StatNumber>
              <StatHelpText>
                {data.expensesCount} {data.expensesCount === 1 ? 'despesa' : 'despesas'}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Lucro</StatLabel>
              <StatNumber>{formatCurrency(data.profit)}</StatNumber>
              <StatHelpText>
                <StatArrow type={data.profit >= 0 ? 'increase' : 'decrease'} />
                {((data.profit / data.totalSales) * 100 || 0).toFixed(1)}%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Meta Mensal</StatLabel>
              <StatNumber>
                {data.currentGoal ? formatCurrency(data.currentGoal.target_amount) : 'Não definida'}
              </StatNumber>
              {data.currentGoal && (
                <Box mt={2}>
                  <Progress value={data.goalProgress} colorScheme="brand" size="sm" mb={1} />
                  <StatHelpText>
                    {data.goalProgress.toFixed(1)}% alcançado
                  </StatHelpText>
                </Box>
              )}
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Top 5 Produtos</Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Produto</Th>
                  <Th isNumeric>Quantidade</Th>
                  <Th isNumeric>Receita</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.topProducts.map((product) => (
                  <Tr key={product.name}>
                    <Td>{product.name}</Td>
                    <Td isNumeric>{product.quantity}</Td>
                    <Td isNumeric>{formatCurrency(product.revenue)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Top 5 Despesas</Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Categoria</Th>
                  <Th isNumeric>Valor</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.topExpenses.map(([category, amount]) => (
                  <Tr key={category}>
                    <Td>{category}</Td>
                    <Td isNumeric>{formatCurrency(amount)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </Grid>
    </Container>
  );
};

export default Reports; 