import React from 'react';
import {h} from 'preact';

export function CardAddRemoveButtons({card, cardActions}) {
  return (
    <div class="btn-group">
      <button type="button" class="btn btn-default btn-lg btn-card-remove" title="Remove from inventory" onClick={() => cardActions.decrement(card)}>
        <span class="fa fa-minus"></span>
      </button>
      <button type="button" class="btn btn-default btn-lg btn-card-add" title="Add to inventory" onClick={() => cardActions.increment(card)}>
        <span class="fa fa-plus"></span>
      </button>
    </div>
  );
}
