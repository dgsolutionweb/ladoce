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
import { Goal } from '../types';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
}

const GoalModal = ({ isOpen, onClose, goal }: GoalModalProps) => {
  const { addGoal, updateGoal } = useApp();
  const toast = useToast();

  const [goalData, setGoalData] = useState({
    description: '',
    target_amount: '',
    current_amount: '',
  });

  useEffect(() => {
    if (goal) {
      setGoalData({
        description: goal.description,
        target_amount: goal.target_amount.toString(),
        current_amount: goal.current_amount.toString(),
      });
    } else {
      setGoalData({
        description: '',
        target_amount: '',
        current_amount: '0',
      });
    }
  }, [goal]);

  const handleSubmit = async () => {
    try {
      const data = {
        description: goalData.description.trim(),
        target_amount: Number(goalData.target_amount),
        current_amount: Number(goalData.current_amount),
      };

      if (goal) {
        await updateGoal({ ...data, id: goal.id });
        toast({
          title: 'Meta atualizada',
          description: 'A meta foi atualizada com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await addGoal(data);
        toast({
          title: 'Meta adicionada',
          description: 'A meta foi adicionada com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      onClose();
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao salvar meta',
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
        <ModalHeader>{goal ? 'Editar Meta' : 'Nova Meta'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Descrição</FormLabel>
              <Input
                value={goalData.description}
                onChange={(e) => setGoalData({ ...goalData, description: e.target.value })}
                placeholder="Digite a descrição da meta"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Valor Alvo</FormLabel>
              <InputGroup>
                <InputLeftAddon>R$</InputLeftAddon>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={goalData.target_amount}
                  onChange={(e) => setGoalData({ ...goalData, target_amount: e.target.value })}
                  placeholder="0.00"
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Valor Atual</FormLabel>
              <InputGroup>
                <InputLeftAddon>R$</InputLeftAddon>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={goalData.current_amount}
                  onChange={(e) => setGoalData({ ...goalData, current_amount: e.target.value })}
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
            {goal ? 'Atualizar' : 'Adicionar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GoalModal; 