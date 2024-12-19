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
import { useState } from 'react';
import { useApp } from '../contexts/AppContext';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoal?: number;
}

const GoalModal = ({ isOpen, onClose, currentGoal }: GoalModalProps) => {
  const [targetAmount, setTargetAmount] = useState(currentGoal?.toString() || '');
  const { updateMonthlyGoal, loading } = useApp();
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      const amount = parseFloat(targetAmount);
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: 'Erro',
          description: 'Por favor, insira um valor válido maior que zero',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      await updateMonthlyGoal(amount);
      
      toast({
        title: 'Meta atualizada',
        description: 'A meta mensal foi atualizada com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao atualizar meta',
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
        <ModalHeader>Definir Meta Mensal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Valor da Meta</FormLabel>
              <InputGroup>
                <InputLeftAddon>R$</InputLeftAddon>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
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
          <Button
            colorScheme="purple"
            onClick={handleSubmit}
            isLoading={loading}
          >
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GoalModal; 