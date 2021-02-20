import React, {useState, useEffect} from 'react';
import {render} from 'react-dom';
import {h} from 'preact';
import axios from 'axios';
import {CardList} from './card_list/card_list';

function App(props) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [sets, setSets] = useState([]);
  const [cards, setCards] = useState([]);

  useEffect(async () => {
    const setsResponse = await axios.get(Routing.generate('api_sets'));
    const cardResponse = await axios.get(Routing.generate('api_cards'));
    const qtyResponse = await axios.get(Routing.generate('inventory_quantities'));
    const cardQtys = qtyResponse.data;
    const cardsWithQtys = cardResponse.data.map(card => {
      card.inventory_qty = 0;
      if (cardQtys.hasOwnProperty(card.code)) {
        card.inventory_qty = cardQtys[card.code];
      }
      return card;
    });
    const sets = [
      {
        name: 'All (no virtual)',
        code: 'all',
      },
      {
        name: 'All (with virtual)',
        code: 'allplusvirtual',
      },
    ];
    setSets(sets.concat(setsResponse.data));
    setCards(cardsWithQtys);
    setDataLoaded(true);
  }, []);

  if (dataLoaded) {
    return (
      <CardList 
        sets={sets}
        cards={cards}
        setCards={setCards}
      />
    );
  } else {
    return '';
  }
}

render(<App />, document.getElementById('inventory'));
