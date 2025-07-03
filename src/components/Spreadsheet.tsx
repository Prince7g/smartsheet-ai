import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { columns, data as originalData } from '../data/dummyData';
import { generateAISuggestion } from '../utils/aiHelper';

type CellID = { row: number; col: number };

const Spreadsheet = () => {
  const [data, setData] = useState(originalData);
  const [filteredData, setFilteredData] = useState(originalData);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCell, setEditingCell] = useState<CellID | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [aiFill, setAiFill] = useState<{ row: number; col: number; value: string }[]>([]);
  const [activeCell, setActiveCell] = useState<CellID>({ row: 0, col: 0 });
  const [aiPopup, setAIPopup] = useState({
    visible: false,
    message: '',
    x: 0,
    y: 0,
  });

  const columnKeys = columns.map((col: any) => col.accessor);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: filteredData });

  const closePopup = () => setAIPopup({ ...aiPopup, visible: false });

  const handleKeyDown = (e: KeyboardEvent) => {
    let { row, col } = activeCell;
    const maxRow = rows.length - 1;
    const maxCol = columnKeys.length - 1;

    switch (e.key) {
      case 'ArrowDown':
        row = Math.min(row + 1, maxRow);
        break;
      case 'ArrowUp':
        row = Math.max(row - 1, 0);
        break;
      case 'ArrowRight':
        col = Math.min(col + 1, maxCol);
        break;
      case 'ArrowLeft':
        col = Math.max(col - 1, 0);
        break;
      default:
        return;
    }

    e.preventDefault();
    setActiveCell({ row, col });

    const cell = document.getElementById(`cell-${row}-${col}`);
    if (cell) cell.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  const handleRightClick = (
    e: React.MouseEvent,
    value: any,
    columnId: string
  ) => {
    e.preventDefault();
    const suggestion = generateAISuggestion(value, columnId);
    setAIPopup({
      visible: true,
      message: suggestion,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const onDoubleClick = (row: number, col: number) => {
    const key = columnKeys[col];
    setInputValue(data[row][key]);
    setEditingCell({ row, col });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onBlur = () => {
    if (!editingCell) return;
    const { row, col } = editingCell;
    const key = columnKeys[col];
    const updated = [...data];
    updated[row][key] = inputValue;

    if (key === 'name') {
      const newSuggestions = updated.map((_, i) => {
        if (i > row) {
          return { row: i, col, value: `Suggested ${inputValue.split(' ')[0]} ${i}` };
        }
        return null;
      }).filter(Boolean) as typeof aiFill;
      setAiFill(newSuggestions);
    }

    setData(updated);
    setFilteredData(updated);
    setEditingCell(null);
  };

  const acceptAIFill = () => {
    const updated = [...data];
    aiFill.forEach(({ row, col, value }) => {
      const key = columnKeys[col];
      updated[row][key] = value;
    });
    setData(updated);
    setFilteredData(updated);
    setAiFill([]);
  };

  const handleAddRow = () => {
    const newRow = {
      id: data.length + 1,
      name: '',
      status: '',
      amount: 0,
    };
    const updated = [...data, newRow];
    setData(updated);
    setFilteredData(updated);
    setActiveCell({ row: updated.length - 1, col: 0 });

    setTimeout(() => {
      const newCell = document.getElementById(`cell-${updated.length - 1}-0`);
      if (newCell) newCell.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleDeleteRow = (rowIndex: number) => {
    const updated = data.filter((_, i) => i !== rowIndex);
    setData(updated);
    setFilteredData(updated);
  };

  useEffect(() => {
    if (!editingCell) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [editingCell]);

  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (q === '') {
      setFilteredData(data);
      return;
    }

    const filters = q.split(' ').filter(Boolean);
    const result = data.filter((row) => {
      return filters.every((term) => {
        if (term.includes('>')) {
          const [field, value] = term.split('>');
          return Number(row[field.trim()]) > Number(value.trim());
        } else if (term.includes('<')) {
          const [field, value] = term.split('<');
          return Number(row[field.trim()]) < Number(value.trim());
        } else if (term.includes('contains')) {
          const [field, value] = term.split('contains');
          return String(row[field.trim()]).toLowerCase().includes(value.trim());
        } else {
          return Object.values(row).some((v) =>
            String(v).toLowerCase().includes(term)
          );
        }
      });
    });

    setFilteredData(result);
  }, [searchQuery, data]);

  return (
    <div className="relative p-4 overflow-auto" onClick={closePopup} tabIndex={0}>
      <div className="mb-3 flex items-center gap-2">
        <input
          type="text"
          placeholder="Try: status pending / amount > 5000 / name contains Ravi"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded text-sm w-full"
        />
        <button
          onClick={() => setSearchQuery('')}
          className="text-sm bg-gray-200 px-3 py-1 rounded active:scale-95 transition cursor-pointer"
        >
          🔄 Reset
        </button>
      </div>

      {aiFill.length > 0 && (
        <button
          className="text-xs px-2 py-1 mb-2 bg-blue-500 text-white rounded active:scale-95 transition"
          onClick={acceptAIFill}
        >
          ✅ Accept AI Suggestions
        </button>
      )}

      <table {...getTableProps()} className="min-w-full border border-gray-300 bg-white rounded">
        <thead>
          {headerGroups.map((group) => (
            <tr {...group.getHeaderGroupProps()} className="bg-gray-100 text-sm">
              {group.headers.map((col) => (
                <th {...col.getHeaderProps()} className="px-4 py-2 border-b font-semibold text-left">
                  {col.render('Header')}
                </th>
              ))}
              <th className="px-4 py-2 border-b text-sm font-semibold">Action</th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((rowObj, rowIndex) => {
            prepareRow(rowObj);
            return (
              <tr {...rowObj.getRowProps()} className="hover:bg-gray-50 text-sm">
                {rowObj.cells.map((cell, colIndex) => {
                  const isEditing =
                    editingCell?.row === rowIndex && editingCell?.col === colIndex;
                  const isActive =
                    activeCell.row === rowIndex && activeCell.col === colIndex;
                  const ai = aiFill.find(
                    (s) => s.row === rowIndex && s.col === colIndex
                  );

                  return (
                    <td
                      {...cell.getCellProps()}
                      id={`cell-${rowIndex}-${colIndex}`}
                      onDoubleClick={() => onDoubleClick(rowIndex, colIndex)}
                      onContextMenu={(e) =>
                        handleRightClick(e, cell.value, cell.column.id)
                      }
                      className={`border-b px-4 py-2 relative cursor-pointer ${
                        isActive ? 'ring-2 ring-blue-400 ring-offset-1' : ''
                      }`}
                    >
                      {isEditing ? (
                        <input
                          value={inputValue}
                          onChange={onChange}
                          onBlur={onBlur}
                          autoFocus
                          className="border px-2 py-1 text-sm w-full"
                        />
                      ) : ai ? (
                        <span className="text-gray-400 italic">{ai.value}</span>
                      ) : (
                        cell.render('Cell')
                      )}
                    </td>
                  );
                })}
                <td className="border-b px-2 text-center">
                  <button
                    onClick={() => handleDeleteRow(rowIndex)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {aiPopup.visible && (
        <div
          className="absolute bg-white shadow-lg border rounded p-2 text-xs w-64 z-50"
          style={{ top: aiPopup.y + 5, left: aiPopup.x + 5 }}
        >
          <p className="font-medium text-gray-700 mb-1">💡 AI Suggestion:</p>
          <p>{aiPopup.message}</p>
        </div>
      )}

      {/* Floating Add Button */}
      <button
        onClick={handleAddRow}
        className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg active:scale-95 transition"
      >
        ➕ Add Row
      </button>
    </div>
  );
};

export default Spreadsheet;
