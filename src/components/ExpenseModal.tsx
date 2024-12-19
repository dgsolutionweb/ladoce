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
  Select,
  InputGroup,
  InputLeftAddon,
  Textarea,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useApp } from '../contexts/AppContext';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentExpense?: {
    id: number;
    description: string;
    amount: number;
    date: string;
    category: string;
  };
}

const EXPENSE_CATEGORIES = [
  'Matéria Prima',
  'Embalagens',
  'Equipamentos',
  'Marketing',
  'Entrega',
  'Funcionários',
  'Impostos',
  'Aluguel',
  'Água',
  'Luz',
  'Internet',
  'Outros'
];

const ExpenseModal = ({ isOpen, onClose, currentExpense }: ExpenseModalProps) => {
  const [description, setDescription] = useState(currentExpense?.description || '');
  const [amount, setAmount] = useState(currentExpense?.amount.toString() || '');
  const [date, setDate] = useState(currentExpense?.date || new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState(currentExpense?.category || '');
  
  const { addExpense, updateExpense, loading } = useApp();
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      const expenseAmount = parseFloat(amount);
      if (isNaN(expenseAmount) || expenseAmount <= 0) {
        toast({
          title: 'Erro',
          description: 'Por favor, insira um valor válido maior que zero',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (!description.trim() || !category) {
        toast({
          title: 'Erro',
          description: 'Por favor, preencha todos os campos',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const expenseData = {
        description: description.trim(),
        amount: expenseAmount,
        date,
        category
      };

      if (currentExpense) {
        await updateExpense({ ...expenseData, id: currentExpense.id });
      } else {
        await addExpense(expenseData);
      }
      
      toast({
        title: currentExpense ? 'Despesa atualizada' : 'Despesa registrada',
        description: currentExpense ? 'A despesa foi atualizada com sucesso' : 'A despesa foi registrada com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao registrar despesa',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {currentExpense ? 'Editar Despesa' : 'Nova Despesa'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Descrição</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva a despesa"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Categoria</FormLabel>
              <Select
                placeholder="Selecione a categoria"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Valor</FormLabel>
              <InputGroup>
                <InputLeftAddon>R$</InputLeftAddon>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </InputGroup>
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
          <Button
            colorScheme="purple"
            onClick={handleSubmit}
            isLoading={loading}
          >
            {currentExpense ? 'Atualizar' : 'Salvar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExpenseModal; 