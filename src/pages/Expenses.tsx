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
  IconButton,
  useDisclosure,
  useToast,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import ExpenseModal from '../components/ExpenseModal';
import { Expense } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

const Expenses = () => {
  const { expenses, deleteExpense } = useApp();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  const handleEdit = (expense: Expense) => {
    setCurrentExpense(expense);
    onOpen();
  };

  const handleDelete = async (expense: Expense) => {
    if (window.confirm(`Tem certeza que deseja excluir esta despesa?`)) {
      try {
        await deleteExpense(expense.id);
        toast({
          title: 'Despesa excluída',
          description: 'A despesa foi excluída com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Erro',
          description: error instanceof Error ? error.message : 'Erro ao excluir despesa',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleAddNew = () => {
    setCurrentExpense(null);
    onOpen();
  };

  const filteredExpenses = expenses
    .filter((expense) =>
      expense.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg">Despesas</Heading>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="brand"
          onClick={handleAddNew}
        >
          Nova Despesa
        </Button>
      </Flex>

      <Box mb={8}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Buscar despesas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Box>

      {filteredExpenses.length === 0 ? (
        <Text textAlign="center" color="gray.500" py={8}>
          Nenhuma despesa encontrada.
        </Text>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Data</Th>
                <Th>Descrição</Th>
                <Th isNumeric>Valor</Th>
                <Th width="100px">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredExpenses.map((expense) => (
                <Tr key={expense.id}>
                  <Td>{formatDate(expense.created_at)}</Td>
                  <Td>{expense.description}</Td>
                  <Td isNumeric>{formatCurrency(expense.amount)}</Td>
                  <Td>
                    <IconButton
                      aria-label="Editar despesa"
                      icon={<FiEdit2 />}
                      size="sm"
                      colorScheme="brand"
                      variant="ghost"
                      mr={2}
                      onClick={() => handleEdit(expense)}
                    />
                    <IconButton
                      aria-label="Excluir despesa"
                      icon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDelete(expense)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      <ExpenseModal
        isOpen={isOpen}
        onClose={onClose}
        expense={currentExpense}
      />
    </Container>
  );
};

export default Expenses; 