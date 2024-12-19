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
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
} from '@chakra-ui/react';
import { FiDollarSign, FiSearch, FiPlus, FiMoreVertical, FiEdit2, FiTrash2, FiCalendar, FiTag } from 'react-icons/fi';
import { useApp } from '../contexts/AppContext';
import { formatCurrency, formatDate } from '../utils/format';
import { useState } from 'react';
import { Expense } from '../types';
import ExpenseModal from '../components/ExpenseModal';

const Expenses = () => {
  const { expenses, deleteExpense } = useApp();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const bgCard = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconBg = useColorModeValue('brand.50', 'brand.900');
  const iconColor = useColorModeValue('brand.600', 'brand.200');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    onOpen();
  };

  const handleDelete = async (expense: Expense) => {
    if (window.confirm(`Tem certeza que deseja excluir esta despesa?`)) {
      await deleteExpense(expense.id);
    }
  };

  const handleAdd = () => {
    setSelectedExpense(null);
    onOpen();
  };

  const filteredExpenses = expenses
    .filter(expense =>
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const ExpenseCard = ({ expense }: { expense: Expense }) => (
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
      <HStack justify="space-between" mb={4}>
        <HStack spacing={4}>
          <Box
            p={3}
            borderRadius="xl"
            bg={iconBg}
            color={iconColor}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={FiDollarSign} boxSize={5} />
          </Box>
          <VStack align="start" spacing={1}>
            <Text fontSize="lg" fontWeight="semibold">
              {expense.description}
            </Text>
            <HStack spacing={4} color={textColor}>
              <HStack spacing={2}>
                <Icon as={FiCalendar} boxSize={4} />
                <Text fontSize="sm">{formatDate(expense.date)}</Text>
              </HStack>
              <HStack spacing={2}>
                <Icon as={FiTag} boxSize={4} />
                <Text fontSize="sm">{expense.category}</Text>
              </HStack>
            </HStack>
          </VStack>
        </HStack>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FiMoreVertical />}
            variant="ghost"
            size="sm"
            aria-label="Opções"
          />
          <MenuList>
            <MenuItem icon={<FiEdit2 />} onClick={() => handleEdit(expense)}>
              Editar
            </MenuItem>
            <MenuItem icon={<FiTrash2 />} onClick={() => handleDelete(expense)} color="red.500">
              Excluir
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      <Box>
        <Text fontSize="sm" color={textColor} mb={1}>
          Valor
        </Text>
        <Text fontSize="xl" fontWeight="bold" color="red.500">
          {formatCurrency(expense.amount)}
        </Text>
      </Box>
    </Box>
  );

  return (
    <VStack spacing={8} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          Despesas
        </Text>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="brand"
          onClick={handleAdd}
        >
          Nova Despesa
        </Button>
      </HStack>

      <Box>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Buscar despesas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {filteredExpenses.map(expense => (
          <ExpenseCard key={expense.id} expense={expense} />
        ))}
      </SimpleGrid>

      <ExpenseModal
        isOpen={isOpen}
        onClose={onClose}
        expense={selectedExpense}
      />
    </VStack>
  );
};

export default Expenses; 