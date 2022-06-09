import React from 'react';
import {h} from 'preact';

export function filterCards(cards, sets, selectedSets, types, inInventory, selectedSide, searchText, sorts) {
  let filteredCards = filterBySide(cards, selectedSide);
  filteredCards = filterBySet(filteredCards, sets, selectedSets); 
  filteredCards = filterByType(filteredCards, types);
  filteredCards = filterByInInventory(filteredCards, inInventory);
  filteredCards = filterBySearchText(filteredCards, searchText);
  sortCards(filteredCards, sorts);
  return filteredCards;
}

function filterBySide(cards, side) {
  if (side !== 'all') {
    return cards.filter(card => card.side_code == side);
  }
  return cards
}

function filterBySet(cards, sets, selectedSets) {
  if (selectedSets.length > 0 && !selectedSets.includes('allplusvirtual')) {
    if (selectedSets.includes('all')) {
      const nonVirtualSetCycles = [1, 2];
      return cards.filter(card => {
        const set = sets.find(set => set.code == card.set_code);
        return nonVirtualSetCycles.includes(set.cycle_position)
      });
    }
    else {
      return cards.filter(card => selectedSets.includes(card.set_code));
    }
  }
  return cards;
}

function filterByType(cards, types) {
    if (types.length > 0) {
      return cards.filter(card => types.includes(card.type_code));
    }
    return cards;
  }

function filterByInInventory(cards, inInventory) {
  if (inInventory == 'in') {
    return cards.filter(card => card.inventory_qty > 0);
  }
  else if (inInventory == 'not_in') {
    return cards.filter(card => card.inventory_qty == 0);
  }
  return cards;
}

function filterBySearchText(cards, searchText) {
  if (searchText != '') {
    const text = new RegExp(searchText, 'i');
    return cards.filter(card => card.name.match(text));
  }
  return cards;
}

function sortCards(cards, sorts) {
  Object.entries(sorts).forEach(([sortName, sortValue]) => {
    const sortLower = sortValue == -1 ? 1 : -1;
    const sortHigher = sortValue == -1 ? -1 : 1;
    cards.sort((cardA, cardB) => {
      let aValue = cardA[sortName];
      let bValue = cardB[sortName];
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      if (aValue > bValue) {
        return sortHigher;
      }
      if (aValue < bValue) {
        return sortLower;
      }
      return 0;
    });
  });
}

export function formatName(card) {
  var text = card.name;
  if (! card.name.includes('•')) { text = (card.uniqueness ? formatUniqueness(card) : '') + card.name; }
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
  text = text.replace(new RegExp("\\\\n", "g"), "<br />");
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
