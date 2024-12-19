import {
  Box,
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  useBreakpointValue,
  IconButton,
  Flex,
  Text,
  VStack,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useApp } from '../contexts/AppContext';
import ProductModal from '../components/ProductModal';
import { formatCurrency } from '../utils/format';
import { useRef, useState } from 'react';
import { Product } from '../types';

const Products = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { products, loading, deleteProduct } = useApp();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const toast = useToast();

  // Delete dialog
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    onOpen();
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      toast({
        title: 'Produto excluído',
        description: 'O produto foi excluído com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro ao excluir',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleteOpen(false);
      setProductToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    onClose();
  };

  const handleNewProduct = () => {
    setSelectedProduct(null);
    onOpen();
  };

  return (
    <Box>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
        mb={6}
        gap={4}
      >
        <Heading fontSize={{ base: "xl", md: "2xl" }}>Produtos</Heading>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="purple"
          width={{ base: "full", md: "auto" }}
          onClick={handleNewProduct}
          isLoading={loading}
        >
          Novo Produto
        </Button>
      </Flex>

      <Box bg="white" p={{ base: 2, md: 6 }} borderRadius="lg" shadow="sm" overflowX="auto">
        {isMobile ? (
          // Mobile view - card layout
          <VStack spacing={4} align="stretch">
            {products.map((product) => (
              <Box
                key={product.id}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                position="relative"
              >
                <VStack align="stretch" spacing={2}>
                  <Text fontWeight="bold">{product.name}</Text>
                  <Text>Preço de Custo: {formatCurrency(product.cost_price)}</Text>
                  <Text>Preço de Venda: {formatCurrency(product.sale_price)}</Text>
                  <Text>Estoque: {product.stock_quantity}</Text>
                  <HStack spacing={2} mt={2}>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      leftIcon={<FiEdit2 />}
                      width="full"
                      onClick={() => handleEdit(product)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      leftIcon={<FiTrash2 />}
                      width="full"
                      onClick={() => handleDelete(product)}
                    >
                      Excluir
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </VStack>
        ) : (
          // Desktop view - table layout
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th isNumeric>Preço de Custo</Th>
                <Th isNumeric>Preço de Venda</Th>
                <Th isNumeric>Estoque</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {products.map((product) => (
                <Tr key={product.id}>
                  <Td>{product.name}</Td>
                  <Td isNumeric>{formatCurrency(product.cost_price)}</Td>
                  <Td isNumeric>{formatCurrency(product.sale_price)}</Td>
                  <Td isNumeric>{product.stock_quantity}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        leftIcon={<FiEdit2 />}
                        onClick={() => handleEdit(product)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        leftIcon={<FiTrash2 />}
                        onClick={() => handleDelete(product)}
                      >
                        Excluir
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      <ProductModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Excluir Produto
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja excluir o produto "{productToDelete?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Products; 