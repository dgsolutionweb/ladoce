import {
  Box,
  Button,
  Grid,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { FiPackage, FiSearch, FiPlus, FiMoreVertical, FiEdit2, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/format';
import ProductModal from '../components/ProductModal';
import { useState } from 'react';
import { Product } from '../types';

const Products = () => {
  const { products, deleteProduct } = useApp();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const bgCard = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconBg = useColorModeValue('brand.50', 'brand.900');
  const iconColor = useColorModeValue('brand.600', 'brand.200');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    onOpen();
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
      await deleteProduct(product.id);
    }
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    onOpen();
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ProductCard = ({ product }: { product: Product }) => (
    <Box
      p={6}
      bg={bgCard}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={borderColor}
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-4px)',
        shadow: 'lg',
      }}
    >
      <HStack justify="space-between" mb={4}>
        <HStack spacing={4}>
          <Box
            p={3}
            borderRadius="xl"
            bg={iconBg}
            color={iconColor}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={FiPackage} boxSize={5} />
          </Box>
          <VStack align="start" spacing={1}>
            <Text fontSize="lg" fontWeight="semibold">
              {product.name}
            </Text>
            <Text fontSize="sm" color={textColor} noOfLines={1}>
              {product.description || 'Sem descrição'}
            </Text>
          </VStack>
        </HStack>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FiMoreVertical />}
            variant="ghost"
            size="sm"
            aria-label="Opções"
          />
          <MenuList>
            <MenuItem icon={<FiEdit2 />} onClick={() => handleEdit(product)}>
              Editar
            </MenuItem>
            <MenuItem icon={<FiTrash2 />} onClick={() => handleDelete(product)} color="red.500">
              Excluir
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <Box>
          <Text fontSize="sm" color={textColor} mb={1}>
            Preço
          </Text>
          <Text fontSize="md" fontWeight="semibold">
            {formatCurrency(product.price)}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color={textColor} mb={1}>
            Estoque
          </Text>
          <HStack>
            <Text fontSize="md" fontWeight="semibold">
              {product.stock_quantity}
            </Text>
            {product.stock_quantity < 10 && (
              <Tooltip label="Estoque baixo" hasArrow>
                <Badge colorScheme="red" variant="subtle">
                  <Icon as={FiAlertCircle} />
                </Badge>
              </Tooltip>
            )}
          </HStack>
        </Box>
      </Grid>
    </Box>
  );

  return (
    <VStack spacing={8} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          Produtos
        </Text>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="brand"
          onClick={handleAdd}
        >
          Novo Produto
        </Button>
      </HStack>

      <Box>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </SimpleGrid>

      <ProductModal
        isOpen={isOpen}
        onClose={onClose}
        product={selectedProduct}
      />
    </VStack>
  );
};

export default Products; 