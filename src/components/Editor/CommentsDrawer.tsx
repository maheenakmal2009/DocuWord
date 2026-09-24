import React, { useState } from 'react';
import { X, MessageSquare, Check, Trash2, CornerDownRight, Plus } from 'lucide-react';
import { DocumentComment } from '../../types/document';

interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comments: DocumentComment[];
  onAddComment: (text: string) => void;
  onResolveComment: (id: string) => void;
  onDeleteComment: (id: string) => void;
  onAddReply: (commentId: string, replyText: string) => void;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  isOpen,
  onClose,
  comments,
  onAddComment,
  onResolveComment,
  onDeleteComment,
  onAddReply
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [replyInputs, setReplyInputs] = useState<{ [id: string]: string }>({});

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(newCommentText.trim());
    setNewCommentText('');
  };

  const handleReplySubmit = (commentId: string) => {
    const text = replyInputs[commentId]?.trim();
    if (!text) return;
    onAddReply(commentId, text);
    setReplyInputs({ ...replyInputs, [commentId]: '' });
  };

  return (
    <div className="w-72 bg-white border-l border-slate-200 flex flex-col h-full shadow-md select-none no-print shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-violet-600" />
          <span className="text-xs font-semibold text-slate-800">Comments ({comments.length})</span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200/50"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* New Comment Input Box */}
      <form onSubmit={handleCreate} className="p-3 border-b border-slate-200 bg-slate-50/50">
        <textarea
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Type a new comment..."
          rows={2}
          className="w-full text-xs p-2 border border-slate-300 rounded focus:border-violet-500 focus:outline-none bg-white resize-none"
        />
        <div className="flex justify-end mt-1.5">
          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className="px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded text-xs font-medium disabled:opacity-50 transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post</span>
          </button>
        </div>
      </form>

      {/* Comment List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {comments.length === 0 ? (
          <div className="text-center text-slate-400 text-xs py-8">
            No comments yet. Highlight text and click "New Comment" or type above.
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3 rounded-lg border text-xs space-y-2 transition-all ${
                comment.resolved
                  ? 'bg-slate-50/70 border-slate-200 opacity-60'
                  : 'bg-white border-violet-200 shadow-2xs'
              }`}
            >
              {/* Comment Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-[10px]">
                    {comment.author[0] || 'U'}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">{comment.author}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5">{comment.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onResolveComment(comment.id)}
                    title={comment.resolved ? 'Reopen comment' : 'Mark as resolved'}
                    className={`p-1 rounded hover:bg-slate-100 transition-colors ${
                      comment.resolved ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteComment(comment.id)}
                    title="Delete comment"
                    className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-slate-100 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Text */}
              <div className="text-slate-700 leading-relaxed">{comment.text}</div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="pt-1.5 border-t border-slate-100 space-y-1.5 pl-2">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="text-[11px] bg-slate-50 p-1.5 rounded border border-slate-100">
                      <div className="font-semibold text-slate-700">{reply.author}</div>
                      <div className="text-slate-600 mt-0.5">{reply.text}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Box */}
              {!comment.resolved && (
                <div className="pt-1 flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="Reply..."
                    value={replyInputs[comment.id] || ''}
                    onChange={(e) =>
                      setReplyInputs({ ...replyInputs, [comment.id]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleReplySubmit(comment.id);
                      }
                    }}
                    className="flex-1 px-2 py-1 text-[11px] border border-slate-200 rounded focus:border-violet-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleReplySubmit(comment.id)}
                    className="p-1 text-violet-600 hover:bg-violet-50 rounded"
                  >
                    <CornerDownRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
