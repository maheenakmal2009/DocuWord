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
import { performAutoCorrect } from '../../utils/autoCorrect';
import {
  highlightSpellingErrors,
  clearSpellCheckHighlights,
  checkWord,
  getSpellSuggestions,
  ignoreWordForSession,
  addToCustomDictionary,
  isSpellCheckEnabled
} from '../../utils/spellCheck';
import { TableToolsFloatingBar } from './TableToolsFloatingBar';
import { SpellCheckContextMenu } from './SpellCheckContextMenu';

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

  // Spell Check Context Menu State
  const [spellMenu, setSpellMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    misspelledWord: string;
    suggestions: string[];
    targetSpan: HTMLElement | null;
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    misspelledWord: '',
    suggestions: [],
    targetSpan: null
  });

  // Debounced real-time spell-checking for red wavy underlines
  useEffect(() => {
    if (!internalRef.current || !isSpellCheckEnabled()) return;

    const timer = setTimeout(() => {
      if (internalRef.current) {
        highlightSpellingErrors(internalRef.current);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [content]);

  // Context Menu Handler for Misspelled Words
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSpellCheckEnabled()) return;

    // Check if right-clicked on a .spell-error element
    const target = (e.target as HTMLElement).closest('.spell-error') as HTMLElement | null;
    let clickedWord = '';
    let clickedSpan: HTMLElement | null = null;

    if (target) {
      clickedWord = target.getAttribute('data-spell-word') || target.textContent || '';
      clickedSpan = target;
    } else {
      // Fallback: check word under mouse coordinates
      const range = document.caretRangeFromPoint
        ? document.caretRangeFromPoint(e.clientX, e.clientY)
        : null;
      if (range && range.startContainer.nodeType === Node.TEXT_NODE) {
        const text = range.startContainer.textContent || '';
        const offset = range.startOffset;
        const wordMatch = text.slice(0, offset).match(/\b[A-Za-z]+$/);
        const wordAfter = text.slice(offset).match(/^[A-Za-z]+\b/);
        if (wordMatch || wordAfter) {
          const before = wordMatch ? wordMatch[0] : '';
          const after = wordAfter ? wordAfter[0] : '';
          const word = before + after;
          if (!checkWord(word)) {
            clickedWord = word;
          }
        }
      }
    }

    if (clickedWord) {
      e.preventDefault();
      const suggestions = getSpellSuggestions(clickedWord);
      setSpellMenu({
        isOpen: true,
        position: { x: e.clientX, y: e.clientY },
        misspelledWord: clickedWord,
        suggestions,
        targetSpan: clickedSpan
      });
    }
  };

  // Replace misspelled word with selected correction
  const handleSelectSuggestion = (suggestion: string) => {
    if (spellMenu.targetSpan) {
      const textNode = document.createTextNode(suggestion);
      spellMenu.targetSpan.replaceWith(textNode);
    } else if (internalRef.current) {
      const span = internalRef.current.querySelector(
        `.spell-error[data-spell-word="${spellMenu.misspelledWord}"]`
      );
      if (span) {
        span.replaceWith(document.createTextNode(suggestion));
      }
    }

    if (internalRef.current) {
      onChange(internalRef.current.innerHTML);
      highlightSpellingErrors(internalRef.current);
    }
  };

  // Ignore word for session
  const handleIgnoreWord = (word: string) => {
    ignoreWordForSession(word);
    if (internalRef.current) {
      const spans = internalRef.current.querySelectorAll(
        `.spell-error[data-spell-word="${word}"]`
      );
      spans.forEach((s) => s.replaceWith(document.createTextNode(s.textContent || word)));
      onChange(internalRef.current.innerHTML);
    }
  };

  // Add word to persistent custom dictionary
  const handleAddToDictionary = (word: string) => {
    addToCustomDictionary(word);
    if (internalRef.current) {
      const spans = internalRef.current.querySelectorAll(
        `.spell-error[data-spell-word="${word}"]`
      );
      spans.forEach((s) => s.replaceWith(document.createTextNode(s.textContent || word)));
      onChange(internalRef.current.innerHTML);
    }
  };

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

  // Keyboard Shortcuts & Auto-Correct (local to editable document)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifier = isMac ? e.metaKey : e.ctrlKey;

    if (modifier && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      onOpenInsertLink();
      return;
    }

    // Handle Tab key inside contenteditable
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&emsp;');
      return;
    }

    // Auto-Correct: monitor typos and abbreviations on Space, Enter, or punctuation
    const triggers = [' ', '.', ',', '!', '?', ';', ':', ')', '>'];
    if (!modifier && (triggers.includes(e.key) || e.key === 'Enter')) {
      const corrected = performAutoCorrect(e.key);
      if (corrected) {
        if (e.key !== 'Enter') {
          e.preventDefault();
        }
        if (internalRef.current) {
          onChange(internalRef.current.innerHTML);
        }
        return;
      }
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
            onContextMenu={handleContextMenu}
            className="docuword-content relative z-10 min-h-[700px] outline-none text-[#1e293b]"
            style={{
              fontFamily: 'Calibri, -apple-system, sans-serif',
              fontSize: '11pt'
            }}
          />

          {/* Spell Check Context Menu */}
          <SpellCheckContextMenu
            isOpen={spellMenu.isOpen}
            position={spellMenu.position}
            misspelledWord={spellMenu.misspelledWord}
            suggestions={spellMenu.suggestions}
            onSelectSuggestion={handleSelectSuggestion}
            onIgnoreWord={handleIgnoreWord}
            onAddToDictionary={handleAddToDictionary}
            onClose={() => setSpellMenu((prev) => ({ ...prev, isOpen: false }))}
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
