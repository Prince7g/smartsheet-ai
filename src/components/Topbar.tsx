import React from 'react';

const Topbar = () => {
  const handleShare = () => {
    alert("📤 Share feature coming soon!");
  };

  const handleExport = () => {
    alert("📦 Export to Excel feature coming soon!");
  };

  return (
    <div className="bg-white px-6 py-3 shadow border-b flex items-center justify-between">
      <h1 className="text-lg font-semibold">SmartSheet AI</h1>
      <div className="space-x-4">
        <button
          onClick={handleShare}
          className="px-4 py-1 bg-blue-600 text-white rounded-md text-sm active:scale-95 transition cursor-pointer"
        >
          Share
        </button>
        <button
          onClick={handleExport}
          className="px-4 py-1 bg-gray-100 text-sm rounded-md active:scale-95 transition cursor-pointer"
        >
          Export
        </button>
      </div>
    </div>
  );
};

export default Topbar;
