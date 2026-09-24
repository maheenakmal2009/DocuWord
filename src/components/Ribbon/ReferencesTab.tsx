import React from 'react';
import {
  BookMarked,
  FileText,
  Bookmark,
  ArrowDown,
  RefreshCw,
  Quote,
  ListTree
} from 'lucide-react';
import { insertFootnote, renumberFootnotes } from '../../utils/editorCommands';

export const ReferencesTab: React.FC = () => {
  const handleScrollToFootnotes = () => {
    const editor = document.querySelector('.docuword-content') as HTMLElement | null;
    const area = editor?.querySelector('.docuword-footnotes-area');
    if (area) {
      area.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      // If no footnotes yet, insert one!
      insertFootnote();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-1 px-3 text-slate-700 text-xs">
      {/* Group: Footnotes */}
      <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200">
        <button
          onClick={() => insertFootnote()}
          title="Insert Footnote (Add note reference at current cursor or selection)"
          className="flex flex-col items-center p-1.5 hover:bg-slate-100 rounded text-slate-800 transition-colors group"
        >
          <div className="relative flex items-center justify-center p-0.5">
            <span className="font-serif font-bold text-sm text-blue-700">AB</span>
            <sup className="text-[10px] font-bold text-blue-600 ml-0.5">¹</sup>
          </div>
          <span className="text-[10px] mt-0.5 whitespace-nowrap font-medium">Insert Footnote</span>
        </button>

        <div className="flex flex-col gap-0.5 ml-1">
          <button
            onClick={handleScrollToFootnotes}
            title="Jump to Footnotes section at bottom of canvas"
            className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 text-[11px]"
          >
            <ArrowDown className="w-3 h-3 text-slate-500" />
            <span>Show Notes</span>
          </button>

          <button
            onClick={renumberFootnotes}
            title="Renumber Footnotes sequentially"
            className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 text-[11px]"
          >
            <RefreshCw className="w-3 h-3 text-slate-500" />
            <span>Renumber</span>
          </button>
        </div>
      </div>

      {/* Group: Table of Contents & Citations */}
      <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200">
        <button
          onClick={() => {
            const tocHtml = `
              <div class="docuword-toc" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px 18px; margin: 20px 0; font-family: inherit;">
                <div style="font-weight: bold; font-size: 13pt; margin-bottom: 8px; color: #1e293b; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">Table of Contents</div>
                <ul style="list-style: none; padding-left: 0; margin: 0; line-height: 1.8; font-size: 10.5pt; color: #2563eb;">
                  <li style="display: flex; justify-content: space-between;"><span>1. Executive Summary</span><span style="color: #64748b;">Page 1</span></li>
                  <li style="display: flex; justify-content: space-between;"><span>2. Architectural Blueprint</span><span style="color: #64748b;">Page 1</span></li>
                  <li style="display: flex; justify-content: space-between;"><span>3. Implementation Schedule</span><span style="color: #64748b;">Page 1</span></li>
                </ul>
              </div><p><br></p>
            `;
            document.execCommand('insertHTML', false, tocHtml);
          }}
          title="Insert Table of Contents"
          className="flex flex-col items-center p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
        >
          <ListTree className="w-4 h-4 text-slate-600" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Table of Contents</span>
        </button>
      </div>

      {/* Group: Citations & Quotes */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => {
            const quoteHtml = `
              <blockquote style="border-left: 3px solid #2563eb; margin: 16px 0; padding: 6px 14px; font-style: italic; color: #475569; background-color: #f8fafc;">
                "Citation or quoted reference text goes here." &mdash; <span style="font-style: normal; font-weight: 600;">Author / Source (2026)</span>
              </blockquote><p><br></p>
            `;
            document.execCommand('insertHTML', false, quoteHtml);
          }}
          title="Insert Citation / Blockquote"
          className="flex flex-col items-center p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
        >
          <Quote className="w-4 h-4 text-indigo-600" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Citation</span>
        </button>
      </div>
    </div>
  );
};
