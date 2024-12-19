import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Text,
  HStack,
  Select,
  Card,
  CardBody,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Icon,
} from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/format';
import ExpenseModal from '../components/ExpenseModal';
import { FiPlus, FiMoreVertical, FiTrendingDown, FiPieChart } from 'react-icons/fi';

const Expenses = () => {
  const { expenses } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');

  const handleEditExpense = (expense: any) => {
    setSelectedExpense(expense);
    onOpen();
  };

  const handleNewExpense = () => {
    setSelectedExpense(null);
    onOpen();
  };

  const filteredData = useMemo(() => {
    const [year, month] = selectedMonth.split('-');
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });

    const totalAmount = filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);

    const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(expensesByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    return {
      expenses: filteredExpenses,
      totalAmount,
      expensesByCategory,
      topCategories,
    };
  }, [expenses, selectedMonth]);

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg">Despesas</Heading>
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
          <Button leftIcon={<FiPlus />} colorScheme="purple" onClick={handleNewExpense}>
            Nova Despesa
          </Button>
        </HStack>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Card bg={bgColor} shadow="sm">
          <CardBody>
            <Stat>
              <StatLabel>Total de Despesas</StatLabel>
              <StatNumber color="red.500">
                <Icon as={FiTrendingDown} mr={2} />
                {formatCurrency(filteredData.totalAmount)}
              </StatNumber>
              <Text fontSize="sm" color="gray.500">
                {filteredData.expenses.length} despesas no período
              </Text>
            </Stat>
          </CardBody>
        </Card>

        {filteredData.topCategories.map(([category, amount], index) => (
          <Card key={index} bg={bgColor} shadow="sm">
            <CardBody>
              <Stat>
                <StatLabel>{category}</StatLabel>
                <StatNumber>
                  <Icon as={FiPieChart} mr={2} />
                  {formatCurrency(amount)}
                </StatNumber>
                <Text fontSize="sm" color="gray.500">
                  {((amount / filteredData.totalAmount) * 100).toFixed(1)}% do total
                </Text>
              </Stat>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      <Box bg={bgColor} borderRadius="lg" shadow="sm">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Data</Th>
              <Th>Descrição</Th>
              <Th>Categoria</Th>
              <Th isNumeric>Valor</Th>
              <Th width="4"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredData.expenses.map((expense) => (
              <Tr key={expense.id}>
                <Td>{new Date(expense.date).toLocaleDateString('pt-BR')}</Td>
                <Td>{expense.description}</Td>
                <Td>{expense.category}</Td>
                <Td isNumeric>{formatCurrency(expense.amount)}</Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem onClick={() => handleEditExpense(expense)}>
                        Editar
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <ExpenseModal
        isOpen={isOpen}
        onClose={onClose}
        currentExpense={selectedExpense}
      />
    </Container>
  );
};

export default Expenses; 