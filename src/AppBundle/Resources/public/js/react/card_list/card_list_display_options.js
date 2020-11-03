import React from 'react';
import {h} from 'preact';

export function CardListDisplayOptions({selectedDisplay, setSelectedDisplay}) {
  const options = {
    'table': 'Display as table',
    'two-columns': 'Display on 2 columns',
    'three-columns': 'Display on 3 columns',
  };

  const handleChange = (event) => {
    setSelectedDisplay(event.target.name);
  }

  const handleClick = (event) => {
    event.stopPropagation();
  }

  const filterOptions = Object.entries(options).map(([key, value]) => {
    const isChecked = key == selectedDisplay ? true : false;
    return (
      <li>
        <label onClick={handleClick}>
          <input
            key={key}
            type="radio"
            name={key}
            checked={isChecked}
            onChange={handleChange}
          />
          {value}
        </label>
      </li>
    );
  });
  return (
    <div class="inventory-options btn-group">
      <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Options <span class="caret"></span></button>
      <ul class="dropdown-menu pull-right" id="config-options">
        {filterOptions}
      </ul>
    </div>
  );
}
