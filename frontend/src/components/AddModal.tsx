import React, { useState } from 'react';
import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, VStack } from '@chakra-ui/react';

export default function AddModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [type, setType] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [transactionDate, setTransactionDate] = useState<string>('');
  const [pricePurchasedAt, setPricePurchasedAt] = useState<string>('');
  const [numberOfCoins, setNumberOfCoins] = useState<string>('');

  const addTransaction = () => {
    const payload = JSON.stringify({
      name: name,
      symbol: symbol,
      type: type,
      time_transacted: Date.parse(transactionDate) / 1000,
      price_purchased_at: pricePurchasedAt,
      no_of_coins: numberOfCoins,
    });
    console.log(payload);
    fetch('http://127.0.0.1:5000/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    })
      .then((response) => response.json())
      .then((data) => {
        onClose();
      });
  };

  const options = [
    { value: 0, label: 'Sell' },
    { value: 1, label: 'Buy' },
  ];

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>Add Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={8}>
              <Select focusBorderColor="tomato"
                      onChange={(e) => setType(e.target.value)}
                      variant={'flushed'}>
                <option value="1">Buy</option>
                <option value="0">Sell</option>
              </Select>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                focusBorderColor="tomato"
                variant="flushed"
                placeholder="Name"
              />
              <Input
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                focusBorderColor="tomato"
                variant="flushed"
                placeholder="Symbol"
              />
              <Input
                value={pricePurchasedAt}
                onChange={(e) => setPricePurchasedAt(e.target.value)}
                focusBorderColor="tomato"
                variant="flushed"
                placeholder="Price Purchased At"
              />
              <Input
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                focusBorderColor="tomato"
                variant="flushed"
                placeholder="Transaction Date (MM-DD-YYYY)"
              />
              <Input
                value={numberOfCoins}
                onChange={(e) => setNumberOfCoins(e.target.value)}
                focusBorderColor="tomato"
                variant="flushed"
                placeholder="Number of Coins"
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              bg="tomato"
              color="white"
              mr={3}
              size="lg"
              onClick={addTransaction}
            >
              Add Transaction
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
