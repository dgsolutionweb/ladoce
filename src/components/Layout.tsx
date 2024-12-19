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
  Image,
  Divider,
  Tooltip,
  Badge,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiHome, FiShoppingBag, FiDollarSign, FiBarChart2, FiTarget, FiEdit2, FiCreditCard, FiUser, FiBell, FiSettings } from 'react-icons/fi';
import { useApp } from '../contexts/AppContext';
import { formatCurrency } from '../utils/format';
import GoalModal from './GoalModal';

interface NavItemProps {
  icon: any;
  children: string;
  to: string;
  badge?: number;
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isGoalModalOpen, onOpen: onGoalModalOpen, onClose: onGoalModalClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const { sales, monthlyGoal } = useApp();
  const location = useLocation();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const sidebarBg = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const currentMonthSales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    const today = new Date();
    return saleDate.getMonth() === today.getMonth() && 
           saleDate.getFullYear() === today.getFullYear();
  }).reduce((total, sale) => total + sale.total_amount, 0);

  const goalProgress = (currentMonthSales / monthlyGoal) * 100;

  const NavItem = ({ icon, children, to, badge }: NavItemProps) => {
    const isActive = location.pathname === to;
    const activeBg = useColorModeValue('brand.50', 'brand.900');
    const activeColor = useColorModeValue('brand.600', 'brand.200');
    const hoverBg = useColorModeValue('gray.100', 'gray.700');

    return (
      <Link to={to} style={{ width: '100%' }}>
        <Tooltip label={children} placement="right" hasArrow>
          <HStack
            align="center"
            px={4}
            py={3}
            cursor="pointer"
            borderRadius="xl"
            transition="all 0.2s"
            bg={isActive ? activeBg : 'transparent'}
            color={isActive ? activeColor : undefined}
            _hover={{
              bg: isActive ? activeBg : hoverBg,
              transform: 'translateX(4px)',
            }}
          >
            <Icon as={icon} boxSize={5} />
            <Text fontWeight={isActive ? "semibold" : "medium"}>{children}</Text>
            {badge && (
              <Badge
                ml="auto"
                colorScheme="brand"
                variant="solid"
                borderRadius="full"
                fontSize="xs"
              >
                {badge}
              </Badge>
            )}
          </HStack>
        </Tooltip>
      </Link>
    );
  };

  const SidebarContent = () => (
    <VStack align="stretch" h="full" spacing={0}>
      <Box px={6} py={8}>
        <HStack spacing={3} mb={2}>
          <Box
            bg="brand.500"
            w="40px"
            h="40px"
            borderRadius="xl"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text color="white" fontSize="xl" fontWeight="bold">
              L
            </Text>
          </Box>
          <Box>
            <Text fontSize="2xl" fontWeight="bold">
              La Doce
            </Text>
            <Text fontSize="sm" color={textColor}>
              Sistema de Gestão
            </Text>
          </Box>
        </HStack>
      </Box>

      <VStack align="stretch" flex={1} spacing={2} px={4}>
        <NavItem icon={FiHome} to="/">Dashboard</NavItem>
        <NavItem icon={FiDollarSign} to="/sales">Vendas</NavItem>
        <NavItem icon={FiShoppingBag} to="/products">Produtos</NavItem>
        <NavItem icon={FiCreditCard} to="/expenses">Despesas</NavItem>
        <NavItem icon={FiBarChart2} to="/reports">Relatórios</NavItem>
      </VStack>

      <Divider my={4} />

      <Box px={4} pb={8}>
        <Box
          p={4}
          bg={bgColor}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={borderColor}
          transition="all 0.2s"
          _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
        >
          <Flex justify="space-between" align="center" mb={2}>
            <HStack>
              <Icon as={FiTarget} color="brand.500" />
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
            colorScheme={goalProgress >= 100 ? 'green' : 'brand'}
            borderRadius="full"
            size="sm"
            mb={2}
            hasStripe={goalProgress < 100}
            isAnimated={goalProgress < 100}
          />

          <Text fontSize="sm" color="gray.500">
            Meta: {formatCurrency(monthlyGoal)}
          </Text>
        </Box>

        <Box mt={4}>
          <HStack
            p={4}
            bg={bgColor}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
            spacing={3}
          >
            <Avatar size="sm" name="User" bg="brand.500" />
            <Box flex={1}>
              <Text fontWeight="medium" fontSize="sm">
                Administrador
              </Text>
              <Text fontSize="xs" color={textColor}>
                admin@ladoce.com
              </Text>
            </Box>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiSettings />}
                variant="ghost"
                size="sm"
                aria-label="Opções"
              />
              <MenuList>
                <MenuItem icon={<FiUser />}>Perfil</MenuItem>
                <MenuItem icon={<FiBell />}>Notificações</MenuItem>
                <MenuItem icon={<FiSettings />}>Configurações</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
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
          bg={sidebarBg}
          borderRightWidth="1px"
          borderColor={borderColor}
          position="fixed"
          h="100vh"
          overflowY="auto"
          css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'gray.300',
              borderRadius: '24px',
            },
          }}
        >
          <SidebarContent />
        </Box>
      )}

      {/* Mobile drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="full">
        <DrawerOverlay backdropFilter="blur(4px)" />
        <DrawerContent bg={sidebarBg}>
          <DrawerCloseButton />
          <DrawerBody p={0}>
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
            justify="space-between"
            borderBottomWidth="1px"
            borderColor={borderColor}
            bg={bgColor}
            position="sticky"
            top={0}
            zIndex={10}
          >
            <HStack>
              <IconButton
                aria-label="Menu"
                icon={<FiMenu />}
                onClick={onOpen}
                variant="ghost"
              />
              <Text fontSize="lg" fontWeight="bold">La Doce</Text>
            </HStack>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiUser />}
                variant="ghost"
                size="sm"
                aria-label="Usuário"
              />
              <MenuList>
                <MenuItem icon={<FiUser />}>Perfil</MenuItem>
                <MenuItem icon={<FiBell />}>Notificações</MenuItem>
                <MenuItem icon={<FiSettings />}>Configurações</MenuItem>
              </MenuList>
            </Menu>
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