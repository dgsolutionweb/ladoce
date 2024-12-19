import { Center, Spinner, Text, VStack } from '@chakra-ui/react';

interface LoadingProps {
  message?: string;
}

const Loading = ({ message = 'Carregando...' }: LoadingProps) => {
  return (
    <Center h="100vh">
      <VStack spacing={4}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="purple.500"
          size="xl"
        />
        <Text color="gray.600">{message}</Text>
      </VStack>
    </Center>
  );
};

export default Loading; 