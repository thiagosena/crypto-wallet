import React from 'react';
import { Container, HStack, Text, VStack } from '@chakra-ui/react';

export default function Summary({
  portfolioCost,
  portfolioValue,
  absoluteGain,
  totalGainPercent,
}: { portfolioCost: number, portfolioValue: number, absoluteGain: number, totalGainPercent: number }) {
  return (
    <HStack spacing={6}>
      <Container bg="dodgerblue">
        <VStack width={40}>
          <Text fontSize="2xl">
            R$ {Number(portfolioCost.toFixed(2)).toLocaleString()}
          </Text>
          <Text fontSize="xs" size="md">
            Portfolio Cost
          </Text>
        </VStack>
      </Container>
      <Container bg="tomato">
        <VStack width={40}>
          <Text fontSize="2xl">
            R$ {Number(portfolioValue.toFixed(2)).toLocaleString()}
          </Text>
          <Text fontSize="xs">Portfolio Value</Text>
        </VStack>
      </Container>
      <Container bg="tomato">
        <VStack width={40}>
          <Text fontSize="2xl">
            R$ {Number(absoluteGain.toFixed(2)).toLocaleString()}
          </Text>
          <Text fontSize="xs"> Absolute Gain / Loss </Text>
        </VStack>
      </Container>
      <Container bg="tomato">
        <VStack width={40}>
          <Text fontSize="2xl">{totalGainPercent.toFixed(2)} %</Text>
          <Text fontSize="xs">Gain / Loss %</Text>
        </VStack>
      </Container>
    </HStack>
  );
}
