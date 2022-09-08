import React from 'react';

import { Td, Tr } from '@chakra-ui/react';
import { Transaction } from '../interfaces/Transaction';

export default function TransactionItem({ transaction }: { transaction: Transaction }) {
  return (
    <Tr color={transaction.type === 1 ? 'blue.300' : 'red.300'}>
      <Td>{transaction.name}</Td>
      <Td>{transaction.symbol}</Td>
      <Td isNumeric>R$ {transaction.amount.toLocaleString()}</Td>
      <Td isNumeric>{transaction.no_of_coins}</Td>
      <Td isNumeric>R$ {transaction.price_purchased_at.toLocaleString()}</Td>
      <Td isNumeric>{transaction.time_transacted}</Td>
      <Td isNumeric>{transaction.type === 1 ? 'BUY' : 'SELL'}</Td>
    </Tr>
  );
}
