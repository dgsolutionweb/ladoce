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
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Product } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const ProductModal = ({ isOpen, onClose, product }: ProductModalProps) => {
  const { addProduct, updateProduct } = useApp();
  const toast = useToast();

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
  });

  useEffect(() => {
    if (product) {
      setProductData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        stock_quantity: product.stock_quantity.toString(),
      });
    } else {
      setProductData({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
      });
    }
  }, [product]);

  const handleSubmit = async () => {
    try {
      const data = {
        name: productData.name.trim(),
        description: productData.description.trim(),
        price: Number(productData.price),
        stock_quantity: Number(productData.stock_quantity),
      };

      if (product) {
        await updateProduct({ ...data, id: product.id });
        toast({
          title: 'Produto atualizado',
          description: 'O produto foi atualizado com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await addProduct(data);
        toast({
          title: 'Produto adicionado',
          description: 'O produto foi adicionado com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      onClose();
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao salvar produto',
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
        <ModalHeader>{product ? 'Editar Produto' : 'Novo Produto'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Nome</FormLabel>
              <Input
                value={productData.name}
                onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                placeholder="Digite o nome do produto"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Descrição</FormLabel>
              <Textarea
                value={productData.description}
                onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                placeholder="Digite a descrição do produto"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Preço</FormLabel>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={productData.price}
                onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                placeholder="0.00"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Quantidade em Estoque</FormLabel>
              <Input
                type="number"
                min="0"
                value={productData.stock_quantity}
                onChange={(e) => setProductData({ ...productData, stock_quantity: e.target.value })}
                placeholder="0"
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="brand" onClick={handleSubmit}>
            {product ? 'Atualizar' : 'Adicionar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProductModal; 