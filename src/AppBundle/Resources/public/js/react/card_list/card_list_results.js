import React, {useState} from 'react';
import {h} from 'preact';
import {CardListTable} from './card_list_table';
import {CardListGrid} from './card_list_grid';

export function CardListResults({selectedDisplay, cards, sort, setSort, setOpenedCard, cardActions}) {
  let resultComponent = '';
  if (selectedDisplay == 'table') {
    resultComponent = (
      <CardListTable
        cards={cards}
        sort={sort}
        setSort={setSort}
        setOpenedCard={setOpenedCard}
        cardActions={cardActions}
      />
    );
  } else {
    resultComponent = (
      <CardListGrid
        selectedDisplay={selectedDisplay}
        cards={cards}
        sort={sort}
        setSort={setSort}
        setOpenedCard={setOpenedCard}
        cardActions={cardActions}
      />
    );
  }
  return resultComponent;
}
