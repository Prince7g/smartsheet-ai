//  Final Topbar.tsx with working Share + Export CSV + Export JSON

import React from 'react';

const Topbar = ({ data }: { data: any[] }) => { const handleShare = async () => { try { await navigator.clipboard.writeText(window.location.href); alert('🔗 Link copied to clipboard!'); } catch (err) { alert('❌ Failed to copy link.'); } };

const handleExportCSV = () => { let csv = ''; if (!data.length) return; const headers = Object.keys(data[0]); csv += headers.join(',') + '\n'; data.forEach(row => { const values = headers.map(field => "${String(row[field] || '').replace(/"/g, '""')}"); csv += values.join(',') + '\n'; }); const blob = new Blob([csv], { type: 'text/csv' }); const url = window.URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'smart-sheet.csv'; a.click(); window.URL.revokeObjectURL(url); };

const handleExportJSON = () => { const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const url = window.URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'smart-sheet.json'; a.click(); window.URL.revokeObjectURL(url); };

return ( <div className="bg-white px-6 py-3 shadow border-b flex items-center justify-between"> <h1 className="text-lg font-semibold">SmartSheet AI</h1> <div className="space-x-3"> <button
onClick={handleShare}
className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm active:scale-95 transition cursor-pointer"
> 🔗 Share </button> <button
onClick={handleExportCSV}
className="px-3 py-1 bg-gray-200 text-sm rounded-md active:scale-95 transition cursor-pointer"
> 📦 Export CSV </button> <button
onClick={handleExportJSON}
className="px-3 py-1 bg-gray-200 text-sm rounded-md active:scale-95 transition cursor-pointer"
> 📄 Export JSON </button> </div> </div> ); };

export default Topbar;

  
