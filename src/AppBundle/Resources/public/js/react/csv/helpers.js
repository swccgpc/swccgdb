export function buildCSVURI(data, separator = ',', enclosingCharacter = '"') {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const type = isSafari ? 'application/csv' : 'text/csv';
  const csv = formatCSV(data, separator, enclosingCharacter);
  const blob = new Blob(['\uFEFF', csv], {type});
  const dataURI = `data:${type};charset=utf-8,\uFEFF${csv}`;
  const URL = window.URL || window.webkitURL;
  return (typeof URL.createObjectURL === 'undefined')
    ? dataURI
    : URL.createObjectURL(blob);
}

const elementOrEmpty = (element) => element || element === 0 ? element : '';

function formatCSV(data, separator = ',', enclosingCharacter = '"') {
  const headers = Object.keys(data[0]);
  const dataArray = data.map(object => Object.values(object));
  const csvData = [headers, ...dataArray]
  const csv = csvData.map(
    row => row
      .map((element) => elementOrEmpty(element))
      .map(column => `${enclosingCharacter}${column}${enclosingCharacter}`)
      .join(separator)
  )
  .join(`\n`);
  return csv;
}
