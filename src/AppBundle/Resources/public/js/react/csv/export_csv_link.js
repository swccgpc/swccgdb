import React, {useState, useEffect, useRef} from 'react';
import {h} from 'preact';
import {buildCSVURI} from './helpers';

export function ExportCSVLink({data, filename}) {
  const [downloadingCSV, setDownloadingCSV] = useState(false);
  const [downloadURL, setDownloadURL] = useState('');
  const csvDownloadLink = useRef(null);

  const handleClick = (e) => {
    e.preventDefault();
    const csvData = formatCSVData(data);
    setDownloadURL(buildCSVURI(csvData));
    setDownloadingCSV(true);
  }

  useEffect(() => {
    if (downloadingCSV) {
      csvDownloadLink.current.click();
      setDownloadingCSV(false);
    }
  }, [downloadingCSV, downloadURL]);

  return (
    <>
      <a class="btn btn-default btn-xs" href="#" onClick={handleClick}>
        <span class="fa fa-download"></span> Export
      </a>
      <a ref={csvDownloadLink} download={filename} href={downloadURL}></a>
    </>
  );
}

function formatCSVData(data) {
  const columns = {
    code: 'Code',
    label: 'Name',
    side_name: 'Side',
    set_name: 'Set',
    type_name: 'Type',
    subtype_name: 'Sub-type',
    inventory_qty: 'Qty',
  };

  return data.map(card => {
    const csvCard = {};
    Object.entries(columns).forEach(([key, label]) => {
      csvCard[label] = card[key];
    });
    return csvCard;
  });
}
