import React from 'react';
import {h} from 'preact';
import {CardListPager} from './card_list_pager';

export function CardListInfo({page, setPage, cards, inInventory}) {
  const cardCount = cards.length;
  let invCards = [];
  if (inInventory !== 'not_in') {
    invCards = cards.filter(card => card.inventory_qty != 0);
  }
  const invCardsCount = invCards.length;
  let invCardsQty = 0;
  if (inInventory !== 'not_in' && invCardsCount > 0) {
    invCardsQty = invCards.reduce((acc, cur) => acc + cur.inventory_qty, 0);
  }

  return (
    <div class="row inventory-info">
      <div class="col-sm-9 inventory-totals">
        <ol class="breadcrumb">
          <li># Cards <span class="badge">{cardCount}</span></li>
          <li>In Inventory <span class="badge">{invCardsCount}</span></li>
          <li>Inventory Qty <span class="badge">{invCardsQty}</span></li>
        </ol>
      </div>
      <CardListPager page={page} setPage={setPage} cardCount={cardCount} />
    </div>
  );
}
