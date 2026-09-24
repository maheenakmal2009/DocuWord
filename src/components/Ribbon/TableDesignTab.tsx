import React, { useState, useEffect } from 'react';
import {
  Table as TableIcon,
  Palette,
  Square,
  Check,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Sliders,
  Grid
} from 'lucide-react';
import { TABLE_STYLE_PRESETS } from '../Modals/InsertTableModal';
import {
  applyTableStyle,
  toggleTableOption,
  setTableCellShading,
  applyTableBorders,
  getActiveTableInfo,
  addTableRow,
  addTableColumn,
  deleteTableRow,
  deleteTableColumn,
  deleteTable,
  insertTable
} from '../../utils/editorCommands';

const SHADING_COLORS = [
  { name: 'Transparent / Reset', value: 'transparent' },
  { name: 'Pure White', value: '#ffffff' },
  { name: 'Light Slate', value: '#f1f5f9' },
  { name: 'Soft Blue', value: '#dbeafe' },
  { name: 'Navy Blue', value: '#1e40af' },
  { name: 'Soft Emerald', value: '#d1fae5' },
  { name: 'Forest Green', value: '#065f46' },
  { name: 'Soft Amber', value: '#fef3c7' },
  { name: 'Warm Amber', value: '#92400e' },
  { name: 'Soft Rose', value: '#ffe4e6' },
  { name: 'Crimson', value: '#9f1239' },
  { name: 'Soft Purple', value: '#f3e8ff' }
];

export const TableDesignTab: React.FC = () => {
  const [tableInfo, setTableInfo] = useState(getActiveTableInfo());
  const [showShadingMenu, setShowShadingMenu] = useState(false);
  const [showBorderMenu, setShowBorderMenu] = useState(false);

  // Sync active table state regularly
  useEffect(() => {
    const handleUpdate = () => {
      setTableInfo(getActiveTableInfo());
    };

    document.addEventListener('selectionchange', handleUpdate);
    document.addEventListener('click', handleUpdate);
    return () => {
      document.removeEventListener('selectionchange', handleUpdate);
      document.removeEventListener('click', handleUpdate);
    };
  }, []);

  const handleApplyStyle = (styleId: string) => {
    const applied = applyTableStyle(styleId);
    if (!applied) {
      // If no table selected, insert one with this style
      insertTable(3, 4, styleId);
    }
    setTableInfo(getActiveTableInfo());
  };

  const handleToggleOption = (optionClass: string) => {
    toggleTableOption(optionClass);
    setTableInfo(getActiveTableInfo());
  };

  const handleApplyShading = (color: string) => {
    setTableCellShading(color);
    setShowShadingMenu(false);
  };

  const handleApplyBorder = (type: 'all' | 'outer' | 'none') => {
    applyTableBorders(type);
    setShowBorderMenu(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-1 px-3 text-slate-700 text-xs select-none">
      {/* Group 1: Table Style Options (Checkboxes) */}
      <div className="flex flex-col gap-1 pr-3 border-r border-slate-200 text-[11px]">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-950">
            <input
              type="checkbox"
              checked={tableInfo.hasHeaderRow}
              onChange={() => handleToggleOption('no-header-row')}
              className="rounded text-blue-600 focus:ring-0 w-3 h-3"
            />
            <span>Header Row</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-950">
            <input
              type="checkbox"
              checked={tableInfo.hasStripedRows}
              onChange={() => handleToggleOption('no-striped-rows')}
              className="rounded text-blue-600 focus:ring-0 w-3 h-3"
            />
            <span>Banded Rows</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-950">
            <input
              type="checkbox"
              checked={tableInfo.hasTotalRow}
              onChange={() => handleToggleOption('total-row')}
              className="rounded text-blue-600 focus:ring-0 w-3 h-3"
            />
            <span>Total Row</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-950">
            <input
              type="checkbox"
              checked={tableInfo.hasFirstColBold}
              onChange={() => handleToggleOption('first-col-bold')}
              className="rounded text-blue-600 focus:ring-0 w-3 h-3"
            />
            <span>First Column</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-950">
            <input
              type="checkbox"
              checked={tableInfo.hasLastColBold}
              onChange={() => handleToggleOption('last-col-bold')}
              className="rounded text-blue-600 focus:ring-0 w-3 h-3"
            />
            <span>Last Column</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-950">
            <input
              type="checkbox"
              checked={tableInfo.hasBandedCols}
              onChange={() => handleToggleOption('banded-cols')}
              className="rounded text-blue-600 focus:ring-0 w-3 h-3"
            />
            <span>Banded Cols</span>
          </label>
        </div>
      </div>

      {/* Group 2: Table Styles Gallery */}
      <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200 overflow-x-auto py-0.5">
        {TABLE_STYLE_PRESETS.map((preset) => {
          const isActive = tableInfo.isTableSelected && tableInfo.activeStyle === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleApplyStyle(preset.id)}
              title={`Apply ${preset.name} style`}
              className={`p-1.5 rounded border text-center transition-all min-w-[70px] ${
                isActive
                  ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
              }`}
            >
              {/* Mini visual table preview card */}
              <div className="w-14 h-6 rounded-xs overflow-hidden border border-slate-300/80 flex flex-col mx-auto mb-1">
                <div
                  className="h-2.5 w-full flex items-center px-0.5"
                  style={{ backgroundColor: preset.headerBg }}
                >
                  <div className="h-0.5 w-5 bg-white/70 rounded-xs" />
                </div>
                <div className="flex-1 w-full bg-white flex flex-col justify-around px-0.5">
                  <div
                    className="h-1 w-full rounded-xs"
                    style={{ backgroundColor: preset.stripeBg }}
                  />
                </div>
              </div>
              <div className="text-[10px] font-medium text-slate-700 truncate w-14 text-center leading-tight">
                {preset.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Group 3: Shading & Borders */}
      <div className="flex flex-col gap-1 pr-3 border-r border-slate-200">
        {/* Shading */}
        <div className="relative">
          <button
            onClick={() => setShowShadingMenu(!showShadingMenu)}
            title="Cell Shading Background Color"
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-100 rounded text-slate-700 transition-colors text-xs"
          >
            <Palette className="w-3.5 h-3.5 text-blue-600" />
            <span>Shading</span>
            <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
          </button>

          {showShadingMenu && (
            <div
              className="absolute left-0 top-full mt-1 bg-white border border-slate-200 shadow-md rounded p-2 z-50 grid grid-cols-4 gap-1.5 w-44 animate-in fade-in"
              onClick={() => setShowShadingMenu(false)}
            >
              {SHADING_COLORS.map((col) => (
                <button
                  key={col.name}
                  onClick={() => handleApplyShading(col.value)}
                  title={col.name}
                  className="w-8 h-6 rounded border border-slate-300 transition-transform hover:scale-105"
                  style={{
                    backgroundColor: col.value === 'transparent' ? '#ffffff' : col.value,
                    backgroundImage:
                      col.value === 'transparent'
                        ? 'linear-gradient(45deg, #ef4444 10%, transparent 10%, transparent 50%, #ef4444 50%, #ef4444 60%, transparent 60%)'
                        : 'none'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Borders */}
        <div className="relative">
          <button
            onClick={() => setShowBorderMenu(!showBorderMenu)}
            title="Table Borders Theme"
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-100 rounded text-slate-700 transition-colors text-xs"
          >
            <Grid className="w-3.5 h-3.5 text-slate-600" />
            <span>Borders</span>
            <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
          </button>

          {showBorderMenu && (
            <div
              className="absolute left-0 top-full mt-1 bg-white border border-slate-200 shadow-md rounded py-1 z-50 w-36 text-xs animate-in fade-in"
              onClick={() => setShowBorderMenu(false)}
            >
              <button
                onClick={() => handleApplyBorder('all')}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-700 flex items-center justify-between"
              >
                <span>All Borders</span>
              </button>
              <button
                onClick={() => handleApplyBorder('outer')}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-700 flex items-center justify-between"
              >
                <span>Outside Only</span>
              </button>
              <button
                onClick={() => handleApplyBorder('none')}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-700 flex items-center justify-between"
              >
                <span>No Borders</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Group 4: Quick Layout & Row/Column Manipulation */}
      <div className="flex items-center gap-1">
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => addTableRow('above')}
            title="Add Row Above"
            className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 text-[11px]"
          >
            <ArrowUp className="w-3 h-3 text-emerald-600" />
            <span>+ Row Above</span>
          </button>
          <button
            onClick={() => addTableRow('below')}
            title="Add Row Below"
            className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 text-[11px]"
          >
            <ArrowDown className="w-3 h-3 text-emerald-600" />
            <span>+ Row Below</span>
          </button>
        </div>

        <div className="flex flex-col gap-0.5 ml-1">
          <button
            onClick={() => addTableColumn('left')}
            title="Add Column Left"
            className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 text-[11px]"
          >
            <ArrowLeft className="w-3 h-3 text-blue-600" />
            <span>+ Col Left</span>
          </button>
          <button
            onClick={() => addTableColumn('right')}
            title="Add Column Right"
            className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 text-[11px]"
          >
            <ArrowRight className="w-3 h-3 text-blue-600" />
            <span>+ Col Right</span>
          </button>
        </div>

        <div className="h-6 w-[1px] bg-slate-200 mx-1" />

        <button
          onClick={deleteTable}
          title="Delete selected table"
          className="flex flex-col items-center p-1.5 hover:bg-rose-50 text-rose-600 rounded transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Delete Table</span>
        </button>
      </div>
    </div>
  );
};
