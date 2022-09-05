import * as React from 'react';
import { Button, Center, ChakraProvider, Heading, Text, theme, VStack } from '@chakra-ui/react';

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Center bg={'black'} color={'white'} padding={8}>
        <VStack spacing={7}>
          <Heading>Crypto Portfolio</Heading>
          <Text>This is the current state of your portfolio</Text>
          <Button size={'lg'} colorScheme={'teal'} onClick={() => null}>
            Add Transaction
          </Button>
        </VStack>
      </Center>
    </ChakraProvider>
  );
};
