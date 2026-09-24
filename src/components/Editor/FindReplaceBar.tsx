import React, { useState, useEffect } from 'react';
import { X, Search, ChevronUp, ChevronDown, Replace } from 'lucide-react';

interface FindReplaceBarProps {
  isOpen: boolean;
  onClose: () => void;
  editorRef: React.RefObject<HTMLDivElement | null>;
}

export const FindReplaceBar: React.FC<FindReplaceBarProps> = ({
  isOpen,
  onClose,
  editorRef
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      clearHighlights();
      setMatchCount(0);
      return;
    }
    handleSearch(searchTerm);
  }, [searchTerm, isOpen]);

  const clearHighlights = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const highlights = editor.querySelectorAll('.search-highlight, .search-highlight-active');
    highlights.forEach((hl) => {
      const parent = hl.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(hl.textContent || ''), hl);
        parent.normalize();
      }
    });
  };

  const handleSearch = (term: string) => {
    clearHighlights();
    if (!term.trim() || !editorRef.current) {
      setMatchCount(0);
      setCurrentMatchIndex(0);
      return;
    }

    const editor = editorRef.current;
    const treeWalker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];

    while (treeWalker.nextNode()) {
      textNodes.push(treeWalker.currentNode as Text);
    }

    let count = 0;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');

    textNodes.forEach((node) => {
      const text = node.nodeValue || '';
      if (regex.test(text)) {
        const matches = text.match(regex);
        count += matches ? matches.length : 0;

        const span = document.createElement('span');
        span.innerHTML = text.replace(regex, '<mark class="search-highlight">$1</mark>');

        if (node.parentNode) {
          node.parentNode.replaceChild(span, node);
        }
      }
    });

    setMatchCount(count);
    setCurrentMatchIndex(count > 0 ? 1 : 0);
    highlightActiveMatch(0);
  };

  const highlightActiveMatch = (index: number) => {
    if (!editorRef.current) return;
    const marks = editorRef.current.querySelectorAll('.search-highlight, .search-highlight-active');
    marks.forEach((m, i) => {
      if (i === index) {
        m.className = 'search-highlight-active';
        m.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        m.className = 'search-highlight';
      }
    });
  };

  const handleNext = () => {
    if (matchCount === 0) return;
    const nextIdx = (currentMatchIndex % matchCount);
    setCurrentMatchIndex(nextIdx + 1);
    highlightActiveMatch(nextIdx);
  };

  const handlePrev = () => {
    if (matchCount === 0) return;
    const prevIdx = (currentMatchIndex - 2 + matchCount) % matchCount;
    setCurrentMatchIndex(prevIdx + 1);
    highlightActiveMatch(prevIdx);
  };

  const handleReplace = () => {
    if (!editorRef.current || matchCount === 0) return;
    const active = editorRef.current.querySelector('.search-highlight-active');
    if (active && active.parentNode) {
      const textNode = document.createTextNode(replaceTerm);
      active.parentNode.replaceChild(textNode, active);
      active.parentNode.normalize();
      handleSearch(searchTerm);
    }
  };

  const handleReplaceAll = () => {
    if (!editorRef.current || matchCount === 0) return;
    const marks = editorRef.current.querySelectorAll('.search-highlight, .search-highlight-active');
    marks.forEach((m) => {
      if (m.parentNode) {
        m.parentNode.replaceChild(document.createTextNode(replaceTerm), m);
        m.parentNode.normalize();
      }
    });
    handleSearch(searchTerm);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-2 right-4 z-40 bg-white border border-slate-300 shadow-xl rounded-lg p-3 w-80 text-xs select-none no-print animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
          <Search className="w-3.5 h-3.5 text-blue-600" />
          <span>Find & Replace</span>
        </div>
        <button
          onClick={() => {
            clearHighlights();
            onClose();
          }}
          className="text-slate-400 hover:text-slate-600 p-0.5 rounded hover:bg-slate-100"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Find input */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Find text in document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            className="w-full pl-2.5 pr-14 py-1 text-xs border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 tabular-nums">
            {matchCount > 0 ? `${currentMatchIndex} of ${matchCount}` : searchTerm ? '0 found' : ''}
          </div>
        </div>

        {/* Previous / Next buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={matchCount === 0}
              className="p-1 border border-slate-200 hover:bg-slate-100 disabled:opacity-40 rounded text-slate-700"
              title="Previous match"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              disabled={matchCount === 0}
              className="p-1 border border-slate-200 hover:bg-slate-100 disabled:opacity-40 rounded text-slate-700"
              title="Next match"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Replace input */}
        <div className="pt-1">
          <input
            type="text"
            placeholder="Replace with..."
            value={replaceTerm}
            onChange={(e) => setReplaceTerm(e.target.value)}
            className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Replace actions */}
        <div className="flex justify-end gap-1.5 pt-1">
          <button
            onClick={handleReplace}
            disabled={matchCount === 0}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium disabled:opacity-40 transition-colors"
          >
            Replace
          </button>
          <button
            onClick={handleReplaceAll}
            disabled={matchCount === 0}
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium disabled:opacity-40 transition-colors"
          >
            Replace All
          </button>
        </div>
      </div>
    </div>
  );
};
