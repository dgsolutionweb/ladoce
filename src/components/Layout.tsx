import {
  Box,
  Flex,
  Icon,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useBreakpointValue,
  Container,
  Stat,
  StatLabel,
  StatNumber,
  Progress,
  Button,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiHome, FiShoppingBag, FiDollarSign, FiBarChart2, FiTarget, FiEdit2, FiCreditCard } from 'react-icons/fi';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/format';
import GoalModal from './GoalModal';

interface NavItemProps {
  icon: any;
  children: string;
  to: string;
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isGoalModalOpen, onOpen: onGoalModalOpen, onClose: onGoalModalClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const { sales, monthlyGoal } = useApp();
  const location = useLocation();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const currentMonthSales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    const today = new Date();
    return saleDate.getMonth() === today.getMonth() && 
           saleDate.getFullYear() === today.getFullYear();
  }).reduce((total, sale) => total + sale.total_amount, 0);

  const goalProgress = (currentMonthSales / monthlyGoal) * 100;

  const NavItem = ({ icon, children, to }: NavItemProps) => {
    const isActive = location.pathname === to;
    const activeBg = useColorModeValue('purple.50', 'purple.900');
    const activeColor = useColorModeValue('purple.700', 'purple.200');
    const hoverBg = useColorModeValue('gray.100', 'gray.700');

    return (
      <Link to={to} style={{ width: '100%' }}>
        <HStack
          align="center"
          px={4}
          py={3}
          cursor="pointer"
          borderRadius="md"
          transition="all 0.2s"
          bg={isActive ? activeBg : 'transparent'}
          color={isActive ? activeColor : undefined}
          _hover={{
            bg: isActive ? activeBg : hoverBg,
          }}
        >
          <Icon as={icon} boxSize={5} />
          <Text fontWeight={isActive ? "semibold" : "medium"}>{children}</Text>
        </HStack>
      </Link>
    );
  };

  const SidebarContent = () => (
    <VStack align="stretch" spacing={1}>
      <NavItem icon={FiHome} to="/">Dashboard</NavItem>
      <NavItem icon={FiDollarSign} to="/sales">Vendas</NavItem>
      <NavItem icon={FiShoppingBag} to="/products">Produtos</NavItem>
      <NavItem icon={FiCreditCard} to="/expenses">Despesas</NavItem>
      <NavItem icon={FiBarChart2} to="/reports">Relatórios</NavItem>

      <Box pt={8} px={4}>
        <Box
          p={4}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Flex justify="space-between" align="center" mb={2}>
            <HStack>
              <Icon as={FiTarget} color="purple.500" />
              <Text fontWeight="medium">Meta Mensal</Text>
            </HStack>
            <IconButton
              aria-label="Editar meta"
              icon={<FiEdit2 />}
              size="sm"
              variant="ghost"
              onClick={onGoalModalOpen}
            />
          </Flex>

          <Stat mb={2}>
            <StatLabel>Progresso</StatLabel>
            <StatNumber fontSize="lg">{formatCurrency(currentMonthSales)}</StatNumber>
          </Stat>

          <Progress
            value={goalProgress}
            colorScheme={goalProgress >= 100 ? 'green' : 'purple'}
            borderRadius="full"
            size="sm"
            mb={2}
          />

          <Text fontSize="sm" color="gray.500">
            Meta: {formatCurrency(monthlyGoal)}
          </Text>
        </Box>
      </Box>
    </VStack>
  );

  return (
    <Flex h="100vh">
      {/* Sidebar for desktop */}
      {!isMobile && (
        <Box
          w="280px"
          bg={bgColor}
          borderRightWidth="1px"
          borderColor={borderColor}
          py={8}
          position="fixed"
          h="100vh"
          overflowY="auto"
        >
          <SidebarContent />
        </Box>
      )}

      {/* Mobile drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <SidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main content */}
      <Box
        ml={isMobile ? 0 : "280px"}
        w={isMobile ? "100%" : "calc(100% - 280px)"}
        bg={useColorModeValue('gray.50', 'gray.900')}
        minH="100vh"
      >
        {isMobile && (
          <Flex
            px={4}
            py={4}
            align="center"
            borderBottomWidth="1px"
            borderColor={borderColor}
            bg={bgColor}
            position="sticky"
            top={0}
            zIndex={10}
          >
            <IconButton
              aria-label="Menu"
              icon={<FiMenu />}
              onClick={onOpen}
              variant="ghost"
            />
          </Flex>
        )}
        <Container maxW="container.xl" py={8}>
          {children}
        </Container>
      </Box>

      <GoalModal isOpen={isGoalModalOpen} onClose={onGoalModalClose} />
    </Flex>
  );
};

export default Layout; 