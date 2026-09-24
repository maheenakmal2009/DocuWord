import React, { useEffect, useRef } from 'react';
import {
  SpellCheck,
  Check,
  PlusCircle,
  EyeOff,
  Sparkles,
  BookA,
  Scissors,
  Copy
} from 'lucide-react';

interface SpellCheckContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  misspelledWord: string;
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
  onIgnoreWord: (word: string) => void;
  onAddToDictionary: (word: string) => void;
  onClose: () => void;
}

export const SpellCheckContextMenu: React.FC<SpellCheckContextMenuProps> = ({
  isOpen,
  position,
  misspelledWord,
  suggestions,
  onSelectSuggestion,
  onIgnoreWord,
  onAddToDictionary,
  onClose
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Ensure menu stays within window viewport
  const menuWidth = 210;
  const menuHeight = 260;
  const left = Math.min(position.x, window.innerWidth - menuWidth - 10);
  const top = Math.min(position.y, window.innerHeight - menuHeight - 10);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-lg shadow-2xl border border-slate-200 py-1.5 text-xs text-slate-700 min-w-[200px] animate-in fade-in zoom-in-95 duration-100 select-none no-print"
      style={{ top: `${Math.max(10, top)}px`, left: `${Math.max(10, left)}px` }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Misspelled Word Header */}
      <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between text-slate-500 bg-slate-50/70 -mt-1.5 rounded-t-lg mb-1">
        <div className="flex items-center gap-1.5">
          <SpellCheck className="w-3.5 h-3.5 text-rose-500" />
          <span className="font-semibold text-rose-600 truncate max-w-[130px]">
            {misspelledWord}
          </span>
        </div>
        <span className="text-[10px] text-slate-400">Spelling</span>
      </div>

      {/* Suggested Corrections */}
      <div className="py-0.5">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, idx) => (
            <button
              key={suggestion}
              onClick={() => {
                onSelectSuggestion(suggestion);
                onClose();
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-slate-800 hover:text-blue-700 font-semibold flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600 opacity-80 group-hover:opacity-100" />
                <span>{suggestion}</span>
              </div>
              {idx === 0 && (
                <span className="text-[9px] bg-blue-100 text-blue-700 px-1 py-0.2 rounded font-normal">
                  Best match
                </span>
              )}
            </button>
          ))
        ) : (
          <div className="px-3 py-2 text-slate-400 italic text-[11px]">
            No spelling suggestions
          </div>
        )}
      </div>

      <div className="h-[1px] bg-slate-100 my-1" />

      {/* Proofing Actions */}
      <button
        onClick={() => {
          onIgnoreWord(misspelledWord);
          onClose();
        }}
        className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-700 flex items-center gap-2 transition-colors"
      >
        <EyeOff className="w-3.5 h-3.5 text-slate-500" />
        <span>Ignore All</span>
      </button>

      <button
        onClick={() => {
          onAddToDictionary(misspelledWord);
          onClose();
        }}
        className="w-full text-left px-3 py-1.5 hover:bg-slate-100 text-slate-700 flex items-center gap-2 transition-colors"
      >
        <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
        <span>Add to Dictionary</span>
      </button>

      <div className="h-[1px] bg-slate-100 my-1" />

      {/* Standard Clipboard Quick Actions */}
      <div className="flex items-center justify-around px-2 py-1 text-slate-500">
        <button
          onClick={() => {
            document.execCommand('copy');
            onClose();
          }}
          className="p-1 hover:bg-slate-100 rounded text-slate-600 flex items-center gap-1 text-[11px]"
          title="Copy"
        >
          <Copy className="w-3 h-3" />
          <span>Copy</span>
        </button>
        <button
          onClick={() => {
            document.execCommand('cut');
            onClose();
          }}
          className="p-1 hover:bg-slate-100 rounded text-slate-600 flex items-center gap-1 text-[11px]"
          title="Cut"
        >
          <Scissors className="w-3 h-3" />
          <span>Cut</span>
        </button>
      </div>
    </div>
  );
};
