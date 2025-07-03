import React from 'react';
import { FaFileAlt, FaClipboardList } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="w-16 bg-white shadow-lg border-r flex flex-col items-center py-4 space-y-6">
      <FaFileAlt size={20} className="text-gray-600 cursor-pointer" title="Docs" />
      <FaClipboardList size={20} className="text-gray-600 cursor-pointer" title="Tasks" />
    </div>
  );
};

export default Sidebar;
