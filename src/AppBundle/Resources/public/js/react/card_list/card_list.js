import React, {useState, useEffect} from 'react';
import {h} from 'preact';
import ReactTooltip from 'react-tooltip';
import {CardListFilters} from './card_list_filters';
import {CardListInfo} from './card_list_info';
import {CardListResults} from './card_list_results';
import {CardTooltip} from './card_tooltip';
import {CardModal} from './card_modal';
import {findCards} from '../helpers/card';
import {getCardActions} from '../helpers/card_actions';

export function CardList({data}) {
  const [sets, setSets] = useState(() => {
    return data.sets.find({}, {
      $orderBy: {
        cycle_position: 1,
        position: 1
      }
    });
  });
  const [cards, setCards] = useState([]);
  const [selectedSets, setSelectedSets] = useState(() => sets.map(set => set.code));
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [inInventory, setInInventory] = useState('in');
  const [selectedSide, setSelectedSide] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({
    name: 1,
    type_code: 1,
  });
  const [openedCard, setOpenedCard] = useState(null);
  const [selectedDisplay, setSelectedDisplay] = useState('table');

  const cardActions = getCardActions(data.cards, cards, setCards);

  const getCardsToShow = () => {
    const start = (page - 1) * 100;
    const end = (page * 100) - 1;
    return cards.slice(start, end);
  }

  useEffect(() => {
    const filteredCards = findCards(data.cards, selectedSets, selectedTypes, inInventory, selectedSide, searchText, sort);
    setCards(filteredCards);
    setPage(1);
  }, [selectedSets, selectedTypes, inInventory, selectedSide, searchText, sort]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [cards, page, selectedDisplay]);

  return (
    <>
      <CardListFilters
        sets={sets}
        selectedSets={selectedSets}
        setSelectedSets={setSelectedSets}
        inInventory={inInventory}
        setInInventory={setInInventory}
        selectedSide={selectedSide}
        setSelectedSide={setSelectedSide}
        searchText={searchText}
        setSearchText={setSearchText}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        selectedDisplay={selectedDisplay}
        setSelectedDisplay={setSelectedDisplay}
      />
      <CardListInfo
        page={page}
        setPage={setPage}
        cards={cards}
        inInventory={inInventory}
      />
      <CardListResults
        selectedDisplay={selectedDisplay}
        cards={getCardsToShow()}
        sort={sort}
        setSort={setSort}
        setOpenedCard={setOpenedCard}
        cardActions={cardActions}
      />
      <CardTooltip cardDB={data.cards} />
      <CardModal openedCard={openedCard} setOpenedCard={setOpenedCard} />
    </>
  );
}
