import React from 'react';
import {h} from 'preact';
import axios from 'axios';

export function getCardActions(cardDB, cards, setCards) {
  return {
    decrement: generateDecrementCardFn(cardDB, cards, setCards),
    increment: generateIncrementCardFn(cardDB, cards, setCards),
  };
}

function generateDecrementCardFn(cardDB, cards, setCards) {
  return (card) => {
    axios.get(Routing.generate('inventory_remove', {card_code: card.code})).then((response) => {
      if (card.inventory_qty > 0) {
        const newQty = card.inventory_qty - 1;
        cardDB.updateById(card.code, {inventory_qty: newQty});
        const cardIndex = cards.findIndex((el) => el.code == card.code);
        cards[cardIndex].inventory_qty = newQty;
        setCards([...cards]);
      }
    });
  };
}

function generateIncrementCardFn(cardDB, cards, setCards) {
  return (card) => {
    axios.get(Routing.generate('inventory_add', {card_code: card.code})).then((response) => {
      const newQty = card.inventory_qty + 1;
      cardDB.updateById(card.code, {inventory_qty: newQty});
      const cardIndex = cards.findIndex((el) => el.code == card.code);
      cards[cardIndex].inventory_qty = newQty;
      setCards([...cards]);
    });
  };
}
