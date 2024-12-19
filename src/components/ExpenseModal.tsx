import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Expense } from '../types';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
}

const ExpenseModal = ({ isOpen, onClose, expense }: ExpenseModalProps) => {
  const { addExpense, updateExpense } = useApp();
  const toast = useToast();

  const [expenseData, setExpenseData] = useState({
    description: '',
    amount: '',
  });

  useEffect(() => {
    if (expense) {
      setExpenseData({
        description: expense.description,
        amount: expense.amount.toString(),
      });
    } else {
      setExpenseData({
        description: '',
        amount: '',
      });
    }
  }, [expense]);

  const handleSubmit = async () => {
    try {
      const data = {
        description: expenseData.description.trim(),
        amount: Number(expenseData.amount),
      };

      if (expense) {
        await updateExpense({ ...data, id: expense.id });
        toast({
          title: 'Despesa atualizada',
          description: 'A despesa foi atualizada com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await addExpense(data);
        toast({
          title: 'Despesa adicionada',
          description: 'A despesa foi adicionada com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      onClose();
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao salvar despesa',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalHeader>{expense ? 'Editar Despesa' : 'Nova Despesa'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Descrição</FormLabel>
              <Input
                value={expenseData.description}
                onChange={(e) => setExpenseData({ ...expenseData, description: e.target.value })}
                placeholder="Digite a descrição da despesa"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Valor</FormLabel>
              <InputGroup>
                <InputLeftAddon>R$</InputLeftAddon>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={expenseData.amount}
                  onChange={(e) => setExpenseData({ ...expenseData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </InputGroup>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="brand" onClick={handleSubmit}>
            {expense ? 'Atualizar' : 'Adicionar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExpenseModal; 