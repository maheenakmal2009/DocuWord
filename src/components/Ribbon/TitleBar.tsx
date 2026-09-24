import React, { useState } from 'react';
import {
  FileText,
  Save,
  Undo2,
  Redo2,
  Printer,
  Download,
  Share2,
  Maximize2,
  Minimize2,
  Sparkles,
  Search,
  Check,
  ChevronDown
} from 'lucide-react';
import { execDocCommand, exportToWordDocument, exportToHtml, exportToTxt, exportToMarkdown } from '../../utils/editorCommands';
import { Margins, PageSize } from '../../types/document';

interface TitleBarProps {
  documentTitle: string;
  setDocumentTitle: (title: string) => void;
  onOpenBackstage: () => void;
  onOpenWordCount: () => void;
  htmlContent: string;
  margins: Margins;
  pageSize: PageSize;
  onSearchCommand: (query: string) => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  documentTitle,
  setDocumentTitle,
  onOpenBackstage,
  onOpenWordCount,
  htmlContent,
  margins,
  pageSize,
  onSearchCommand
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [savedTooltip, setSavedTooltip] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleQuickSave = () => {
    try {
      localStorage.setItem('docuword_autosave_title', documentTitle);
      localStorage.setItem('docuword_autosave_content', htmlContent);
      setSavedTooltip(true);
      setTimeout(() => setSavedTooltip(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-[#185abd] text-white flex items-center justify-between px-3 py-1.5 select-none no-print">
      {/* Left: Quick Access Toolbar & Document Name */}
      <div className="flex items-center gap-2">
        {/* Quick Access Icons */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-white/20">
          <button
            onClick={handleQuickSave}
            title="Save to local storage (Ctrl+S)"
            className="p-1 hover:bg-white/15 rounded text-white/90 hover:text-white transition-colors relative"
          >
            <Save className="w-3.5 h-3.5" />
            {savedTooltip && (
              <span className="absolute -bottom-7 left-0 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap z-50">
                Saved!
              </span>
            )}
          </button>
          <button
            onClick={() => execDocCommand('undo')}
            title="Undo (Ctrl+Z)"
            className="p-1 hover:bg-white/15 rounded text-white/90 hover:text-white transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => execDocCommand('redo')}
            title="Redo (Ctrl+Y)"
            className="p-1 hover:bg-white/15 rounded text-white/90 hover:text-white transition-colors"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => window.print()}
            title="Print Document (Ctrl+P)"
            className="p-1 hover:bg-white/15 rounded text-white/90 hover:text-white transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Document Icon & Title */}
        <div className="flex items-center gap-1.5 ml-1">
          <div className="w-5 h-5 bg-white/15 rounded flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-white" />
          </div>
          {isEditingTitle ? (
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              autoFocus
              className="bg-white text-slate-900 text-xs px-2 py-0.5 rounded font-medium focus:outline-none"
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="text-xs font-semibold text-white/95 hover:bg-white/15 px-2 py-0.5 rounded transition-colors truncate max-w-[200px] sm:max-w-xs"
              title="Click to rename document"
            >
              {documentTitle || 'Untitled Document'}.docx
            </button>
          )}

          <span className="hidden sm:inline-block text-[11px] text-white/70 bg-white/10 px-1.5 py-0.5 rounded">
            Saved
          </span>
        </div>
      </div>

      {/* Center: Command / Search Bar ("Tell me what you want to do") */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-white/60 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search commands, tools, or help..."
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
              onSearchCommand(e.target.value);
            }}
            className="w-full bg-white/15 placeholder:text-white/60 text-white text-xs pl-8 pr-3 py-1 rounded-md focus:bg-white focus:text-slate-900 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1 text-xs bg-white/15 hover:bg-white/25 text-white font-medium px-2.5 py-1 rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="w-3 h-3 text-white/70" />
          </button>

          {showExportMenu && (
            <div
              className="absolute right-0 top-full mt-1 w-48 bg-white text-slate-800 rounded-md shadow-lg border border-slate-200 py-1 z-50 text-xs animate-in fade-in zoom-in-95"
              onClick={() => setShowExportMenu(false)}
            >
              <button
                onClick={() => exportToWordDocument(documentTitle, htmlContent, margins, pageSize)}
                className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Word Document (.doc)</span>
              </button>
              <button
                onClick={() => window.print()}
                className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                <span>PDF Document (Print)</span>
              </button>
              <button
                onClick={() => exportToHtml(documentTitle, htmlContent)}
                className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                <span>Web Page (.html)</span>
              </button>
              <button
                onClick={() => exportToMarkdown(documentTitle, htmlContent)}
                className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <span>Markdown (.md)</span>
              </button>
              <button
                onClick={() => exportToTxt(documentTitle, htmlContent)}
                className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                <span>Plain Text (.txt)</span>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          className="p-1 hover:bg-white/15 rounded text-white/90 hover:text-white transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>

        {/* User profile avatar indicator */}
        <div className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-bold text-[11px] flex items-center justify-center ml-1 border border-white/20">
          U
        </div>
      </div>
    </div>
  );
};
