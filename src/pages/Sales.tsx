import {
  Box,
  Button,
  Grid,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { FiShoppingCart, FiSearch, FiPlus, FiMoreVertical, FiTrash2, FiCalendar } from 'react-icons/fi';
import { useApp } from '../contexts/AppContext';
import { formatCurrency, formatDate } from '../utils/format';
import { useState } from 'react';
import { Sale } from '../types';

const Sales = () => {
  const { sales, deleteSale } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const bgCard = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconBg = useColorModeValue('brand.50', 'brand.900');
  const iconColor = useColorModeValue('brand.600', 'brand.200');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const handleDelete = async (sale: Sale) => {
    if (window.confirm(`Tem certeza que deseja excluir esta venda?`)) {
      await deleteSale(sale.id);
    }
  };

  const filteredSales = sales
    .filter(sale =>
      sale.sale_items?.some(item =>
        item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const SaleCard = ({ sale }: { sale: Sale }) => (
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
            <Icon as={FiShoppingCart} boxSize={5} />
          </Box>
          <VStack align="start" spacing={1}>
            <HStack>
              <Text fontSize="lg" fontWeight="semibold">
                Venda #{sale.id}
              </Text>
              <Badge colorScheme="brand" variant="subtle">
                {sale.payment_method}
              </Badge>
            </HStack>
            <HStack spacing={2} color={textColor}>
              <Icon as={FiCalendar} boxSize={4} />
              <Text fontSize="sm">{formatDate(sale.date)}</Text>
            </HStack>
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
            <MenuItem icon={<FiTrash2 />} onClick={() => handleDelete(sale)} color="red.500">
              Excluir
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      <VStack align="stretch" spacing={4}>
        <Box>
          <Text fontSize="sm" color={textColor} mb={2}>
            Itens
          </Text>
          <VStack align="stretch" spacing={2}>
            {sale.sale_items?.map((item, index) => (
              <HStack key={index} justify="space-between">
                <Text fontSize="sm">
                  {item.quantity}x {item.product_name}
                </Text>
                <Text fontSize="sm" fontWeight="medium">
                  {formatCurrency(item.price_at_time * item.quantity)}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>

        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <Box>
            <Text fontSize="sm" color={textColor} mb={1}>
              Total
            </Text>
            <Text fontSize="md" fontWeight="semibold">
              {formatCurrency(sale.total_amount)}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" color={textColor} mb={1}>
              Itens
            </Text>
            <Text fontSize="md" fontWeight="semibold">
              {sale.sale_items?.reduce((total, item) => total + item.quantity, 0)}
            </Text>
          </Box>
        </Grid>
      </VStack>
    </Box>
  );

  return (
    <VStack spacing={8} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          Vendas
        </Text>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="brand"
          as="a"
          href="/sales/new"
        >
          Nova Venda
        </Button>
      </HStack>

      <Box>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Buscar vendas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {filteredSales.map(sale => (
          <SaleCard key={sale.id} sale={sale} />
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default Sales; 