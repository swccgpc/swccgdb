import React from 'react';
import {h} from 'preact';
import ReactModal from 'react-modal';
import {formatName, formatInfo, formatText, formatSet, formatTraits} from '../helpers/card';

ReactModal.setAppElement('#inventory');

export function CardModal({openedCard, setOpenedCard}) {
  const handleCloseModal = () => {
    setOpenedCard(null);
  }

  const isOpen = openedCard !== null;

  if (!isOpen) {
    return '';
  }

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel="Card"
      className="modal-dialog"
      overlayClassName="modal-backdrop"
      onRequestClose={handleCloseModal}
    >
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal" aria-hidden="true">×</button>
          <h3 class="modal-title card-name">{formatName(openedCard)}</h3>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-6 modal-image hidden-xs">
              <img class="img-responsive" src={openedCard.image_url} />
            </div>
            <div class="col-sm-6">
              <div class="modal-info card-content">
                <div class="card-info"><p>{formatInfo(openedCard)}</p></div>
                <div class="card-traits">{formatTraits(openedCard)}</div>
                <div class={`card-text border-${openedCard.side_code}`}>{formatText(openedCard)}</div>
                <div class="card-set"><p>{formatSet(openedCard)}</p></div>
              </div>
              <div class="btn-group modal-qty" data-toggle="buttons">
                <button type="button" class="btn btn-default btn-sm btn-card-remove" data-command="-" title="Remove from inventory">
                  <span class="fa fa-minus"></span>
                </button>
                <button type="button" class="btn btn-default btn-sm btn-card-add" data-command="+" title="Add to inventory">
                  <span class="fa fa-plus"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <a role="button" href={Routing.generate('cards_zoom', {card_code: openedCard.code})} class="btn btn-default card-modal-link pull-left no-popup">Go to card page</a>
          <button type="button" class="btn btn-primary" onClick={handleCloseModal} data-dismiss="modal">Close</button>
        </div>
      </div>
    </ReactModal>
  );
}
