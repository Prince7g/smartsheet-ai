import React from 'react';

const Topbar = () => {
  return (
    <div className="bg-white px-6 py-3 shadow border-b flex items-center justify-between">
      <h1 className="text-lg font-semibold">SmartSheet AI</h1>
      <div className="space-x-4">
        <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">Share</button>
        <button className="px-3 py-1 bg-gray-100 text-sm rounded-md">Export</button>
      </div>
    </div>
  );
};

export default Topbar;
