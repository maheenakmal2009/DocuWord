import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { insertSymbol } from '../../utils/editorCommands';

interface SpecialSymbolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SYMBOL_CATEGORIES = [
  {
    category: 'Common & Typography',
    symbols: ['©', '®', '™', '§', '¶', '•', '—', '–', '…', '“', '”', '‘', '’', '«', '»', '°']
  },
  {
    category: 'Currency',
    symbols: ['$', '€', '£', '¥', '₹', '₽', '₩', '₿', '¢', '¤']
  },
  {
    category: 'Mathematics & Logic',
    symbols: ['±', '×', '÷', '≠', '≈', '≤', '≥', '∞', '∑', '√', 'π', 'Δ', '∫', '∂', 'µ', '‰']
  },
  {
    category: 'Arrows & Badges',
    symbols: ['←', '→', '↑', '↓', '↔', '⇒', '⇔', '✓', '✔', '✕', '★', '☆', '▲', '▼', '◆', '●']
  }
];

export const SpecialSymbolsModal: React.FC<SpecialSymbolsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePickSymbol = (sym: string) => {
    insertSymbol(sym);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 dialog-overlay">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Insert Symbol</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {SYMBOL_CATEGORIES.map((cat, idx) => (
            <div key={idx}>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {cat.category}
              </div>
              <div className="grid grid-cols-8 gap-1.5">
                {cat.symbols.map((sym, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => handlePickSymbol(sym)}
                    className="w-10 h-10 flex items-center justify-center text-base rounded border border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    title={`Insert ${sym}`}
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded text-xs font-medium hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
