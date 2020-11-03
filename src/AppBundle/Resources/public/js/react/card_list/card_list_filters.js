import React, {useState} from 'react';
import {h} from 'preact';
import {CardListFilterInInventory} from './card_list_filter_in_inventory';
import {CardListFilterSide} from './card_list_filter_side';
import {CardListFilterSets} from './card_list_filter_sets';
import {CardListDisplayOptions} from './card_list_display_options';
import {CardListFilterText} from './card_list_filter_text';
import {CardListFilterTypes} from './card_list_filter_types';

export function CardListFilters(props) {
  return (
    <>
    <div class="row" style="margin-bottom:10px">
      <div class="col-md-4">
        <CardListFilterInInventory
          inInventory={props.inInventory}
          setInInventory={props.setInInventory}
        />
      </div>
      <div class="col-md-4 text-center">
        <CardListFilterSide
          selectedSide={props.selectedSide}
          setSelectedSide={props.setSelectedSide}
        />
      </div>
      <div class="col-md-4 text-right">
        <CardListFilterSets
          sets={props.sets}
          selectedSets={props.selectedSets}
          setSelectedSets={props.setSelectedSets}
        />
        <CardListDisplayOptions 
          selectedDisplay={props.selectedDisplay}
          setSelectedDisplay={props.setSelectedDisplay}
        />
      </div>
    </div>

    <div class="row">
      <div class="col-sm-12" style="margin-bottom:10px">
        <CardListFilterText
          searchText={props.searchText}
          setSearchText={props.setSearchText}
        />
      </div>
      <div class="col-sm-12" style="margin-bottom:10px">
        <CardListFilterTypes 
          selectedSide={props.selectedSide}
          selectedTypes={props.selectedTypes}
          setSelectedTypes={props.setSelectedTypes}
        />
      </div>
    </div>
    </>
  );
}
