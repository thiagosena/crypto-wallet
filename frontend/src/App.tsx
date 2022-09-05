import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button, Center, ChakraProvider, Heading, Text, theme, useDisclosure, VStack } from '@chakra-ui/react';
import Summary from './components/Summary';
import { Transaction } from './interfaces/Transaction';

export const App = () => {
  const [transactions, setTransactions] = useState<Array<Transaction>>([]);
  const [rollups, setRollups] = useState([]);
  const [portfolioCost, setPortfolioCost] = useState<number>(0.0);
  const [portfolioValue, setPortfolioValue] = useState<number>(0.0);
  const [absoluteGain, setAbsoluteGain] = useState<number>(0.0);
  const [totalGainPercent, setTotalGainPercent] = useState<number>(0.0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetch('http://127.0.0.1:5000/rollups')
      .then((response) => response.json())
      .then((data) => {
        setRollups(data);
        let costAccumulator = 0;
        let valueAccumulator = 0;
        data.forEach((item: any) => {
          costAccumulator += item['total_cost'];
          valueAccumulator += item['total_equity'];
        });
        let absoluteGain = valueAccumulator - costAccumulator;
        setPortfolioCost(costAccumulator);
        setPortfolioValue(valueAccumulator);
        setAbsoluteGain(absoluteGain);
        setTotalGainPercent((absoluteGain / costAccumulator) * 100);
      });
    fetch('http://127.0.0.1:5000/transactions')
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data);
      });

  }, [isOpen]);

  return (
    <ChakraProvider theme={theme}>
      <Center bg={'black'} color={'white'} padding={8}>
        <VStack spacing={7}>
          <Heading>Crypto Portfolio</Heading>
          <Text>This is the current state of your portfolio</Text>
          <Button size={'lg'} colorScheme={'teal'} onClick={onOpen}>
            Add Transaction
          </Button>
          <Summary portfolioCost={portfolioCost}
                   portfolioValue={portfolioValue}
                   absoluteGain={absoluteGain}
                   totalGainPercent={totalGainPercent} />
        </VStack>
      </Center>
    </ChakraProvider>
  );
};
