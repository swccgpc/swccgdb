import React from 'react';
import {h} from 'preact';

export function findCards(cardsDB, sets, types, inInventory, selectedSide, searchText, sort) {
  const filters = {};
  setSetsFilter(sets, filters);
  setTypesFilter(types, filters);
  setInInventoryFilter(inInventory, filters);
  setSideFilter(selectedSide, filters);
  setSearchTextFilter(searchText, filters);
  const orderBy = {
    $orderBy: sort,
  };
  return cardsDB.find(filters, orderBy);
}

function setSetsFilter(sets, filters) {
  if (sets.length > 0) {
    filters.set_code = {$in: sets};
  }
}

function setTypesFilter(types, filters) {
    if (types.length > 0) {
      filters.type_code = {$in: types};
    }
  }

function setInInventoryFilter(inInventory, filters) {
  if (inInventory == 'in') {
    filters.inventory_qty = {$gt: 0};
  }
  else if (inInventory == 'not_in') {
    filters.inventory_qty = {$eq: 0};
  }
}

function setSideFilter (side, filters) {
  if (side !== 'all') {
    filters.side_code = {$eq: side};
  }
}

function setSearchTextFilter (searchText, filters) {
  if (searchText != '') {
    filters.name = new RegExp(searchText, 'i');
  }
}

export function formatName(card) {
  const text = (card.uniqueness ? formatUniqueness(card) : '') + card.name;
  return <span dangerouslySetInnerHTML={{__html: text}} />
}

export function formatInfo(card) {
  let text = '';
  switch (card.type_code) {
    case 'effect':
    case 'interrupt':
    case 'weapon':
    case 'vehicle':
      if (card.subtype_name) {
        text += '<span class="card-subtype">' + card.subtype_name + ' </span>';
      }
      text += '<span class="card-type">' + card.type_name + '. </span>';
      break;
    case 'starship':
      text += '<span class="card-subtype">' + card.subtype_name + ': ' + card.model_type + '</span>';
      break;
    case 'creature':
      text += '<span class="card-subtype">' + card.model_type + ' ' + card.type_name + '</span>';
      break;
    default:
      if (card.subtype_name) {
        text += '<span class="card-subtype">' + card.subtype_name + '. </span>';
      } else {
        text += '<span class="card-type">' + card.type_name + '. </span>';
      }
      break;
  }
  return <span dangerouslySetInnerHTML={{__html: text}} />
}

export function formatSet(card) {
  return (
    <>
      <span class="set-name">{card.set_name}</span>, <span class="rarity-code">{card.rarity_code}</span>
    </>
  );
}

export function formatText(card) {
  let text = card.gametext || '';
  text = text.replace(/\[(\w+)\]/g, '<span class="icon-$1"></span>')
  text = text.split("\n").join('</p><p>');
  return <p dangerouslySetInnerHTML={{__html: text}} />;
}

export function formatUniqueness(card) {
  let text = card.uniqueness || '';
  text = text.replace(/\*/g, '&bull;');
  text = text.replace(/<>/g, '&loz;');
  return text + ' ';
}

export function formatTraits(card) {
  return card.traits || '';
}
