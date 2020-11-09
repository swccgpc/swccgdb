import React from 'react';
import {h} from 'preact';

export function CardListPager({page, setPage, cardCount, isFooter}) {
  const handleClick = (event) => {
    event.preventDefault();
    const newPage = event.target.name == 'prev' ? page - 1 : page + 1;
    setPage(newPage);
    if (isFooter) {
      document.getElementById('inventory').scrollIntoView({
        block: 'start',
        inline: 'nearest',
        behavior: 'smooth',
      });
    }
  }

  const prev = page > 1 ? <li><a href="#" name='prev' class='pager--prev' onClick={handleClick}>« prev</a></li> : '';
  const next = (page * 100) - 1 < cardCount ? <li><a href="#" name='next' class='pager--next' onClick={handleClick}>next »</a></li> : '';
  const colClass = isFooter ? 'col-sm-12' : 'col-sm-4';

  return (
    <div class={`${colClass} text-right inventory-pager`}>
      <ul class="pager">
        {prev}
        {next}
      </ul>
    </div>
  );
}
