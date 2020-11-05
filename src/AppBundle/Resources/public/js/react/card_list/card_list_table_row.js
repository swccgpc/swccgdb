import React from 'react';
import {h} from 'preact';
import {CardAddRemoveButtons} from './card_add_remove_buttons';

export function CardListTableRow({card, setOpenedCard, cardActions}) {
  const handleCardClick = (event) => {
    if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) {
      event.stopPropagation();
    } else {
      event.preventDefault();
      setOpenedCard(card);
    }
  }

  return (
    <tr class="card-row">
      <td class="actions">
        <CardAddRemoveButtons card={card} cardActions={cardActions} />
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
