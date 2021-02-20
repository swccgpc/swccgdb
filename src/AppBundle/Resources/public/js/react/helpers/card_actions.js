import React from 'react';
import {h} from 'preact';
import axios from 'axios';

export function getCardActions(cards, setCards) {
  return {
    decrement: generateDecrementCardFn(cards, setCards),
    increment: generateIncrementCardFn(cards, setCards),
  };
}

function generateDecrementCardFn(cards, setCards) {
  return (card) => {
    axios.get(Routing.generate('inventory_remove', {card_code: card.code})).then((response) => {
      if (card.inventory_qty > 0) {
        const cardIndex = cards.findIndex((el) => el.code == card.code);
        cards[cardIndex].inventory_qty = card.inventory_qty - 1;
        setCards([...cards]);
      }
    });
  };
}

function generateIncrementCardFn(cards, setCards) {
  return (card) => {
    axios.get(Routing.generate('inventory_add', {card_code: card.code})).then((response) => {
      const cardIndex = cards.findIndex((el) => el.code == card.code);
      cards[cardIndex].inventory_qty = card.inventory_qty + 1;
      setCards([...cards]);
    });
  };
}
