import React, {useState, useEffect, useRef} from 'react';
import {h} from 'preact';
import ReactModal from 'react-modal';
import axios from 'axios';

export function ImportCSVLink() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState();
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(true);
  }

  const handleCloseModal = () => {
    setIsOpen(false);
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof file === 'undefined') {
      setError('Please select a file to upload.');
    } else if (file.type !== 'text/csv') {
      setError('Only CSV imports are supported.');
    } else {
      setIsProcessing(true);
      setError('');
      uploadFile(file)
        .then(response => {
          setIsProcessing(false);
          setIsComplete(true);
        })
        .catch(error => {
          let errorMessage = 'Inventory import failed. Please try again!';
          if (error.response) {
            errorMessage = error.response.data;
          }
          setIsProcessing(false);
          setError(errorMessage);
        });
    }
  }

  const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    return axios.post(Routing.generate('inventory_import'), formData, config);
  }

  useEffect(() => {
    setError('');
  }, [isOpen]);

  useEffect(() => {
    if (isComplete) {
      setTimeout(() => location.reload(), 2000);
    }
  }, [isComplete]);

  const successMessage = isComplete ? <div class="alert alert-success" role="alert">Inventory import is complete!</div> : '';
  const errorMessage = error !== '' ? <div class="alert alert-danger" role="alert">{error}</div> : '';
  const processingMessage = isProcessing ? <div class="alert alert-warning" role="alert">The import is being processed...<span class="icon-loader"><span></span><span></span><span></span></span></div> : '';

  return (
    <>
      <a class="btn btn-default btn-xs" href="#" onClick={handleClick}>
        <span class="fa fa-upload"></span> Import
      </a>
      <ReactModal
        isOpen={isOpen}
        contentLabel="Inventory Import"
        className="modal-dialog"
        overlayClassName="modal-backdrop"
        onRequestClose={handleCloseModal}
      >
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" onClick={handleCloseModal} data-dismiss="modal" aria-hidden="true">×</button>
            <h3 class="modal-title">Import Inventory</h3>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12">
                {successMessage}
                {errorMessage}
                {processingMessage}
                <form onSubmit={handleSubmit}>
                  <div class="form-group">
                    <label for="upfile">File</label>
                    <input class="form-control" type="file" name="upfile" onChange={handleFileChange} />
                    <small>"code" and "qty" columns are required.</small>
                  </div>
                  <div class="pull-right">
                    <button type="submit" class="btn btn-success" disabled={isProcessing}>Upload</button>
                    <button type="button" class="btn btn-default" onClick={handleCloseModal} disabled={isProcessing}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </ReactModal>
    </>
  );
}
