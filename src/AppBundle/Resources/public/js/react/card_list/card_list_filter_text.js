import React, {useState, useEffect} from 'react';
import {h} from 'preact';
import {useDebounce} from '../helpers/use_debounce';

export function CardListFilterText({searchText, setSearchText}) {
  const [text, setText] = useState(searchText);

  const debouncedText = useDebounce(text, 500);

  useEffect(() => {
    setSearchText(debouncedText);
  }, [debouncedText]);

  const handleChange = (event) => {
    setText(event.target.value);
  }

  return (
    <input type="text" class="form-control" placeholder="Filter the list" tabindex="1" onChange={handleChange} />
  );
}
