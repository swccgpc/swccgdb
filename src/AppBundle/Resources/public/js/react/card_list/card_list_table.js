import React, {useState} from 'react';
import {h} from 'preact';
import {CardListTableRow} from './card_list_table_row';

export function CardListTable({cards, sort, setSort, setOpenedCard, cardActions}) {
  const headers = {
    name: "Name",
    type_code: "Type",
    side_code: "Side",
    inventory_qty: "Qty",
  };

  const handleClick = (event) => {
    event.preventDefault();
    const header = event.target.name;
    const desc = header == 'inventory_qty' ? -1 : 1;
    const asc = header == 'inventory_qty' ? 1 : -1;
    let updatedSort = {};
    if (event.shiftKey) {
      updatedSort = Object.assign({}, sort);
    }
    if (sort.hasOwnProperty(header)) {
      if (sort[header] == desc) {
        updatedSort[header] = asc;
      } else {
        delete updatedSort[header];
      }
    } else {
      updatedSort[header] = desc;
    }
    setSort(updatedSort);
  }

  const renderedHeaders = Object.entries(headers).map(([key, value]) => {
    const asc = key == 'inventory_qty' ? 1 : -1;
    const caret = sort.hasOwnProperty(key) ? <span class="caret"></span> : '';
    const caretDir = sort.hasOwnProperty(key) && sort[key] == asc ? 'dropup' : '';
    return (
      <th class={`${key} ${caretDir}`}>
        <a href="#" name={key} onClick={handleClick}>{value}</a>
        {caret}
      </th>
    );
  });

  const cardRows = cards.map(card => 
    <CardListTableRow key={card.code} card={card} setOpenedCard={setOpenedCard} cardActions={cardActions} />
  );

  return (
    <div class="row" id="collection">
      <div class="col-sm-12">
        <table class="table table-condensed table-hover" style="margin-bottom:10px">
          <thead>
            <tr>
              <th class="actions"></th>
              {renderedHeaders}
            </tr>
          </thead>
          <tbody id="collection-table" class="collection">
            {cardRows}
          </tbody>
        </table>
      </div>
    </div>
  );
}
