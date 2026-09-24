import React, { useState } from 'react';
import {
  Layout,
  Maximize,
  FileSpreadsheet,
  Palette,
  Stamp,
  Columns as ColumnsIcon,
  ChevronDown
} from 'lucide-react';
import { Margins, PageSize, Orientation, WatermarkConfig } from '../../types/document';

interface LayoutTabProps {
  margins: Margins;
  onUpdateMargins: (margins: Margins) => void;
  pageSize: PageSize;
  onUpdatePageSize: (size: PageSize) => void;
  orientation: Orientation;
  onUpdateOrientation: (orientation: Orientation) => void;
  pageColor: string;
  onUpdatePageColor: (color: string) => void;
  watermark: WatermarkConfig;
  onUpdateWatermark: (watermark: WatermarkConfig) => void;
  onOpenPageSetup: () => void;
}

const PAGE_COLORS = [
  { name: 'Pure White', value: '#ffffff' },
  { name: 'Soft Ivory', value: '#fdfbf7' },
  { name: 'Warm Sepia', value: '#faf5ee' },
  { name: 'Pale Cool Gray', value: '#f8fafc' },
  { name: 'Subtle Slate', value: '#f1f5f9' }
];

export const LayoutTab: React.FC<LayoutTabProps> = ({
  margins,
  onUpdateMargins,
  pageSize,
  onUpdatePageSize,
  orientation,
  onUpdateOrientation,
  pageColor,
  onUpdatePageColor,
  watermark,
  onUpdateWatermark,
  onOpenPageSetup
}) => {
  const [showMarginsMenu, setShowMarginsMenu] = useState(false);
  const [showOrientationMenu, setShowOrientationMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showWatermarkMenu, setShowWatermarkMenu] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-1 px-3 text-slate-700 text-xs">
      {/* Group: Page Setup (Margins, Orientation, Size) */}
      <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200">
        {/* Margins Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMarginsMenu(!showMarginsMenu)}
            className="flex flex-col items-center p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
          >
            <div className="flex items-center gap-0.5">
              <Layout className="w-4 h-4 text-blue-600" />
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </div>
            <span className="text-[10px] mt-0.5 whitespace-nowrap">Margins</span>
          </button>

          {showMarginsMenu && (
            <div
              className="absolute left-0 top-full mt-1 bg-white border border-slate-200 shadow-lg rounded-md py-1 z-50 w-52 text-xs animate-in fade-in"
              onClick={() => setShowMarginsMenu(false)}
            >
              <button
                onClick={() => onUpdateMargins({ top: 1.0, right: 1.0, bottom: 1.0, left: 1.0 })}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-800">Normal</div>
                  <div className="text-[10px] text-slate-400">Top/Bottom: 1" &bull; Left/Right: 1"</div>
                </div>
                {margins.top === 1.0 && <span className="text-blue-600 text-xs font-bold">&check;</span>}
              </button>

              <button
                onClick={() => onUpdateMargins({ top: 0.5, right: 0.5, bottom: 0.5, left: 0.5 })}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-800">Narrow</div>
                  <div className="text-[10px] text-slate-400">Top/Bottom: 0.5" &bull; Left/Right: 0.5"</div>
                </div>
                {margins.top === 0.5 && <span className="text-blue-600 text-xs font-bold">&check;</span>}
              </button>

              <button
                onClick={() => onUpdateMargins({ top: 0.75, right: 0.75, bottom: 0.75, left: 0.75 })}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-800">Moderate</div>
                  <div className="text-[10px] text-slate-400">Top/Bottom: 0.75" &bull; Left/Right: 0.75"</div>
                </div>
                {margins.top === 0.75 && <span className="text-blue-600 text-xs font-bold">&check;</span>}
              </button>

              <button
                onClick={() => onUpdateMargins({ top: 1.25, right: 1.25, bottom: 1.25, left: 1.25 })}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-800">Wide</div>
                  <div className="text-[10px] text-slate-400">Top/Bottom: 1.25" &bull; Left/Right: 1.25"</div>
                </div>
                {margins.top === 1.25 && <span className="text-blue-600 text-xs font-bold">&check;</span>}
              </button>

              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  onClick={onOpenPageSetup}
                  className="w-full text-left px-3 py-1 text-blue-600 hover:bg-blue-50 font-medium"
                >
                  Custom Margins...
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Orientation Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowOrientationMenu(!showOrientationMenu)}
            className="flex flex-col items-center p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
          >
            <div className="flex items-center gap-0.5">
              <Maximize className="w-4 h-4 text-slate-700" />
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </div>
            <span className="text-[10px] mt-0.5 capitalize">{orientation}</span>
          </button>

          {showOrientationMenu && (
            <div
              className="absolute left-0 top-full mt-1 bg-white border border-slate-200 shadow-md rounded py-1 z-50 w-36 text-xs animate-in fade-in"
              onClick={() => setShowOrientationMenu(false)}
            >
              <button
                onClick={() => onUpdateOrientation('portrait')}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Portrait</span>
                {orientation === 'portrait' && <span className="text-blue-600 font-bold">&check;</span>}
              </button>
              <button
                onClick={() => onUpdateOrientation('landscape')}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Landscape</span>
                {orientation === 'landscape' && <span className="text-blue-600 font-bold">&check;</span>}
              </button>
            </div>
          )}
        </div>

        {/* Size Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSizeMenu(!showSizeMenu)}
            className="flex flex-col items-center p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
          >
            <div className="flex items-center gap-0.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </div>
            <span className="text-[10px] mt-0.5 uppercase">{pageSize}</span>
          </button>

          {showSizeMenu && (
            <div
              className="absolute left-0 top-full mt-1 bg-white border border-slate-200 shadow-md rounded py-1 z-50 w-48 text-xs animate-in fade-in"
              onClick={() => setShowSizeMenu(false)}
            >
              <button
                onClick={() => onUpdatePageSize('letter')}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-800">US Letter</div>
                  <div className="text-[10px] text-slate-400">8.5" &times; 11"</div>
                </div>
                {pageSize === 'letter' && <span className="text-blue-600 font-bold">&check;</span>}
              </button>

              <button
                onClick={() => onUpdatePageSize('a4')}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-800">A4 Standard</div>
                  <div className="text-[10px] text-slate-400">210 &times; 297 mm</div>
                </div>
                {pageSize === 'a4' && <span className="text-blue-600 font-bold">&check;</span>}
              </button>

              <button
                onClick={() => onUpdatePageSize('legal')}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-800">US Legal</div>
                  <div className="text-[10px] text-slate-400">8.5" &times; 14"</div>
                </div>
                {pageSize === 'legal' && <span className="text-blue-600 font-bold">&check;</span>}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Group: Page Background (Page Color & Watermark) */}
      <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200">
        {/* Page Color */}
        <div className="relative">
          <button
            onClick={() => setShowColorMenu(!showColorMenu)}
            className="flex flex-col items-center p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
          >
            <div className="flex items-center gap-0.5">
              <Palette className="w-4 h-4 text-amber-500" />
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </div>
            <span className="text-[10px] mt-0.5 whitespace-nowrap">Page Color</span>
          </button>

          {showColorMenu && (
            <div
              className="absolute left-0 top-full mt-1 bg-white border border-slate-200 shadow-md rounded p-2 z-50 w-36 space-y-1 text-xs animate-in fade-in"
              onClick={() => setShowColorMenu(false)}
            >
              {PAGE_COLORS.map((col) => (
                <button
                  key={col.name}
                  onClick={() => onUpdatePageColor(col.value)}
                  className="w-full flex items-center gap-2 p-1 hover:bg-slate-50 rounded"
                >
                  <span
                    className="w-4 h-4 rounded border border-slate-300"
                    style={{ backgroundColor: col.value }}
                  />
                  <span className="text-slate-700 text-[11px]">{col.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Watermark */}
        <div className="relative">
          <button
            onClick={() => setShowWatermarkMenu(!showWatermarkMenu)}
            className="flex flex-col items-center p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
          >
            <div className="flex items-center gap-0.5">
              <Stamp className="w-4 h-4 text-red-500" />
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </div>
            <span className="text-[10px] mt-0.5 whitespace-nowrap">Watermark</span>
          </button>

          {showWatermarkMenu && (
            <div
              className="absolute left-0 top-full mt-1 bg-white border border-slate-200 shadow-md rounded py-1 z-50 w-44 text-xs animate-in fade-in"
              onClick={() => setShowWatermarkMenu(false)}
            >
              <button
                onClick={() => onUpdateWatermark({ ...watermark, enabled: false })}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-600"
              >
                No Watermark
              </button>
              <button
                onClick={() =>
                  onUpdateWatermark({ enabled: true, text: 'CONFIDENTIAL', opacity: 0.12, color: '#94a3b8' })
                }
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 font-semibold text-slate-700"
              >
                CONFIDENTIAL
              </button>
              <button
                onClick={() =>
                  onUpdateWatermark({ enabled: true, text: 'DRAFT', opacity: 0.12, color: '#94a3b8' })
                }
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 font-semibold text-slate-700"
              >
                DRAFT
              </button>
              <button
                onClick={() =>
                  onUpdateWatermark({ enabled: true, text: 'SAMPLE', opacity: 0.12, color: '#94a3b8' })
                }
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 font-semibold text-slate-700"
              >
                SAMPLE
              </button>
              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  onClick={onOpenPageSetup}
                  className="w-full text-left px-3 py-1 text-blue-600 hover:bg-blue-50 font-medium"
                >
                  Custom Watermark...
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Page Setup Dialog Launcher */}
      <div>
        <button
          onClick={onOpenPageSetup}
          className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-100 rounded text-slate-700 text-xs font-medium transition-colors"
        >
          Page Setup Dialog...
        </button>
      </div>
    </div>
  );
};
