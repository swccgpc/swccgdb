import React from 'react';
import {h} from 'preact';

export function CardListFilterInInventory({inInventory, setInInventory}) {
  const options = {
    all: 'All',
    in: 'In Inventory',
    not_in: 'Not In Inventory',
  };

  const handleClick = (event) => {
    setInInventory(event.target.name);
  }

  const filterOptions = Object.entries(options).map(([key, value]) => {
    const isActive = key == inInventory ? 'active' : '';
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
