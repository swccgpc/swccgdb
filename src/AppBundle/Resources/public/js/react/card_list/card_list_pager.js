import React from 'react';
import {h} from 'preact';

export function CardListPager({page, setPage, cardCount}) {
  const handleClick = (event) => {
    event.preventDefault();
    const newPage = event.target.name == 'prev' ? page - 1 : page + 1;
    setPage(newPage);
  }

  const prev = page > 1 ? <li><a href="#" name='prev' class='pager--prev' onClick={handleClick}>« prev</a></li> : '';
  const next = (page * 100) - 1 < cardCount ? <li><a href="#" name='next' class='pager--next' onClick={handleClick}>next »</a></li> : '';
  
  return (
    <div class="col-sm-6 text-right inventory-pager">
      <ul class="pager">
        {prev}
        {next}
      </ul>
    </div>
  );
}
