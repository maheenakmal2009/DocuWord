import React from 'react';
import {
  FileText,
  Globe,
  BookOpen,
  SpellCheck,
  Check,
  ZoomIn,
  ZoomOut,
  HardDrive
} from 'lucide-react';
import { ViewMode } from '../../types/document';

interface StatusBarProps {
  wordCount: number;
  charCount: number;
  onOpenWordCount: () => void;
  viewMode: ViewMode;
  onUpdateViewMode: (mode: ViewMode) => void;
  zoomLevel: number;
  onUpdateZoom: (zoom: number) => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  wordCount,
  charCount,
  onOpenWordCount,
  viewMode,
  onUpdateViewMode,
  zoomLevel,
  onUpdateZoom
}) => {
  return (
    <div className="h-6 bg-[#185abd] text-white flex items-center justify-between px-3 text-[11px] select-none no-print status-bar-container z-30 shrink-0">
      {/* Left Info: Page, Words, Language, Proofing */}
      <div className="flex items-center gap-3">
        <span className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-default">
          Page 1 of 1
        </span>

        <button
          onClick={onOpenWordCount}
          className="hover:bg-white/10 px-1.5 py-0.5 rounded transition-colors tabular-nums font-medium"
          title="Click to view detailed document statistics"
        >
          {wordCount.toLocaleString()} words
        </button>

        <span className="hidden sm:inline-block text-white/80 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-default">
          English (United States)
        </span>

        <div
          className="hidden md:flex items-center gap-1 text-white/80 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-default"
          title="Spelling and grammar check is ready"
        >
          <SpellCheck className="w-3.5 h-3.5 text-white/90" />
        </div>

        <div className="hidden lg:flex items-center gap-1 text-white/70 text-[10px]">
          <HardDrive className="w-3 h-3" />
          <span>Saved to local storage</span>
        </div>
      </div>

      {/* Right Controls: View toggles & Zoom */}
      <div className="flex items-center gap-2">
        {/* View toggles */}
        <div className="flex items-center gap-0.5 border-r border-white/20 pr-2 mr-1">
          <button
            onClick={() => onUpdateViewMode('read')}
            title="Focus Reading Mode"
            className={`p-1 rounded transition-colors ${
              viewMode === 'read' ? 'bg-white/30 text-white' : 'hover:bg-white/10 text-white/80'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onUpdateViewMode('print')}
            title="Print Layout (Page View)"
            className={`p-1 rounded transition-colors ${
              viewMode === 'print' ? 'bg-white/30 text-white' : 'hover:bg-white/10 text-white/80'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onUpdateViewMode('web')}
            title="Web Layout"
            className={`p-1 rounded transition-colors ${
              viewMode === 'web' ? 'bg-white/30 text-white' : 'hover:bg-white/10 text-white/80'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onUpdateZoom(Math.max(50, zoomLevel - 10))}
            title="Zoom Out"
            className="hover:bg-white/10 p-0.5 rounded"
          >
            <ZoomOut className="w-3 h-3 text-white/90" />
          </button>

          <input
            type="range"
            min="50"
            max="200"
            step="5"
            value={zoomLevel}
            onChange={(e) => onUpdateZoom(parseInt(e.target.value) || 100)}
            className="w-16 h-1 accent-white bg-white/30 rounded cursor-pointer"
          />

          <button
            onClick={() => onUpdateZoom(Math.min(200, zoomLevel + 10))}
            title="Zoom In"
            className="hover:bg-white/10 p-0.5 rounded"
          >
            <ZoomIn className="w-3 h-3 text-white/90" />
          </button>

          <button
            onClick={() => onUpdateZoom(100)}
            title="Reset Zoom to 100%"
            className="w-10 text-right font-mono text-[10px] tabular-nums hover:underline cursor-pointer"
          >
            {zoomLevel}%
          </button>
        </div>
      </div>
    </div>
  );
};
