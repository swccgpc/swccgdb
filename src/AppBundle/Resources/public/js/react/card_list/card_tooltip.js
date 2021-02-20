import React from 'react';
import {h} from 'preact';
import ReactTooltip from 'react-tooltip';
import {formatName, formatInfo, formatText, formatSet} from '../helpers/card';

export function CardTooltip({cards}) {
  return (
    <ReactTooltip
      id="card-tooltip"
      place="right"
      type="light"
      effect="solid"
      border={true}
      borderColor="rgba(0, 0, 0, 0.2)"
      backgroundColor="white"
      className="react-tooltip card-content qtip-thronesdb"
      getContent={(code) => {
        let card = cards.filter(card => card.code == code);
        if (card.length === 0) {
          return '';
        }
        card = card[0];
        const horizontalClass = (card.subtype_code == 'site' || card.is_horizontal) ? 'card-thumbnail-horizontal' : '';
        const image = card.image_url ? <div class={`card-thumbnail card-thumbnail-${card.type_code} ${horizontalClass}`} style={`background-image:url(${card.image_url})`}></div> : '';
        return (
          <>
            {image}
            <h4 class="card-name">{formatName(card)}</h4>
            <div class="card-info"><p>{formatInfo(card)}</p></div>
            <div class={`card-text border-${card.side_code}`}>{formatText(card)}</div>
            <div class="card-set">{formatSet(card)}</div>
          </>
        );
      }}
    />
  );
}
