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
  Select,
  VStack,
  useToast,
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

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (expense) {
      setDescription(expense.description);
      setAmount(expense.amount.toString());
      setCategory(expense.category);
      setDate(new Date(expense.date).toISOString().slice(0, 10));
    } else {
      setDescription('');
      setAmount('');
      setCategory('');
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [expense]);

  const handleSubmit = async () => {
    try {
      const expenseData = {
        description,
        amount: Number(amount),
        category,
        date: new Date(date).toISOString(),
      };

      if (expense) {
        await updateExpense({ ...expenseData, id: expense.id });
        toast({
          title: 'Despesa atualizada',
          description: 'A despesa foi atualizada com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await addExpense(expenseData);
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Digite a descrição"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Valor</FormLabel>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Categoria</FormLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Selecione a categoria"
              >
                <option value="Aluguel">Aluguel</option>
                <option value="Energia">Energia</option>
                <option value="Água">Água</option>
                <option value="Internet">Internet</option>
                <option value="Insumos">Insumos</option>
                <option value="Equipamentos">Equipamentos</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Marketing">Marketing</option>
                <option value="Salários">Salários</option>
                <option value="Impostos">Impostos</option>
                <option value="Outros">Outros</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Data</FormLabel>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
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