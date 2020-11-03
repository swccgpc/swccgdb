import React from 'react';
import {h} from 'preact';

export function CardListFilterSide({selectedSide, setSelectedSide}) {
  const options = {
    all: 'All',
    light: 'Light Side',
    dark: 'Dark Side',
  };

  const handleClick = (event) => {
    setSelectedSide(event.target.name);
  }

  const filterOptions = Object.entries(options).map(([key, value]) => {
    const isActive = key == selectedSide ? 'active' : '';
    return (
      <button
        type="button"
        class={`btn btn-default ${isActive}`}
        key={key}
        name={key}
        onClick={handleClick}
      >
        {value}
      </button>
    );
  });
  return (
    <>
      <div class="btn-group btn-group-xs">
        {filterOptions}
      </div>
    </>
  );
}
