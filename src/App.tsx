import React from 'react';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import Spreadsheet from './components/Spreadsheet';

const App = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <Spreadsheet />
      </div>
    </div>
  );
};

export default App;
