import React from 'react';

import { Td, Tr } from '@chakra-ui/react';
import { Transaction } from '../interfaces/Transaction';

export default function TransactionItem({ transaction }: { transaction: Transaction }) {
  return (
    <Tr>
      <Td>{transaction.name}</Td>
      <Td>{transaction.symbol}</Td>
      <Td isNumeric>R$ {transaction.amount.toLocaleString()}</Td>
      <Td isNumeric>{transaction.no_of_coins}</Td>
      <Td isNumeric>R$ {transaction.price_purchased_at.toLocaleString()}</Td>
      <Td isNumeric>{transaction.time_transacted}</Td>
    </Tr>
  );
}
