import React, {useState, useEffect} from 'react';
import {render} from 'react-dom';
import {h} from 'preact';
import {CardList} from './card_list/card_list';

function App(props) {
  return <CardList data={props.data} />;
}

$(document).on('final_data.app', () => {
  render(<App data={app.data} />, document.getElementById('inventory'));
});
