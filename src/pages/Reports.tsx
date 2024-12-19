import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  VStack,
  HStack,
  Text,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/format';
import ExpenseModal from '../components/ExpenseModal';
import { FiPlus, FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';

const Reports = () => {
  const { sales, expenses } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');

  const filteredData = useMemo(() => {
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

    const totalSales = filteredSales.reduce((acc, sale) => acc + sale.total_amount, 0);
    const totalExpenses = filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);
    const netProfit = totalSales - totalExpenses;
    const averageTicket = filteredSales.length > 0 ? totalSales / filteredSales.length : 0;
    const deliveryCount = filteredSales.filter(sale => sale.delivery).length;

    const paymentMethods = {
      cash: filteredSales.filter(sale => sale.payment_method === 'cash').length,
      credit: filteredSales.filter(sale => sale.payment_method === 'credit').length,
      debit: filteredSales.filter(sale => sale.payment_method === 'debit').length,
      pix: filteredSales.filter(sale => sale.payment_method === 'pix').length,
    };

    const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSales,
      totalExpenses,
      netProfit,
      averageTicket,
      deliveryCount,
      paymentMethods,
      expensesByCategory,
      sales: filteredSales,
      expenses: filteredExpenses,
    };
  }, [sales, expenses, selectedMonth]);

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg">Relatórios</Heading>
        <HStack spacing={4}>
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
          <Button leftIcon={<FiPlus />} colorScheme="purple" onClick={onOpen}>
            Nova Despesa
          </Button>
        </HStack>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Stat p={4} bg={bgColor} borderRadius="lg" shadow="sm">
          <StatLabel>Receita Bruta</StatLabel>
          <StatNumber color="green.500">
            <Icon as={FiTrendingUp} mr={2} />
            {formatCurrency(filteredData.totalSales)}
          </StatNumber>
        </Stat>
        <Stat p={4} bg={bgColor} borderRadius="lg" shadow="sm">
          <StatLabel>Despesas Totais</StatLabel>
          <StatNumber color="red.500">
            <Icon as={FiTrendingDown} mr={2} />
            {formatCurrency(filteredData.totalExpenses)}
          </StatNumber>
        </Stat>
        <Stat p={4} bg={bgColor} borderRadius="lg" shadow="sm">
          <StatLabel>Lucro Líquido</StatLabel>
          <StatNumber color={filteredData.netProfit >= 0 ? "green.500" : "red.500"}>
            <Icon as={FiDollarSign} mr={2} />
            {formatCurrency(filteredData.netProfit)}
          </StatNumber>
        </Stat>
      </SimpleGrid>

      <Tabs variant="enclosed" mb={8}>
        <TabList>
          <Tab>Vendas</Tab>
          <Tab>Despesas</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0} pt={4}>
            <VStack spacing={6} align="stretch">
              <Box bg={bgColor} p={4} borderRadius="lg" shadow="sm">
                <Heading size="md" mb={4}>Métodos de Pagamento</Heading>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                  <Stat>
                    <StatLabel>Dinheiro</StatLabel>
                    <StatNumber>{filteredData.paymentMethods.cash}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Crédito</StatLabel>
                    <StatNumber>{filteredData.paymentMethods.credit}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Débito</StatLabel>
                    <StatNumber>{filteredData.paymentMethods.debit}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>PIX</StatLabel>
                    <StatNumber>{filteredData.paymentMethods.pix}</StatNumber>
                  </Stat>
                </SimpleGrid>
              </Box>

              <Box bg={bgColor} p={4} borderRadius="lg" shadow="sm">
                <Heading size="md" mb={4}>Vendas do Período</Heading>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Data</Th>
                      <Th>Valor</Th>
                      <Th>Pagamento</Th>
                      <Th>Entrega</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredData.sales.map((sale) => (
                      <Tr key={sale.id}>
                        <Td>{new Date(sale.date).toLocaleDateString('pt-BR')}</Td>
                        <Td>{formatCurrency(sale.total_amount)}</Td>
                        <Td>{sale.payment_method}</Td>
                        <Td>{sale.delivery ? 'Sim' : 'Não'}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </TabPanel>

          <TabPanel p={0} pt={4}>
            <VStack spacing={6} align="stretch">
              <Box bg={bgColor} p={4} borderRadius="lg" shadow="sm">
                <Heading size="md" mb={4}>Despesas por Categoria</Heading>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Categoria</Th>
                      <Th>Total</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Object.entries(filteredData.expensesByCategory).map(([category, total]) => (
                      <Tr key={category}>
                        <Td>{category}</Td>
                        <Td>{formatCurrency(total)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              <Box bg={bgColor} p={4} borderRadius="lg" shadow="sm">
                <Heading size="md" mb={4}>Despesas do Período</Heading>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Data</Th>
                      <Th>Descrição</Th>
                      <Th>Categoria</Th>
                      <Th>Valor</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredData.expenses.map((expense) => (
                      <Tr key={expense.id}>
                        <Td>{new Date(expense.date).toLocaleDateString('pt-BR')}</Td>
                        <Td>{expense.description}</Td>
                        <Td>{expense.category}</Td>
                        <Td>{formatCurrency(expense.amount)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <ExpenseModal isOpen={isOpen} onClose={onClose} />
    </Container>
  );
};

export default Reports; 