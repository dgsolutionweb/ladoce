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
} from '@chakra-ui/react';
import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Product } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

const ProductModal = ({ isOpen, onClose, product }: ProductModalProps) => {
  const { addProduct, updateProduct } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: product?.name || '',
    cost_price: product?.cost_price || '',
    sale_price: product?.sale_price || '',
    stock_quantity: product?.stock_quantity || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const productData = {
        name: formData.name,
        cost_price: Number(formData.cost_price),
        sale_price: Number(formData.sale_price),
        stock_quantity: Number(formData.stock_quantity),
      };

      if (product?.id) {
        await updateProduct({ ...productData, id: product.id });
        toast({
          title: 'Produto atualizado',
          description: 'O produto foi atualizado com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await addProduct(productData);
        toast({
          title: 'Produto adicionado',
          description: 'O produto foi adicionado com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      onClose();
      setFormData({
        name: '',
        cost_price: '',
        sale_price: '',
        stock_quantity: '',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onEsc={() => !isLoading && onClose()}
      closeOnOverlayClick={!isLoading}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {product ? 'Editar Produto' : 'Novo Produto'}
        </ModalHeader>
        <ModalCloseButton isDisabled={isLoading} />
        
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nome</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nome do produto"
                isDisabled={isLoading}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Preço de Custo</FormLabel>
              <Input
                name="cost_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.cost_price}
                onChange={handleChange}
                placeholder="0.00"
                isDisabled={isLoading}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Preço de Venda</FormLabel>
              <Input
                name="sale_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.sale_price}
                onChange={handleChange}
                placeholder="0.00"
                isDisabled={isLoading}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Quantidade em Estoque</FormLabel>
              <Input
                name="stock_quantity"
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={handleChange}
                placeholder="0"
                isDisabled={isLoading}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={onClose}
            isDisabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            {product ? 'Salvar' : 'Adicionar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProductModal; 