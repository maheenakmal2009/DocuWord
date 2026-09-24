import React, { useEffect, useRef, useState } from 'react';
import {
  Margins,
  PageSize,
  Orientation,
  WatermarkConfig,
  ViewMode,
  ActiveFormats
} from '../../types/document';
import { queryActiveFormats, getSelectedTableContext } from '../../utils/editorCommands';
import { TableToolsFloatingBar } from './TableToolsFloatingBar';

interface DocumentPageProps {
  content: string;
  onChange: (html: string) => void;
  margins: Margins;
  pageSize: PageSize;
  orientation: Orientation;
  pageColor: string;
  watermark: WatermarkConfig;
  viewMode: ViewMode;
  zoomLevel: number;
  isReadOnly: boolean;
  onUpdateActiveFormats: (formats: ActiveFormats) => void;
  onToggleFindReplace: () => void;
  onOpenInsertLink: () => void;
  editorRef: React.RefObject<HTMLDivElement | null>;
  documentTitle: string;
}

export const DocumentPage: React.FC<DocumentPageProps> = ({
  content,
  onChange,
  margins,
  pageSize,
  orientation,
  pageColor,
  watermark,
  viewMode,
  zoomLevel,
  isReadOnly,
  onUpdateActiveFormats,
  onToggleFindReplace,
  onOpenInsertLink,
  editorRef,
  documentTitle
}) => {
  const [tableToolsPos, setTableToolsPos] = useState<{ top: number; left: number } | null>(null);
  const internalRef = useRef<HTMLDivElement | null>(null);

  // Sync ref with external ref
  const setRefs = (el: HTMLDivElement | null) => {
    internalRef.current = el;
    if (editorRef) {
      (editorRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    }
  };

  // Dimensions in inches at 96 DPI
  const getPageDimensions = () => {
    let widthInches = 8.5;
    let heightInches = 11.0;

    if (pageSize === 'a4') {
      widthInches = 8.27;
      heightInches = 11.69;
    } else if (pageSize === 'legal') {
      widthInches = 8.5;
      heightInches = 14.0;
    }

    if (orientation === 'landscape') {
      const temp = widthInches;
      widthInches = heightInches;
      heightInches = temp;
    }

    return {
      widthPx: Math.round(widthInches * 96),
      minHeightPx: Math.round(heightInches * 96)
    };
  };

  const { widthPx, minHeightPx } = getPageDimensions();

  // Handle Input Changes
  const handleInput = () => {
    if (internalRef.current) {
      onChange(internalRef.current.innerHTML);
    }
  };

  // Sync selection to detect active ribbon formatting & table tools
  const handleSelectionChange = () => {
    const formats = queryActiveFormats();
    onUpdateActiveFormats(formats);

    const { table } = getSelectedTableContext();
    if (table) {
      const rect = table.getBoundingClientRect();
      setTableToolsPos({ top: rect.top, left: rect.left });
    } else {
      setTableToolsPos(null);
    }
  };

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  // Keyboard Shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifier = isMac ? e.metaKey : e.ctrlKey;

    if (modifier) {
      switch (e.key.toLowerCase()) {
        case 's':
          e.preventDefault();
          try {
            localStorage.setItem('docuword_autosave_title', documentTitle);
            localStorage.setItem('docuword_autosave_content', content);
          } catch (err) {
            console.error(err);
          }
          break;
        case 'p':
          e.preventDefault();
          window.print();
          break;
        case 'f':
          e.preventDefault();
          onToggleFindReplace();
          break;
        case 'k':
          e.preventDefault();
          onOpenInsertLink();
          break;
        default:
          break;
      }
    }

    // Handle Tab key inside contenteditable
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&emsp;');
    }
  };

  // Initial Content Load
  useEffect(() => {
    if (internalRef.current && internalRef.current.innerHTML !== content) {
      // Only set if substantially different to avoid cursor jumps
      if (internalRef.current.innerHTML.trim() === '') {
        internalRef.current.innerHTML = content;
      }
    }
  }, [content]);

  // Margin styles in pixels (1 inch = 96px)
  const marginStyles = {
    paddingTop: `${margins.top * 96}px`,
    paddingRight: `${margins.right * 96}px`,
    paddingBottom: `${margins.bottom * 96}px`,
    paddingLeft: `${margins.left * 96}px`
  };

  return (
    <div
      className={`flex-1 overflow-auto flex justify-center p-4 sm:p-8 transition-colors ${
        viewMode === 'read' ? 'bg-[#f4f6f8]' : 'bg-[#eaedf1]'
      }`}
      onClick={(e) => {
        // If user clicks the outer desk area, focus editor at end
        if (e.target === e.currentTarget && internalRef.current) {
          internalRef.current.focus();
        }
      }}
    >
      {/* Table tools floating bar */}
      <TableToolsFloatingBar
        isVisible={!!tableToolsPos && !isReadOnly}
        position={tableToolsPos || { top: 0, left: 0 }}
      />

      {/* Zoom wrapper */}
      <div
        className="transition-transform duration-100 ease-out origin-top flex flex-col items-center print-page-container"
        style={{
          transform: viewMode === 'web' ? 'none' : `scale(${zoomLevel / 100})`,
          width: viewMode === 'web' ? '100%' : 'auto'
        }}
      >
        {/* Paper Page Container */}
        <div
          className={`docuword-page relative transition-all duration-150 ${
            viewMode === 'web'
              ? 'w-full max-w-4xl min-h-[90vh] bg-white rounded-md shadow-sm border border-slate-200'
              : viewMode === 'read'
              ? 'bg-white rounded-lg shadow-md max-w-3xl min-h-[90vh]'
              : 'bg-white shadow-[0_4px_24px_rgba(0,0,0,0.12),0_1px_4px_rgba(0,0,0,0.06)] border border-slate-200/80 mb-12'
          }`}
          style={{
            backgroundColor: pageColor || '#ffffff',
            width: viewMode === 'print' ? `${widthPx}px` : undefined,
            minHeight: viewMode === 'print' ? `${minHeightPx}px` : undefined,
            ...marginStyles
          }}
        >
          {/* Header Area (Print Layout only) */}
          {viewMode === 'print' && (
            <div
              className="absolute top-4 left-0 right-0 px-8 flex justify-between items-center text-[10px] text-slate-400 font-sans border-b border-transparent select-none no-print"
              style={{
                left: `${margins.left * 96}px`,
                right: `${margins.right * 96}px`,
                padding: 0
              }}
            >
              <span className="truncate max-w-xs">{documentTitle || 'Document'}</span>
              <span>DocuWord</span>
            </div>
          )}

          {/* Watermark Overlay */}
          {watermark.enabled && watermark.text && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
              style={{ opacity: watermark.opacity }}
            >
              <span
                className="text-slate-900 font-bold uppercase tracking-widest text-center whitespace-nowrap rotate-[-35deg]"
                style={{
                  fontSize: `${Math.min(90, widthPx / 8)}px`,
                  color: watermark.color || '#94a3b8'
                }}
              >
                {watermark.text}
              </span>
            </div>
          )}

          {/* Core ContentEditable Canvas */}
          <div
            ref={setRefs}
            contentEditable={!isReadOnly}
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className="docuword-content relative z-10 min-h-[700px] outline-none text-[#1e293b]"
            style={{
              fontFamily: 'Calibri, -apple-system, sans-serif',
              fontSize: '11pt'
            }}
          />

          {/* Footer Area (Print Layout only) */}
          {viewMode === 'print' && (
            <div
              className="absolute bottom-4 left-0 right-0 px-8 flex justify-between items-center text-[10px] text-slate-400 font-sans select-none no-print"
              style={{
                left: `${margins.left * 96}px`,
                right: `${margins.right * 96}px`,
                padding: 0
              }}
            >
              <span>Confidential &bull; Internal Use</span>
              <span className="font-mono">Page 1</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
