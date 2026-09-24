import React from 'react';
import {
  FileText,
  Globe,
  BookOpen,
  Ruler as RulerIcon,
  Grid,
  ListTree,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { ViewMode } from '../../types/document';

interface ViewTabProps {
  viewMode: ViewMode;
  onUpdateViewMode: (mode: ViewMode) => void;
  showRuler: boolean;
  onToggleRuler: () => void;
  showGridlines: boolean;
  onToggleGridlines: () => void;
  showNavPane: boolean;
  onToggleNavPane: () => void;
  zoomLevel: number;
  onUpdateZoom: (zoom: number) => void;
}

export const ViewTab: React.FC<ViewTabProps> = ({
  viewMode,
  onUpdateViewMode,
  showRuler,
  onToggleRuler,
  showGridlines,
  onToggleGridlines,
  showNavPane,
  onToggleNavPane,
  zoomLevel,
  onUpdateZoom
}) => {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-1 px-3 text-slate-700 text-xs">
      {/* Views Group */}
      <div className="flex items-center gap-1 pr-3 border-r border-slate-200">
        <button
          onClick={() => onUpdateViewMode('print')}
          title="Print Layout (Page-by-page visual format)"
          className={`flex flex-col items-center p-1.5 rounded transition-colors ${
            viewMode === 'print' ? 'bg-blue-100 text-blue-800 font-semibold' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-600" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Print Layout</span>
        </button>

        <button
          onClick={() => onUpdateViewMode('web')}
          title="Web Layout (Fluid continuous stream)"
          className={`flex flex-col items-center p-1.5 rounded transition-colors ${
            viewMode === 'web' ? 'bg-blue-100 text-blue-800 font-semibold' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Globe className="w-4 h-4 text-emerald-600" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Web Layout</span>
        </button>

        <button
          onClick={() => onUpdateViewMode('read')}
          title="Focus / Reading Mode"
          className={`flex flex-col items-center p-1.5 rounded transition-colors ${
            viewMode === 'read' ? 'bg-blue-100 text-blue-800 font-semibold' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-600" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Focus Read</span>
        </button>
      </div>

      {/* Show / Hide Elements */}
      <div className="flex flex-col gap-1 pr-3 border-r border-slate-200 text-[11px]">
        <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
          <input
            type="checkbox"
            checked={showRuler}
            onChange={onToggleRuler}
            className="rounded text-blue-600 focus:ring-0"
          />
          <RulerIcon className="w-3.5 h-3.5 text-slate-500" />
          <span>Ruler</span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
          <input
            type="checkbox"
            checked={showNavPane}
            onChange={onToggleNavPane}
            className="rounded text-blue-600 focus:ring-0"
          />
          <ListTree className="w-3.5 h-3.5 text-slate-500" />
          <span>Navigation Pane</span>
        </label>
      </div>

      {/* Zoom Group */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onUpdateZoom(100)}
          className={`px-2 py-1 rounded border text-xs font-semibold ${
            zoomLevel === 100 ? 'bg-blue-50 border-blue-400 text-blue-700' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
          }`}
        >
          100%
        </button>

        <button
          onClick={() => onUpdateZoom(Math.max(50, zoomLevel - 15))}
          title="Zoom Out"
          className="p-1 hover:bg-slate-100 rounded text-slate-700"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <span className="text-xs font-semibold tabular-nums text-slate-700 w-10 text-center">
          {zoomLevel}%
        </span>

        <button
          onClick={() => onUpdateZoom(Math.min(200, zoomLevel + 15))}
          title="Zoom In"
          className="p-1 hover:bg-slate-100 rounded text-slate-700"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
