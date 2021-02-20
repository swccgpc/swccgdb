import React, {useState} from 'react';
import {h} from 'preact';

export function CardListFilterSets({sets, selectedSets, setSelectedSets}) {
  const handleChange = (event) => {
    const name = event.target.name;
    if (event.target.checked) {
      selectedSets.push(name);
      if (name === 'all' || name === 'allplusvirtual') {
        selectedSets = [name];
      } else {
        removeSelectedSet('all');
        removeSelectedSet('allplusvirtual');
      }
    } else {
      removeSelectedSet(name);
    }
    setSelectedSets([...selectedSets]);
  }

  const removeSelectedSet = (name) => {
    const index = selectedSets.indexOf(name);
    if (index !== -1) {
      selectedSets.splice(index, 1);
    }
  }

  const handleClick = (event) => {
    event.stopPropagation();
  }

  const setsFilters = sets.map(set => {
    const isChecked = selectedSets.includes(set.code);
    return (
      <li>
        <label onClick={handleClick}>
          <input
            key={set.code}
            type="checkbox"
            name={set.code}
            checked={isChecked}
            onChange={handleChange}
          />
          {set.name}
        </label>
      </li>
    );
  });
  return (
    <div class="inventory-sets btn-group">
      <button type="button" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Sets <span class="caret"></span></button>
      <ul class="dropdown-menu pull-right" data-filter="set_code" title="Filter by set">
        {setsFilters}
      </ul>
    </div>
  );
}
