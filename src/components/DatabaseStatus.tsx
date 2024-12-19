import { useEffect } from 'react';
import {
  Box,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  VStack,
  Code,
} from '@chakra-ui/react';
import useSupabase from '../hooks/useSupabase';

const DatabaseStatus = () => {
  const { isConnected, isLoading, error, supabase } = useSupabase();

  useEffect(() => {
    if (error) {
      console.error('Erro de conexão:', error);
    }
  }, [error]);

  if (isLoading) {
    return (
      <Box
        position="fixed"
        top={4}
        right={4}
        maxW="sm"
        bg="white"
        p={4}
        borderRadius="md"
        shadow="lg"
        zIndex={1000}
      >
        <VStack align="start" spacing={2}>
          <Box display="flex" alignItems="center">
            <Spinner size="sm" mr={2} />
            <Text fontWeight="bold">Verificando conexão com o banco de dados...</Text>
          </Box>
          <Text fontSize="sm" color="gray.600">
            Aguarde enquanto testamos a conexão com o Supabase
          </Text>
        </VStack>
      </Box>
    );
  }

  if (error || !isConnected) {
    return (
      <Alert
        status="error"
        variant="solid"
        position="fixed"
        top={4}
        right={4}
        width="auto"
        maxW="sm"
        borderRadius="md"
        shadow="lg"
        zIndex={1000}
      >
        <AlertIcon />
        <Box>
          <AlertTitle>Erro na conexão</AlertTitle>
          <AlertDescription display="block">
            <Text fontSize="sm">Não foi possível conectar ao banco de dados</Text>
            {error && (
              <Code mt={2} display="block" whiteSpace="pre-wrap" fontSize="xs">
                {error}
              </Code>
            )}
          </AlertDescription>
        </Box>
      </Alert>
    );
  }

  return (
    <Alert
      status="success"
      variant="subtle"
      position="fixed"
      top={4}
      right={4}
      width="auto"
      maxW="sm"
      borderRadius="md"
      shadow="lg"
      zIndex={1000}
    >
      <AlertIcon />
      <Box>
        <AlertTitle>Conectado</AlertTitle>
        <AlertDescription>
          <Text fontSize="sm">Conexão com o banco de dados estabelecida</Text>
        </AlertDescription>
      </Box>
    </Alert>
  );
};

export default DatabaseStatus; 