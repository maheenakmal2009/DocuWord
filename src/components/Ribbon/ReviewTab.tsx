import React from 'react';
import {
  FileCheck2,
  Hash,
  MessageSquare,
  MessageSquarePlus,
  CheckCircle2,
  Lock,
  Unlock,
  SpellCheck
} from 'lucide-react';

interface ReviewTabProps {
  onOpenWordCount: () => void;
  onAddComment: () => void;
  showComments: boolean;
  onToggleComments: () => void;
  commentCount: number;
  isReadOnly: boolean;
  onToggleReadOnly: () => void;
}

export const ReviewTab: React.FC<ReviewTabProps> = ({
  onOpenWordCount,
  onAddComment,
  showComments,
  onToggleComments,
  commentCount,
  isReadOnly,
  onToggleReadOnly
}) => {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-1 px-3 text-slate-700 text-xs">
      {/* Proofing Group */}
      <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200">
        <button
          onClick={onOpenWordCount}
          title="Word Count, Reading Time, Character Statistics"
          className="flex flex-col items-center p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
        >
          <Hash className="w-4 h-4 text-blue-600" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Word Count</span>
        </button>

        <div className="flex flex-col items-center p-1.5 rounded text-emerald-700 bg-emerald-50/60 border border-emerald-200/60">
          <SpellCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap font-medium">Spelling: Good</span>
        </div>
      </div>

      {/* Comments Group */}
      <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200">
        <button
          onClick={onAddComment}
          title="New Comment on current cursor location"
          className="flex flex-col items-center p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
        >
          <MessageSquarePlus className="w-4 h-4 text-violet-600" />
          <span className="text-[10px] mt-0.5 whitespace-nowrap">New Comment</span>
        </button>

        <button
          onClick={onToggleComments}
          title="Show or hide comments pane"
          className={`flex flex-col items-center p-1.5 rounded transition-colors ${
            showComments ? 'bg-violet-100 text-violet-800' : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4" />
            {commentCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-violet-600 text-white rounded-full text-[9px] w-3.5 h-3.5 flex items-center justify-center font-bold">
                {commentCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 whitespace-nowrap">Show Comments</span>
        </button>
      </div>

      {/* Document Protection */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onToggleReadOnly}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-xs font-medium transition-colors ${
            isReadOnly
              ? 'bg-amber-50 border-amber-300 text-amber-800'
              : 'hover:bg-slate-100 border-slate-200 text-slate-700'
          }`}
        >
          {isReadOnly ? <Lock className="w-3.5 h-3.5 text-amber-600" /> : <Unlock className="w-3.5 h-3.5 text-slate-500" />}
          <span>{isReadOnly ? 'Protected (Read-Only)' : 'Edit Mode'}</span>
        </button>
      </div>
    </div>
  );
};
