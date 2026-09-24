import React, { useState, useEffect } from 'react';
import { X, Link2 } from 'lucide-react';
import { insertLink } from '../../utils/editorCommands';

interface InsertLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InsertLinkModal: React.FC<InsertLinkModalProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (isOpen) {
      const sel = window.getSelection();
      const selected = sel ? sel.toString().trim() : '';
      setDisplayText(selected);
      setUrl('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl) && !/^mailto:/i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    insertLink(targetUrl, displayText.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 dialog-overlay">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <Link2 className="w-4 h-4 text-blue-600" />
            <span>Insert Hyperlink</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Text to display</label>
            <input
              type="text"
              placeholder="e.g. Official Project Roadmap"
              value={displayText}
              onChange={(e) => setDisplayText(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Link Target (URL)</label>
            <input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              autoFocus
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!url.trim()}
              className="px-4 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Insert Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
