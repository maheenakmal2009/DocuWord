import React, { useState } from 'react';
import { X, Table as TableIcon, Check } from 'lucide-react';
import { insertTable } from '../../utils/editorCommands';

interface InsertTableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TABLE_STYLE_PRESETS = [
  {
    id: 'tbl-style-blue',
    name: 'Professional Blue',
    headerBg: '#1d4ed8',
    stripeBg: '#eff6ff',
    borderColor: '#93c5fd',
    textColor: '#ffffff'
  },
  {
    id: 'tbl-style-slate',
    name: 'Modern Slate',
    headerBg: '#1e293b',
    stripeBg: '#f1f5f9',
    borderColor: '#475569',
    textColor: '#ffffff'
  },
  {
    id: 'tbl-style-emerald',
    name: 'Forest Emerald',
    headerBg: '#047857',
    stripeBg: '#ecfdf5',
    borderColor: '#6ee7b7',
    textColor: '#ffffff'
  },
  {
    id: 'tbl-style-amber',
    name: 'Warm Amber',
    headerBg: '#b45309',
    stripeBg: '#fffbeb',
    borderColor: '#fcd34d',
    textColor: '#ffffff'
  },
  {
    id: 'tbl-style-purple',
    name: 'Regal Purple',
    headerBg: '#6b21a8',
    stripeBg: '#faf5ff',
    borderColor: '#d8b4fe',
    textColor: '#ffffff'
  },
  {
    id: 'tbl-style-grid',
    name: 'Plain Grid',
    headerBg: '#f8fafc',
    stripeBg: '#ffffff',
    borderColor: '#cbd5e1',
    textColor: '#334155'
  },
  {
    id: 'tbl-style-minimal',
    name: 'Minimalist Line',
    headerBg: '#ffffff',
    stripeBg: '#ffffff',
    borderColor: '#0f172a',
    textColor: '#0f172a'
  }
];

export const InsertTableModal: React.FC<InsertTableModalProps> = ({ isOpen, onClose }) => {
  const [hoverRows, setHoverRows] = useState(3);
  const [hoverCols, setHoverCols] = useState(3);
  const [customRows, setCustomRows] = useState(3);
  const [customCols, setCustomCols] = useState(4);
  const [selectedStyle, setSelectedStyle] = useState('tbl-style-blue');

  if (!isOpen) return null;

  const handleGridSelect = (r: number, c: number) => {
    insertTable(r, c, selectedStyle);
    onClose();
  };

  const handleCustomInsert = (e: React.FormEvent) => {
    e.preventDefault();
    insertTable(Number(customRows) || 3, Number(customCols) || 3, selectedStyle);
    onClose();
  };

  const maxGridRows = 8;
  const maxGridCols = 8;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 dialog-overlay">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <TableIcon className="w-4 h-4 text-blue-600" />
            <span>Insert Table & Choose Style</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Style Picker */}
          <div>
            <span className="text-xs font-semibold text-slate-700 block mb-2">Select Pre-Defined Table Style</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TABLE_STYLE_PRESETS.map((style) => {
                const isSelected = selectedStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedStyle(style.id)}
                    className={`p-2 rounded border text-left transition-all relative ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    {/* Mini table visual preview */}
                    <div className="w-full h-8 rounded-xs overflow-hidden border border-slate-300/80 flex flex-col mb-1.5 shadow-2xs">
                      <div
                        className="h-3.5 w-full flex items-center px-1"
                        style={{ backgroundColor: style.headerBg }}
                      >
                        <div
                          className="h-1 w-8 rounded-xs opacity-80"
                          style={{ backgroundColor: style.textColor }}
                        />
                      </div>
                      <div className="flex-1 w-full flex flex-col justify-around px-1 bg-white">
                        <div
                          className="h-1.5 w-full rounded-xs"
                          style={{ backgroundColor: style.stripeBg }}
                        />
                      </div>
                    </div>
                    <div className="text-[11px] font-medium text-slate-800 truncate flex items-center justify-between">
                      <span>{style.name}</span>
                      {isSelected && <Check className="w-3 h-3 text-blue-600 shrink-0 ml-1" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3">
            {/* Quick Grid Selection */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Quick Visual Grid</span>
                <span className="text-xs font-bold text-blue-600 tabular-nums">
                  {hoverCols} &times; {hoverRows} Table
                </span>
              </div>

              <div
                className="grid gap-1 p-2 border border-slate-200 rounded-md bg-slate-50/50 w-fit mx-auto cursor-pointer"
                style={{ gridTemplateColumns: `repeat(${maxGridCols}, minmax(0, 1fr))` }}
                onMouseLeave={() => {
                  setHoverRows(3);
                  setHoverCols(3);
                }}
              >
                {Array.from({ length: maxGridRows }).map((_, rIdx) => {
                  const r = rIdx + 1;
                  return Array.from({ length: maxGridCols }).map((_, cIdx) => {
                    const c = cIdx + 1;
                    const isHovered = r <= hoverRows && c <= hoverCols;
                    return (
                      <button
                        key={`${r}-${c}`}
                        type="button"
                        onMouseEnter={() => {
                          setHoverRows(r);
                          setHoverCols(c);
                        }}
                        onClick={() => handleGridSelect(r, c)}
                        className={`w-5 h-5 rounded-xs transition-colors border ${
                          isHovered
                            ? 'bg-blue-500 border-blue-600'
                            : 'bg-white border-slate-300 hover:border-slate-400'
                        }`}
                        aria-label={`${c} by ${r} table`}
                      />
                    );
                  });
                })}
              </div>
              <p className="text-[11px] text-slate-400 text-center mt-1.5">
                Click a cell to immediately insert with chosen style
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium">Or Custom Dimensions</span>
            </div>
          </div>

          {/* Custom dimensions */}
          <form onSubmit={handleCustomInsert} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Columns</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={customCols}
                  onChange={(e) => setCustomCols(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Rows</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={customRows}
                  onChange={(e) => setCustomRows(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
              >
                Insert Table
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
