import React, { useState, useEffect } from 'react';
import { X, ListTree, Layers, ChevronRight, Hash } from 'lucide-react';
import { DocumentOutlineItem } from '../../types/document';

interface NavigationPaneProps {
  isOpen: boolean;
  onClose: () => void;
  editorRef: React.RefObject<HTMLDivElement | null>;
}

export const NavigationPane: React.FC<NavigationPaneProps> = ({ isOpen, onClose, editorRef }) => {
  const [activeTab, setActiveTab] = useState<'headings' | 'pages'>('headings');
  const [headings, setHeadings] = useState<DocumentOutlineItem[]>([]);

  useEffect(() => {
    if (!isOpen || !editorRef.current) return;

    const parseHeadings = () => {
      const container = editorRef.current;
      if (!container) return;

      const elements = container.querySelectorAll('h1, h2, h3');
      const items: DocumentOutlineItem[] = [];

      elements.forEach((el, index) => {
        const text = el.textContent?.trim() || '';
        if (text) {
          if (!el.id) {
            el.id = `heading-section-${index}`;
          }
          const level = el.nodeName === 'H1' ? 1 : el.nodeName === 'H2' ? 2 : 3;
          items.push({
            id: el.id,
            text,
            level
          });
        }
      });

      setHeadings(items);
    };

    parseHeadings();
    const interval = setInterval(parseHeadings, 1500);
    return () => clearInterval(interval);
  }, [isOpen, editorRef]);

  if (!isOpen) return null;

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-xs select-none no-print shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-200 bg-slate-50">
        <span className="text-xs font-semibold text-slate-800">Navigation</span>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200/50"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 bg-slate-50/50 px-2 pt-1 text-xs">
        <button
          onClick={() => setActiveTab('headings')}
          className={`pb-2 px-3 font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'headings'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <ListTree className="w-3.5 h-3.5" />
          <span>Headings</span>
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`pb-2 px-3 font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'pages'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Pages</span>
        </button>
      </div>

      {/* Headings List */}
      <div className="flex-1 overflow-y-auto p-2 text-xs">
        {activeTab === 'headings' && (
          <div>
            {headings.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-xs">
                No headings found. Format text as Heading 1, 2, or 3 to build a table of contents outline.
              </div>
            ) : (
              <div className="space-y-0.5">
                {headings.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToHeading(item.id)}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-1.5 truncate group"
                    style={{ paddingLeft: `${(item.level - 1) * 12 + 8}px` }}
                  >
                    <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 shrink-0" />
                    <span
                      className={`truncate ${
                        item.level === 1 ? 'font-semibold text-slate-800' : 'text-slate-600'
                      }`}
                    >
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'pages' && (
          <div className="p-3 text-center">
            <div className="w-24 h-32 mx-auto bg-white border border-slate-300 rounded shadow-xs p-2 flex flex-col justify-between mb-2">
              <div className="space-y-1">
                <div className="w-3/4 h-1.5 bg-slate-300 rounded"></div>
                <div className="w-full h-1 bg-slate-200 rounded"></div>
                <div className="w-5/6 h-1 bg-slate-200 rounded"></div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono text-center">1</div>
            </div>
            <div className="text-xs font-medium text-slate-600">Page 1</div>
          </div>
        )}
      </div>
    </div>
  );
};
