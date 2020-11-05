import React from 'react';
import {h} from 'preact';
import {ImportCSVLink} from '../csv/import_csv_link';
import {ExportCSVLink} from '../csv/export_csv_link';

export function CardListImportExportLinks({data}) {
  return (
    <div class="row inventory-export-import">
      <div class="col-md-12 text-right">
        <ImportCSVLink />
        <ExportCSVLink
          data={data}
          filename="inventory_export.csv"
        />
      </div>
    </div>
  );
}
