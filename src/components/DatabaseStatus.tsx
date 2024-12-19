import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Box,
} from '@chakra-ui/react';
import { useSupabase } from '../hooks/useSupabase';

const DatabaseStatus = () => {
  const { isConnected, isLoading, error } = useSupabase();

  if (isLoading) {
    return (
      <Box textAlign="center" p={4}>
        <Spinner />
      </Box>
    );
  }

  if (!isConnected || error) {
    return (
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Erro de Conexão
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          {error?.message || 'Não foi possível conectar ao banco de dados. Por favor, tente novamente mais tarde.'}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default DatabaseStatus; 