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
import ProductModal from '../components/ProductModal';
import { Product } from '../types';
import { formatCurrency } from '../utils/format';

const Products = () => {
  const { products, deleteProduct } = useApp();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    onOpen();
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
      try {
        await deleteProduct(product.id);
        toast({
          title: 'Produto excluído',
          description: 'O produto foi excluído com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Erro',
          description: error instanceof Error ? error.message : 'Erro ao excluir produto',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleAddNew = () => {
    setCurrentProduct(null);
    onOpen();
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg">Produtos</Heading>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="brand"
          onClick={handleAddNew}
        >
          Novo Produto
        </Button>
      </Flex>

      <Box mb={8}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Box>

      {filteredProducts.length === 0 ? (
        <Text textAlign="center" color="gray.500" py={8}>
          Nenhum produto encontrado.
        </Text>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Descrição</Th>
                <Th isNumeric>Preço</Th>
                <Th isNumeric>Estoque</Th>
                <Th width="100px">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredProducts.map((product) => (
                <Tr key={product.id}>
                  <Td>{product.name}</Td>
                  <Td>{product.description || '-'}</Td>
                  <Td isNumeric>{formatCurrency(product.price)}</Td>
                  <Td isNumeric>{product.stock_quantity}</Td>
                  <Td>
                    <IconButton
                      aria-label="Editar produto"
                      icon={<FiEdit2 />}
                      size="sm"
                      colorScheme="brand"
                      variant="ghost"
                      mr={2}
                      onClick={() => handleEdit(product)}
                    />
                    <IconButton
                      aria-label="Excluir produto"
                      icon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDelete(product)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      <ProductModal
        isOpen={isOpen}
        onClose={onClose}
        product={currentProduct}
      />
    </Container>
  );
};

export default Products; 