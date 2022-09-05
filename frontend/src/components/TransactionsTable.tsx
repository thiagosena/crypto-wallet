import React from 'react';
import { Table, TableCaption, Tbody, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { Transaction } from '../interfaces/Transaction';
import TransactionItem from './TransactionItem';

export default function TransactionsTable({ transactions }: { transactions: Array<Transaction> }) {
  return (
    <VStack>
      <Text> Recent Transactions</Text>
      <Table size="sm" variant="striped" colorScheme="blackAlpha" width={20}>
        <TableCaption>All crypto buy and sell records</TableCaption>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Symbol</Th>
            <Th>Amount</Th>
            <Th>Number of Coins</Th>
            <Th>Price Purchased At</Th>
            <Th>Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transactions.map((transaction: Transaction, key: any) => {
            return (
              <TransactionItem key={key} transaction={transaction} />
            );
          })}
        </Tbody>
      </Table>
    </VStack>
  );
}
