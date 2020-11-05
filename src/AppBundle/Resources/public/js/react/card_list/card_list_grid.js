import React, {useState} from 'react';
import {h} from 'preact';
import {CardListGridItem} from './card_list_grid_item';

export function CardListGrid({selectedDisplay, cards, sort, setSort, setOpenedCard, cardActions}) {
  const headers = {
    name: "Name",
    type_code: "Type",
  };

  const handleClick = (event) => {
    event.preventDefault();
    const header = event.target.name;
    const desc = 1;
    const asc = -1;
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
    const caret = sort.hasOwnProperty(key) ? <span class="caret"></span> : '';
    const caretDir = sort.hasOwnProperty(key) && sort[key] == -1 ? 'dropup' : '';
    return (
      <th class={`${key} ${caretDir}`}>
        <a href="#" name={key} onClick={handleClick}>{value}</a>
        {caret}
      </th>
    );
  });

  const renderedCards = cards.map(card => 
    <CardListGridItem
      key={card.code}
      selectedDisplay={selectedDisplay}
      card={card}
      setOpenedCard={setOpenedCard}
      cardActions={cardActions}
    />
  );

  return (
    <div class="row" id="collection">
      <div class="col-sm-12">
        <table class="table table-condensed table-hover" style="margin-bottom:10px">
          <thead>
            <tr>
              {renderedHeaders}
            </tr>
          </thead>
        </table>
      </div>
      <div id="collection-grid" class="col-sm-12">
        {renderedCards}
      </div>
    </div>
  );
}
