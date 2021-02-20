import React, {useState} from 'react';
import {h} from 'preact';
import {CardAddRemoveButtons} from './card_add_remove_buttons';

export function CardListGridItem({selectedDisplay, card, setOpenedCard, cardActions}) {
  const handleCardClick = (event) => {
    if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) {
      event.stopPropagation();
    } else {
      setOpenedCard(card);
    }
  }

  const columnClass = selectedDisplay == 'two-columns' ? 'col-sm-6' : 'col-sm-4';
  const HeaderTag = selectedDisplay == 'two-columns' ? 'h4' : 'h5';
  const QtyTag = selectedDisplay == 'two-columns' ? 'h5' : 'h6';

  return (
    <div class={columnClass}>
      <div class="media">
        <div class="media-left">
          <img class="media-object" src={card.image_url} alt={card.name} />
        </div>
        <div class="media-body">
          <HeaderTag class="media-heading">
            <a href={Routing.generate('cards_zoom', {card_code: card.code})} class="card no-popup" onClick={handleCardClick} data-tip={card.code} data-for="card-tooltip">{card.label}</a>
          </HeaderTag>
          <QtyTag>
            Qty: {card.inventory_qty}
          </QtyTag>
          <CardAddRemoveButtons card={card} cardActions={cardActions} />
        </div>
      </div>
    </div>
  );
}
