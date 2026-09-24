import React, { useState } from 'react';
import {
  Rows,
  Columns,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Table as TableIcon,
  Palette
} from 'lucide-react';
import {
  addTableRow,
  addTableColumn,
  deleteTableRow,
  deleteTableColumn,
  deleteTable,
  applyTableStyle
} from '../../utils/editorCommands';
import { TABLE_STYLE_PRESETS } from '../Modals/InsertTableModal';

interface TableToolsFloatingBarProps {
  isVisible: boolean;
  position: { top: number; left: number };
}

export const TableToolsFloatingBar: React.FC<TableToolsFloatingBarProps> = ({
  isVisible,
  position
}) => {
  const [showStyleMenu, setShowStyleMenu] = useState(false);

  if (!isVisible) return null;

  return (
    <div
      className="fixed z-40 bg-slate-900/90 text-white rounded-md shadow-xl py-1 px-1.5 flex items-center gap-0.5 text-xs backdrop-blur-xs select-none no-print border border-slate-700/50"
      style={{
        top: `${Math.max(10, position.top - 42)}px`,
        left: `${Math.max(10, position.left)}px`
      }}
    >
      <div className="flex items-center gap-1 px-1 text-[10px] text-slate-400 font-semibold border-r border-slate-700 pr-1.5 mr-0.5">
        <TableIcon className="w-3 h-3 text-blue-400" />
        <span>Table</span>
      </div>

      {/* Quick Style Picker */}
      <div className="relative">
        <button
          onClick={() => setShowStyleMenu(!showStyleMenu)}
          title="Change Table Theme Style"
          className="p-1 hover:bg-white/20 rounded text-slate-200 hover:text-white transition-colors flex items-center gap-1 text-[10px]"
        >
          <Palette className="w-3 h-3 text-amber-400" />
          <span>Styles</span>
        </button>

        {showStyleMenu && (
          <div
            className="absolute left-0 bottom-full mb-1 bg-slate-900 border border-slate-700 shadow-xl rounded-md p-1.5 w-44 z-50 text-xs animate-in fade-in"
            onClick={() => setShowStyleMenu(false)}
          >
            <div className="text-[10px] text-slate-400 font-semibold px-1.5 py-0.5 uppercase tracking-wider mb-1">
              Table Styles
            </div>
            {TABLE_STYLE_PRESETS.map((style) => (
              <button
                key={style.id}
                onClick={() => applyTableStyle(style.id)}
                className="w-full text-left px-2 py-1 hover:bg-white/10 rounded flex items-center gap-2 text-[11px] text-slate-200"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: style.headerBg }}
                />
                <span>{style.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-4 w-[1px] bg-slate-700 mx-0.5" />

      <button
        onClick={() => addTableRow('above')}
        title="Add Row Above"
        className="p-1 hover:bg-white/20 rounded text-slate-200 hover:text-white transition-colors flex items-center gap-0.5 text-[10px]"
      >
        <ArrowUp className="w-3 h-3 text-emerald-400" />
        <span className="hidden sm:inline">Row</span>
      </button>

      <button
        onClick={() => addTableRow('below')}
        title="Add Row Below"
        className="p-1 hover:bg-white/20 rounded text-slate-200 hover:text-white transition-colors flex items-center gap-0.5 text-[10px]"
      >
        <ArrowDown className="w-3 h-3 text-emerald-400" />
        <span className="hidden sm:inline">Row</span>
      </button>

      <button
        onClick={() => addTableColumn('left')}
        title="Add Column Left"
        className="p-1 hover:bg-white/20 rounded text-slate-200 hover:text-white transition-colors flex items-center gap-0.5 text-[10px]"
      >
        <ArrowLeft className="w-3 h-3 text-blue-400" />
        <span className="hidden sm:inline">Col</span>
      </button>

      <button
        onClick={() => addTableColumn('right')}
        title="Add Column Right"
        className="p-1 hover:bg-white/20 rounded text-slate-200 hover:text-white transition-colors flex items-center gap-0.5 text-[10px]"
      >
        <ArrowRight className="w-3 h-3 text-blue-400" />
        <span className="hidden sm:inline">Col</span>
      </button>

      <div className="h-4 w-[1px] bg-slate-700 mx-0.5" />

      <button
        onClick={deleteTableRow}
        title="Delete Row"
        className="p-1 hover:bg-red-500/30 text-rose-300 hover:text-rose-200 rounded transition-colors text-[10px]"
      >
        -Row
      </button>

      <button
        onClick={deleteTableColumn}
        title="Delete Column"
        className="p-1 hover:bg-red-500/30 text-rose-300 hover:text-rose-200 rounded transition-colors text-[10px]"
      >
        -Col
      </button>

      <button
        onClick={deleteTable}
        title="Delete Entire Table"
        className="p-1 hover:bg-red-600 text-rose-200 hover:text-white rounded transition-colors"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
};
