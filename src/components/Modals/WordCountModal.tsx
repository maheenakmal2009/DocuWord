import React from 'react';
import { X, Clock, FileText, AlignLeft, Hash } from 'lucide-react';

interface WordCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
}

export const WordCountModal: React.FC<WordCountModalProps> = ({ isOpen, onClose, htmlContent }) => {
  if (!isOpen) return null;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  const text = tempDiv.innerText || tempDiv.textContent || '';

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charactersWithSpaces = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const paragraphs = (htmlContent.match(/<p\b[^>]*>/gi) || []).length || (text.split(/\n+/).filter(Boolean).length || 1);
  const headings = (htmlContent.match(/<h[1-6]\b[^>]*>/gi) || []).length;
  const tables = (htmlContent.match(/<table\b[^>]*>/gi) || []).length;

  // Average reading speed 200 words per minute; speaking 130 wpm
  const readMinutes = Math.max(1, Math.round(words / 200));
  const speakMinutes = Math.max(1, Math.round(words / 130));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 dialog-overlay">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Word Count & Document Statistics</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Total Words</div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums mt-0.5">{words.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Characters (no spaces)</div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums mt-0.5">{charactersNoSpaces.toLocaleString()}</div>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-sm border-t border-b border-slate-100 py-1">
            <div className="flex justify-between py-2 text-slate-600">
              <span>Characters (with spaces)</span>
              <span className="font-semibold text-slate-800 tabular-nums">{charactersWithSpaces.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 text-slate-600">
              <span>Paragraphs</span>
              <span className="font-semibold text-slate-800 tabular-nums">{paragraphs.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 text-slate-600">
              <span>Headings / Sections</span>
              <span className="font-semibold text-slate-800 tabular-nums">{headings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 text-slate-600">
              <span>Tables embedded</span>
              <span className="font-semibold text-slate-800 tabular-nums">{tables}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 bg-blue-50/70 text-blue-900 p-3 rounded border border-blue-100">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Est. Reading: ~{readMinutes} min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-blue-600" />
              <span>Est. Speaking: ~{speakMinutes} min</span>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
