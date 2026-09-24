import React, { useState } from 'react';
import { X, Layout, FileSpreadsheet } from 'lucide-react';
import { Margins, PageSize, Orientation, WatermarkConfig } from '../../types/document';

interface PageSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  margins: Margins;
  onUpdateMargins: (margins: Margins) => void;
  pageSize: PageSize;
  onUpdatePageSize: (size: PageSize) => void;
  orientation: Orientation;
  onUpdateOrientation: (orient: Orientation) => void;
  watermark: WatermarkConfig;
  onUpdateWatermark: (watermark: WatermarkConfig) => void;
}

export const PageSetupModal: React.FC<PageSetupModalProps> = ({
  isOpen,
  onClose,
  margins,
  onUpdateMargins,
  pageSize,
  onUpdatePageSize,
  orientation,
  onUpdateOrientation,
  watermark,
  onUpdateWatermark
}) => {
  const [top, setTop] = useState(margins.top);
  const [right, setRight] = useState(margins.right);
  const [bottom, setBottom] = useState(margins.bottom);
  const [left, setLeft] = useState(margins.left);
  const [localPageSize, setLocalPageSize] = useState<PageSize>(pageSize);
  const [localOrientation, setLocalOrientation] = useState<Orientation>(orientation);

  const [wmEnabled, setWmEnabled] = useState(watermark.enabled);
  const [wmText, setWmText] = useState(watermark.text);
  const [wmOpacity, setWmOpacity] = useState(watermark.opacity);

  if (!isOpen) return null;

  const handleApplyPresetMargins = (t: number, r: number, b: number, l: number) => {
    setTop(t);
    setRight(r);
    setBottom(b);
    setLeft(l);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMargins({ top, right, bottom, left });
    onUpdatePageSize(localPageSize);
    onUpdateOrientation(localOrientation);
    onUpdateWatermark({
      enabled: wmEnabled,
      text: wmText,
      opacity: wmOpacity,
      color: '#cbd5e1'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 dialog-overlay">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <Layout className="w-4 h-4 text-blue-600" />
            <span>Page Setup</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Margins */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-700">Margins (Inches)</span>
              <div className="flex gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleApplyPresetMargins(1.0, 1.0, 1.0, 1.0)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded"
                >
                  Normal (1")
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetMargins(0.5, 0.5, 0.5, 0.5)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded"
                >
                  Narrow (0.5")
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetMargins(1.25, 1.25, 1.25, 1.25)}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded"
                >
                  Wide (1.25")
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Top</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.2"
                  max="3"
                  value={top}
                  onChange={(e) => setTop(parseFloat(e.target.value) || 0.5)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Bottom</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.2"
                  max="3"
                  value={bottom}
                  onChange={(e) => setBottom(parseFloat(e.target.value) || 0.5)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Left</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.2"
                  max="3"
                  value={left}
                  onChange={(e) => setLeft(parseFloat(e.target.value) || 0.5)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Right</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.2"
                  max="3"
                  value={right}
                  onChange={(e) => setRight(parseFloat(e.target.value) || 0.5)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                />
              </div>
            </div>
          </div>

          {/* Orientation & Size */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Orientation</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLocalOrientation('portrait')}
                  className={`flex-1 py-1.5 px-2 text-xs rounded border text-center font-medium transition-colors ${
                    localOrientation === 'portrait'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-300 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  Portrait
                </button>
                <button
                  type="button"
                  onClick={() => setLocalOrientation('landscape')}
                  className={`flex-1 py-1.5 px-2 text-xs rounded border text-center font-medium transition-colors ${
                    localOrientation === 'landscape'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-300 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  Landscape
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Paper Size</label>
              <select
                value={localPageSize}
                onChange={(e) => setLocalPageSize(e.target.value as PageSize)}
                className="w-full py-1.5 px-2 text-xs border border-slate-300 rounded bg-white text-slate-700 focus:outline-none"
              >
                <option value="letter">Letter (8.5" x 11")</option>
                <option value="a4">A4 (210 x 297 mm)</option>
                <option value="legal">Legal (8.5" x 14")</option>
              </select>
            </div>
          </div>

          {/* Watermark */}
          <div className="border-t border-slate-200 pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700">Document Watermark</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={wmEnabled}
                  onChange={(e) => setWmEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {wmEnabled && (
              <div className="space-y-2 bg-slate-50 p-3 rounded border border-slate-200">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Watermark Text</label>
                  <input
                    type="text"
                    value={wmText}
                    onChange={(e) => setWmText(e.target.value)}
                    placeholder="e.g. DRAFT, CONFIDENTIAL, SAMPLE"
                    className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Opacity</span>
                    <span>{Math.round(wmOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.4"
                    step="0.02"
                    value={wmOpacity}
                    onChange={(e) => setWmOpacity(parseFloat(e.target.value))}
                    className="w-full accent-blue-600 h-1 bg-slate-200 rounded"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
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
              Apply Setup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
