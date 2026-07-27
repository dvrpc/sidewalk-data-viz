const selectedAttributes = localStorage.getItem('state_selectedAttributes');

const handleDownload = () => {
  const items = JSON.parse(selectedAttributes);
  const fields = Object.keys(items);
  const values = Object.values(items);
  const geoid = items.geoid;

  const csv = [
    fields.join(','), // header row first
    values.join(','),
  ].join('\r\n');

  const csvData = new Blob([csv], { type: 'text/csv' });
  const csvURL = URL.createObjectURL(csvData);
  const link = document.createElement('a');
  link.href = csvURL;

  link.download = `eta_${geoid}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export { handleDownload };
