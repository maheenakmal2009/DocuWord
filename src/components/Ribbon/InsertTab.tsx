import React from 'react';
import {
  FileText,
  Table as TableIcon,
  Image as ImageIcon,
  Link2,
  MessageSquarePlus,
  Minus,
  AlertCircle,
  Clock,
  Sparkles,
  BookOpen,
  SplitSquareVertical
} from 'lucide-react';
import {
  insertPageBreak,
  insertCallout,
  insertDate,
  execDocCommand,
  insertFootnote
} from '../../utils/editorCommands';

interface InsertTabProps {
  onOpenInsertTable: () => void;
  onOpenInsertImage: () => void;
  onOpenInsertLink: () => void;
  onOpenSpecialSymbols: () => void;
  onAddComment: () => void;
}

export const InsertTab: React.FC<InsertTabProps> = ({
  onOpenInsertTable,
  onOpenInsertImage,
  onOpenInsertLink,
  onOpenSpecialSymbols,
  onAddComment
}) => {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-1 px-3 text-slate-700 text-xs">
      {/* Group: Pages */}
      <div className="flex items-center gap-1 pr-3 border-r border-slate-200">
        <button
          onClick={insertPageBreak}
          title="Insert Page Break (Ctrl+Enter)"
          className="flex flex-col items-center p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
        >
          <SplitSquareVertical className="w-4 h-4 text-blue-600" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Page Break</span>
        </button>

        <button
          onClick={() => {
            const hrHtml = `<hr style="border: 0; height: 1px; background-color: #cbd5e1; margin: 24px 0;" /><p><br></p>`;
            document.execCommand('insertHTML', false, hrHtml);
          }}
          title="Insert Horizontal Divider"
          className="flex flex-col items-center p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
        >
          <Minus className="w-4 h-4 text-slate-600" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Divider</span>
        </button>
      </div>

      {/* Group: Tables */}
      <div className="flex items-center gap-1 pr-3 border-r border-slate-200">
        <button
          onClick={onOpenInsertTable}
          title="Insert Table with custom rows and columns"
          className="flex flex-col items-center p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
        >
          <TableIcon className="w-4 h-4 text-emerald-600" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Table</span>
        </button>
      </div>

      {/* Group: Illustrations & Callouts */}
      <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200">
        <button
          onClick={onOpenInsertImage}
          title="Insert Pictures from web URL, upload, or stock gallery"
          className="flex flex-col items-center p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
        >
          <ImageIcon className="w-4 h-4 text-blue-500" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Pictures</span>
        </button>

        <button
          onClick={() => insertCallout('info', 'Enter project takeaway or highlight here.')}
          title="Insert Information Callout Box"
          className="flex flex-col items-center p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
        >
          <AlertCircle className="w-4 h-4 text-sky-600" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Callout Box</span>
        </button>

        <button
          onClick={() => insertCallout('warning', 'Important cautionary notice or constraint.')}
          title="Insert Warning Callout Box"
          className="flex flex-col items-center p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
        >
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Warning Box</span>
        </button>
      </div>

      {/* Group: Links & Collaboration */}
      <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200">
        <button
          onClick={onOpenInsertLink}
          title="Insert Hyperlink"
          className="flex flex-col items-center p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
        >
          <Link2 className="w-4 h-4 text-indigo-600" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Hyperlink</span>
        </button>

        <button
          onClick={onAddComment}
          title="Add Inline Comment"
          className="flex flex-col items-center p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
        >
          <MessageSquarePlus className="w-4 h-4 text-violet-600" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">New Comment</span>
        </button>
      </div>

      {/* Group: References & Footnotes */}
      <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200">
        <button
          onClick={() => insertFootnote()}
          title="Insert Footnote (Add note reference to selected word with entry at bottom)"
          className="flex flex-col items-center p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
        >
          <div className="relative flex items-center justify-center">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="absolute -top-1 -right-1 text-[9px] font-bold text-blue-700 bg-blue-50 rounded-full px-0.5 leading-none">¹</span>
          </div>
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Insert Footnote</span>
        </button>
      </div>

      {/* Group: Date & Symbols */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={insertDate}
          title="Insert Current Date"
          className="flex flex-col items-center p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
        >
          <Clock className="w-4 h-4 text-slate-600" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Date / Time</span>
        </button>

        <button
          onClick={onOpenSpecialSymbols}
          title="Insert Special Symbol or Math Character"
          className="flex flex-col items-center p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Symbols</span>
        </button>
      </div>
    </div>
  );
};
