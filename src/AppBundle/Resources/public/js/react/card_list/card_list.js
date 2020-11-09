import React, {useState, useEffect} from 'react';
import {h} from 'preact';
import ReactTooltip from 'react-tooltip';
import {CardListImportExportLinks} from './card_list_import_export_links';
import {CardListFilters} from './card_list_filters';
import {CardListInfo} from './card_list_info';
import {CardListResults} from './card_list_results';
import {CardListPager} from './card_list_pager';
import {CardTooltip} from './card_tooltip';
import {CardModal} from './card_modal';
import {filterCards} from '../helpers/card';
import {getCardActions} from '../helpers/card_actions';

export function CardList({sets, cards, setCards}) {
  const [filteredCards, setFilteredCards] = useState([]);
  const [selectedSets, setSelectedSets] = useState([]);
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

  const cardActions = getCardActions(cards, setCards);

  const getCardsToShow = () => {
    const start = (page - 1) * 100;
    const end = (page * 100) - 1;
    return filteredCards.slice(start, end);
  }

  useEffect(() => {
    const filteredCards = filterCards(cards, selectedSets, selectedTypes, inInventory, selectedSide, searchText, sort);
    setFilteredCards(filteredCards);
  }, [cards, selectedSets, selectedTypes, inInventory, selectedSide, searchText, sort]);

  useEffect(() => {
    setPage(1);
  }, [selectedSets, selectedTypes, inInventory, selectedSide, searchText, sort, selectedDisplay]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [filteredCards, page, selectedDisplay]);

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
        cards={filteredCards}
        inInventory={inInventory}
      />
      <CardListImportExportLinks data={filteredCards} />
      <CardListResults
        selectedDisplay={selectedDisplay}
        cards={getCardsToShow()}
        sort={sort}
        setSort={setSort}
        setOpenedCard={setOpenedCard}
        cardActions={cardActions}
      />
      <CardListPager
        page={page}
        setPage={setPage}
        cardCount={filteredCards.length}
        isFooter={true}
      />
      <CardTooltip cards={cards} />
      <CardModal
        openedCard={openedCard} 
        setOpenedCard={setOpenedCard}
        cardActions={cardActions}
      />
    </>
  );
}
