import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Search,
  Plus,
  Trash2,
  RotateCcw,
  Check,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import {
  AutoCorrectEntry,
  getAutoCorrectRules,
  saveAutoCorrectRules,
  isAutoCorrectEnabled,
  setAutoCorrectEnabled,
  BUILT_IN_AUTOCORRECT
} from '../../utils/autoCorrect';

interface AutoCorrectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleEnabled?: (enabled: boolean) => void;
}

export const AutoCorrectModal: React.FC<AutoCorrectModalProps> = ({
  isOpen,
  onClose,
  onToggleEnabled
}) => {
  const [rules, setRules] = useState<AutoCorrectEntry[]>(getAutoCorrectRules());
  const [enabled, setEnabled] = useState<boolean>(isAutoCorrectEnabled());
  const [searchQuery, setSearchQuery] = useState('');
  const [newFrom, setNewFrom] = useState('');
  const [newTo, setNewTo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'typo' | 'contraction' | 'symbol' | 'custom'>('all');
  const [testText, setTestText] = useState('');

  if (!isOpen) return null;

  const handleToggleState = () => {
    const next = !enabled;
    setEnabled(next);
    setAutoCorrectEnabled(next);
    onToggleEnabled?.(next);
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFrom.trim() || !newTo.trim()) return;

    const fromTrimmed = newFrom.trim();
    const toTrimmed = newTo.trim();

    // Check if rule already exists and update or append
    const updated = rules.filter((r) => r.from.toLowerCase() !== fromTrimmed.toLowerCase());
    const newEntry: AutoCorrectEntry = {
      from: fromTrimmed,
      to: toTrimmed,
      category: 'custom'
    };

    const finalRules = [newEntry, ...updated];
    setRules(finalRules);
    saveAutoCorrectRules(finalRules);
    setNewFrom('');
    setNewTo('');
  };

  const handleDeleteRule = (fromText: string) => {
    const updated = rules.filter((r) => r.from !== fromText);
    setRules(updated);
    saveAutoCorrectRules(updated);
  };

  const handleResetToDefaults = () => {
    setRules(BUILT_IN_AUTOCORRECT);
    saveAutoCorrectRules(BUILT_IN_AUTOCORRECT);
  };

  const filteredRules = rules.filter((r) => {
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch =
      r.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.to.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 dialog-overlay select-none">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AutoCorrect Options & Proofing</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Main Toggle Switch */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50/60 border border-blue-200/60">
            <div>
              <div className="text-xs font-semibold text-slate-800">
                Replace text as you type
              </div>
              <div className="text-[11px] text-slate-500">
                Automatically corrects typos, common abbreviations, and symbols on space or punctuation.
              </div>
            </div>
            <button
              onClick={handleToggleState}
              className={`p-1 transition-colors rounded ${
                enabled ? 'text-blue-600 hover:text-blue-700' : 'text-slate-400 hover:text-slate-500'
              }`}
            >
              {enabled ? (
                <ToggleRight className="w-8 h-8 fill-blue-600 text-white" />
              ) : (
                <ToggleLeft className="w-8 h-8 fill-slate-300 text-white" />
              )}
            </button>
          </div>

          {/* Add New Custom Replacement Entry */}
          <form
            onSubmit={handleAddRule}
            className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5"
          >
            <span className="text-xs font-semibold text-slate-700 block">
              Add New Custom Replacement
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Replace: (e.g. teh, adr)"
                  value={newFrom}
                  onChange={(e) => setNewFrom(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="With: (e.g. the, 123 Main St)"
                  value={newTo}
                  onChange={(e) => setNewTo(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={!newFrom.trim() || !newTo.trim()}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded text-xs font-medium flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </form>

          {/* Search & Categories Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search auto-correct entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-slate-200 rounded bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button
                onClick={handleResetToDefaults}
                title="Reset to default dictionary"
                className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-100 rounded text-slate-600 text-xs flex items-center gap-1 shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 text-[11px] overflow-x-auto pb-0.5">
              {(['all', 'typo', 'contraction', 'symbol', 'custom'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 rounded capitalize whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? `All (${rules.length})` : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Rules Table */}
          <div className="border border-slate-200 rounded-md overflow-hidden max-h-56 overflow-y-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-600 font-semibold sticky top-0 border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-1.5 px-3">Replace</th>
                  <th className="py-1.5 px-3">With</th>
                  <th className="py-1.5 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRules.length > 0 ? (
                  filteredRules.map((rule) => (
                    <tr key={`${rule.from}-${rule.to}`} className="hover:bg-slate-50/80">
                      <td className="py-1.5 px-3 font-mono text-[11px] text-slate-800 font-medium">
                        {rule.from}
                      </td>
                      <td className="py-1.5 px-3 text-slate-700">
                        {rule.to}
                      </td>
                      <td className="py-1.5 px-2 text-right">
                        <button
                          onClick={() => handleDeleteRule(rule.from)}
                          title="Delete rule"
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-xs text-slate-400">
                      No matching auto-correct entries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            {rules.length} active auto-correct replacements
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
