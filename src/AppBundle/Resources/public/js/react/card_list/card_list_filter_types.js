import React from 'react';
import {h} from 'preact';

export function CardListFilterTypes({selectedSide,selectedTypes, setSelectedTypes}) {
  const types = {
    'location': 'Location',
    'character': 'Character',
    'starship': 'Starship',
    'vehicle': 'Vehicle',
    'weapon': 'Weapon',
    'device': 'Device',
    'effect': 'Effect',
    'interrupt': 'Interrupt',
    'admirals-order': 'Admiral\'s Orders',
  };

  const handleClick = (event) => {
    const name = event.target.getAttribute('name');
    if (!selectedTypes.includes(name)) {
      selectedTypes.push(name);
      if (name === 'character') {
        selectedTypes.push('creature');
      }
    } else {
      const index = selectedTypes.indexOf(name);
      if (index !== -1) {
        selectedTypes.splice(index, 1);
        if (name === 'character') {
          const charIndex = selectedTypes.indexOf('creature');
          selectedTypes.splice(charIndex, 1);
        }
      }
    }
    setSelectedTypes([...selectedTypes]);
  };

  const side = selectedSide == 'all' ? 'light' : selectedSide;
  const typeButtons = Object.entries(types).map(([key, value]) => {
    const isChecked = selectedTypes.includes(key);
    let icon = 'icon-' + key;
    if (key == 'location' || key == 'character') {
      icon = icon + '-' + side;
    }
    return (
      <label
        class="btn btn-default btn-sm"
        title={value}
        name={key}
        onClick={handleClick}
      >
        <input
          key={key}
          type="checkbox"
          name={key}
          checked={isChecked}
        />
        <span name={key} class={`icon ${icon}`}></span>
      </label>
    );
  });


  return (
    <div class="btn-group btn-group-justified" data-toggle="buttons">
      {typeButtons}
    </div>
  );
}
