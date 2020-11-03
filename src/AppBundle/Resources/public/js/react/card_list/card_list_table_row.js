import React from 'react';
import {h} from 'preact';

export function CardListTableRow({card, setOpenedCard, cardActions}) {
  const handleCardClick = (event) => {
    if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) {
      event.stopPropagation();
    } else {
      setOpenedCard(card);
    }
  }

  return (
    <tr class="card-row">
      <td class="actions">
        <div class="btn-group">
          <button type="button" class="btn btn-default btn-sm btn-card-remove" title="Remove from inventory" onClick={() => cardActions.decrement(card)}>
            <span class="fa fa-minus"></span>
          </button>
          <button type="button" class="btn btn-default btn-sm btn-card-add" title="Add to inventory" onClick={() => cardActions.increment(card)}>
            <span class="fa fa-plus"></span>
          </button>
        </div>
      </td>
      <td class="name">
        <a href={Routing.generate('cards_zoom', {card_code: card.code})} class="card no-popup" onClick={handleCardClick} data-tip={card.code} data-for="card-tooltip">{card.label}</a>
      </td>
      <td class="type-code">
        {card.type_name}
      </td>
      <td class="side-code">
        {card.side_name}
      </td>
      <td class="qty">
        {card.inventory_qty}
      </td>
    </tr>
  );
}
