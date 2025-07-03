import React from 'react';

const Topbar = () => {
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('🔗 Link copied to clipboard!');
    } catch (err) {
      alert('❌ Failed to copy link.');
    }
  };

  const handleExport = () => {
    const table = document.querySelector('table');
    if (!table) return;

    let csv = '';
    const rows = table.querySelectorAll('tr');
    rows.forEach((row) => {
      const cols = row.querySelectorAll('th, td');
      const rowData = Array.from(cols)
        .slice(0, -1) // exclude delete column
        .map((cell) => `"${cell.textContent?.trim()}"`)
        .join(',');
      csv += rowData + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white px-6 py-3 shadow border-b flex items-center justify-between">
      <h1 className="text-lg font-semibold">SmartSheet AI</h1>
      <div className="space-x-3">
        <button
          onClick={handleShare}
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm active:scale-95 transition cursor-pointer"
        >
          🔗 Share
        </button>
        <button
          onClick={handleExport}
          className="px-3 py-1 bg-gray-200 text-sm rounded-md active:scale-95 transition cursor-pointer"
        >
          📦 Export
        </button>
      </div>
    </div>
  );
};

export default Topbar;
