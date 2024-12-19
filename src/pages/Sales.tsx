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
  useToast,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
} from '@chakra-ui/react';
import { FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import { useApp } from '../contexts/AppContext';
import { formatCurrency, formatDate } from '../utils/format';
import { useState } from 'react';
import { Sale } from '../types';

const Sales = () => {
  const { sales, deleteSale } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  const handleDelete = async (sale: Sale) => {
    if (window.confirm(`Tem certeza que deseja excluir esta venda?`)) {
      try {
        await deleteSale(sale.id);
        toast({
          title: 'Venda excluída',
          description: 'A venda foi excluída com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Erro',
          description: error instanceof Error ? error.message : 'Erro ao excluir venda',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const filteredSales = sales
    .filter(sale =>
      sale.products.some(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg">Vendas</Heading>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="brand"
          as="a"
          href="/sales/new"
        >
          Nova Venda
        </Button>
      </Flex>

      <Box mb={8}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Buscar vendas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Box>

      {filteredSales.length === 0 ? (
        <Text textAlign="center" color="gray.500" py={8}>
          Nenhuma venda encontrada.
        </Text>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Data</Th>
                <Th>Produtos</Th>
                <Th>Pagamento</Th>
                <Th>Entrega</Th>
                <Th isNumeric>Total</Th>
                <Th width="100px">Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredSales.map((sale) => (
                <Tr key={sale.id}>
                  <Td>{formatDate(sale.created_at)}</Td>
                  <Td>
                    <Box>
                      {sale.products.map((product, index) => (
                        <Text key={index} fontSize="sm">
                          {product.quantity}x {product.name}
                        </Text>
                      ))}
                    </Box>
                  </Td>
                  <Td>
                    <Badge colorScheme="brand" variant="subtle">
                      {sale.payment_method}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={sale.delivery ? "green" : "gray"} variant="subtle">
                      {sale.delivery ? "Sim" : "Não"}
                    </Badge>
                  </Td>
                  <Td isNumeric>{formatCurrency(sale.total)}</Td>
                  <Td>
                    <IconButton
                      aria-label="Excluir venda"
                      icon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDelete(sale)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Container>
  );
};

export default Sales; 