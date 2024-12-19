import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Select,
  Switch,
  VStack,
  Text,
  HStack,
  useBreakpointValue,
  Card,
  CardBody,
  Stack,
  useToast,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/format';
import { Product, SaleProduct } from '../types';

interface SelectedProduct extends SaleProduct {
  name: string;
  total: number;
}

const Sales = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const { products, loading, addSale } = useApp();
  const toast = useToast();

  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [currentProduct, setCurrentProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isDelivery, setIsDelivery] = useState<boolean>(false);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  const handleAddProduct = () => {
    if (!currentProduct || quantity < 1) {
      toast({
        title: 'Erro',
        description: 'Selecione um produto e quantidade válida',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const product = products.find(p => p.id === Number(currentProduct));
    if (!product) return;

    const newProduct: SelectedProduct = {
      product_id: product.id,
      quantity,
      price_at_time: product.sale_price,
      name: product.name,
      total: product.sale_price * quantity
    };

    setSelectedProducts(prev => [...prev, newProduct]);
    setCurrentProduct('');
    setQuantity(1);
  };

  const handleRemoveProduct = (index: number) => {
    setSelectedProducts(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const subtotal = selectedProducts.reduce((acc, curr) => acc + curr.total, 0);
    const currentDeliveryFee = isDelivery ? deliveryFee : 0;
    return {
      subtotal,
      deliveryFee: currentDeliveryFee,
      total: subtotal + currentDeliveryFee
    };
  };

  const handleFinishSale = async () => {
    if (selectedProducts.length === 0) {
      toast({
        title: 'Erro',
        description: 'Adicione pelo menos um produto',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: 'Erro',
        description: 'Selecione uma forma de pagamento',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const { total } = calculateTotal();
      const sale = {
        date: new Date().toISOString(),
        products: selectedProducts,
        payment_method: paymentMethod as 'cash' | 'credit' | 'debit' | 'pix',
        delivery: isDelivery,
        total_amount: total,
      };

      await addSale(sale);
      
      toast({
        title: 'Venda realizada',
        description: 'Venda registrada com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setSelectedProducts([]);
      setCurrentProduct('');
      setQuantity(1);
      setIsDelivery(false);
      setDeliveryFee(0);
      setPaymentMethod('');
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao registrar venda',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeliveryFeeChange = (value: string) => {
    const fee = Number(value);
    if (fee >= 0) {
      setDeliveryFee(fee);
    }
  };

  const totals = calculateTotal();

  return (
    <Box maxW="1200px" mx="auto">
      <Heading mb={6} fontSize={{ base: "xl", md: "2xl" }}>Nova Venda</Heading>

      <Grid
        templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
        gap={6}
      >
        {/* Product Selection Form */}
        <Card>
          <CardBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Produto</FormLabel>
                <Select
                  placeholder="Selecione o produto"
                  value={currentProduct}
                  onChange={(e) => setCurrentProduct(e.target.value)}
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {formatCurrency(product.sale_price)}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Quantidade</FormLabel>
                <Input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </FormControl>

              <Button
                colorScheme="purple"
                w={{ base: "full", md: "auto" }}
                onClick={handleAddProduct}
                isLoading={loading}
              >
                Adicionar Produto
              </Button>

              {/* Products List */}
              <Box mt={4}>
                <Text fontWeight="bold" mb={2}>
                  Produtos Selecionados
                </Text>
                <Card variant="outline">
                  <CardBody>
                    {selectedProducts.length === 0 ? (
                      <Text color="gray.500">Nenhum produto selecionado</Text>
                    ) : (
                      <VStack align="stretch" spacing={3}>
                        {selectedProducts.map((product, index) => (
                          <HStack key={index} justify="space-between">
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="medium">{product.name}</Text>
                              <Text fontSize="sm" color="gray.600">
                                {product.quantity}x {formatCurrency(product.price_at_time)}
                              </Text>
                            </VStack>
                            <HStack>
                              <Text fontWeight="bold">
                                {formatCurrency(product.total)}
                              </Text>
                              <Button
                                size="sm"
                                colorScheme="red"
                                onClick={() => handleRemoveProduct(index)}
                              >
                                Remover
                              </Button>
                            </HStack>
                          </HStack>
                        ))}
                      </VStack>
                    )}
                  </CardBody>
                </Card>
              </Box>
            </Stack>
          </CardBody>
        </Card>

        {/* Sale Summary */}
        <Card>
          <CardBody>
            <Stack spacing={4}>
              <Heading size="md">Resumo da Venda</Heading>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb={0}>Entrega?</FormLabel>
                <Switch
                  colorScheme="purple"
                  isChecked={isDelivery}
                  onChange={(e) => setIsDelivery(e.target.checked)}
                />
              </FormControl>

              {isDelivery && (
                <FormControl>
                  <FormLabel>Taxa de Entrega</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>R$</InputLeftAddon>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={deliveryFee}
                      onChange={(e) => handleDeliveryFeeChange(e.target.value)}
                      placeholder="0.00"
                    />
                  </InputGroup>
                </FormControl>
              )}

              <FormControl>
                <FormLabel>Forma de Pagamento</FormLabel>
                <Select
                  placeholder="Selecione a forma de pagamento"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="cash">Dinheiro</option>
                  <option value="credit">Cartão de Crédito</option>
                  <option value="debit">Cartão de Débito</option>
                  <option value="pix">PIX</option>
                </Select>
              </FormControl>

              <Card variant="outline">
                <CardBody>
                  <Stack spacing={2}>
                    <HStack justify="space-between">
                      <Text>Subtotal:</Text>
                      <Text>{formatCurrency(totals.subtotal)}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text>Taxa de Entrega:</Text>
                      <Text>{formatCurrency(totals.deliveryFee)}</Text>
                    </HStack>
                    <HStack justify="space-between" fontWeight="bold">
                      <Text>Total:</Text>
                      <Text>{formatCurrency(totals.total)}</Text>
                    </HStack>
                  </Stack>
                </CardBody>
              </Card>

              <Button 
                colorScheme="green" 
                size="lg"
                width="full"
                onClick={handleFinishSale}
                isLoading={loading}
              >
                Finalizar Venda
              </Button>
            </Stack>
          </CardBody>
        </Card>
      </Grid>
    </Box>
  );
};

export default Sales; 