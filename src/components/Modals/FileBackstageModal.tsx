import React, { useState } from 'react';
import {
  ArrowLeft,
  FilePlus,
  FolderOpen,
  Save,
  Printer,
  Info,
  Download,
  FileText,
  FileCode,
  File,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import { PRESET_DOCUMENTS } from '../../templates/presetDocuments';
import { DocumentTemplate, Margins, PageSize } from '../../types/document';
import {
  exportToWordDocument,
  exportToHtml,
  exportToTxt,
  exportToMarkdown
} from '../../utils/editorCommands';

interface FileBackstageModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  setDocumentTitle: (title: string) => void;
  htmlContent: string;
  onLoadTemplate: (template: DocumentTemplate) => void;
  onImportContent: (title: string, content: string) => void;
  margins: Margins;
  pageSize: PageSize;
}

export const FileBackstageModal: React.FC<FileBackstageModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  setDocumentTitle,
  htmlContent,
  onLoadTemplate,
  onImportContent,
  margins,
  pageSize
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'new' | 'open' | 'save' | 'print'>('info');

  if (!isOpen) return null;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  const rawText = tempDiv.innerText || tempDiv.textContent || '';
  const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;
  const charCount = rawText.length;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const title = file.name.replace(/\.[^/.]+$/, '');
        onImportContent(title, content);
        onClose();
      }
    };
    reader.readAsText(file);
  };

  const handlePrint = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-white animate-in fade-in duration-150">
      {/* Word Signature Blue Sidebar */}
      <div className="w-56 bg-[#185abd] text-white flex flex-col py-4 px-2 select-none shadow-md shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors text-sm font-medium mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Document</span>
        </button>

        <div className="space-y-1">
          <button
            onClick={() => setActiveTab('info')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'info' ? 'bg-[#104896] text-white font-semibold shadow-xs' : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Info</span>
          </button>

          <button
            onClick={() => setActiveTab('new')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'new' ? 'bg-[#104896] text-white font-semibold shadow-xs' : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <FilePlus className="w-4 h-4" />
            <span>New</span>
          </button>

          <button
            onClick={() => setActiveTab('open')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'open' ? 'bg-[#104896] text-white font-semibold shadow-xs' : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Open</span>
          </button>

          <button
            onClick={() => setActiveTab('save')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'save' ? 'bg-[#104896] text-white font-semibold shadow-xs' : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Save & Export</span>
          </button>

          <button
            onClick={() => setActiveTab('print')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'print' ? 'bg-[#104896] text-white font-semibold shadow-xs' : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>

        <div className="mt-auto px-3 py-2 text-xs text-white/60 border-t border-white/15">
          DocuWord Office Engine &bull; v2026.1
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50 p-8 sm:p-12">
        {activeTab === 'info' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Document Information</h1>
              <p className="text-sm text-slate-500 mt-1">Properties, metadata, and status for this active document.</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  className="w-full text-lg font-semibold text-slate-800 border-b border-slate-300 focus:border-blue-600 focus:outline-none py-1"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-sm">
                <div>
                  <div className="text-xs text-slate-400">Words</div>
                  <div className="text-xl font-bold text-slate-800 tabular-nums">{wordCount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Characters</div>
                  <div className="text-xl font-bold text-slate-800 tabular-nums">{charCount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Paper Size</div>
                  <div className="text-base font-semibold text-slate-800 uppercase">{pageSize}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Storage State</div>
                  <div className="text-sm font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" /> Local Ready
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  exportToWordDocument(documentTitle, htmlContent, margins, pageSize);
                  onClose();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded shadow-xs flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export as Word (.doc/.docx)</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded shadow-xs flex items-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'new' && (
          <div className="max-w-4xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">New Document</h1>
              <p className="text-sm text-slate-500 mt-1">Start from a blank document or select a curated professional template.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRESET_DOCUMENTS.map((template) => (
                <div
                  key={template.id}
                  onClick={() => {
                    onLoadTemplate(template);
                    onClose();
                  }}
                  className="group bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md rounded-lg p-5 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-md bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      {template.badge && (
                        <span className="text-[11px] font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          {template.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {template.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {template.description}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-medium">
                    <span>Create Document</span>
                    <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'open' && (
          <div className="max-w-xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Open Document</h1>
              <p className="text-sm text-slate-500 mt-1">Open an existing document from your local storage.</p>
            </div>

            <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50/20 rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors shadow-xs">
              <FolderOpen className="w-12 h-12 text-blue-500 mb-3" />
              <span className="text-sm font-semibold text-slate-800">Browse files on this PC</span>
              <span className="text-xs text-slate-400 mt-1">Supports HTML, TXT, MD, DOC formats</span>
              <input
                type="file"
                accept=".html,.htm,.txt,.md,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {activeTab === 'save' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Save & Export</h1>
              <p className="text-sm text-slate-500 mt-1">Download and export your document into universal industry formats.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => {
                  exportToWordDocument(documentTitle, htmlContent, margins, pageSize);
                  onClose();
                }}
                className="bg-white border border-slate-200 hover:border-blue-500 p-5 rounded-lg shadow-xs cursor-pointer hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded bg-blue-100 text-blue-700 flex items-center justify-center">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                      Word Document (.doc)
                    </h3>
                    <div className="text-[11px] text-slate-400">Compatible with Microsoft Word & Docs</div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Exports standard Word document with XML paper page size and styling.
                </p>
              </div>

              <div
                onClick={handlePrint}
                className="bg-white border border-slate-200 hover:border-blue-500 p-5 rounded-lg shadow-xs cursor-pointer hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded bg-red-100 text-red-700 flex items-center justify-center">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900 group-hover:text-red-600 transition-colors">
                      PDF Document (.pdf)
                    </h3>
                    <div className="text-[11px] text-slate-400">High-fidelity print to PDF layout</div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Opens browser print dialog with styled multi-page sheet layout.
                </p>
              </div>

              <div
                onClick={() => {
                  exportToHtml(documentTitle, htmlContent);
                  onClose();
                }}
                className="bg-white border border-slate-200 hover:border-blue-500 p-5 rounded-lg shadow-xs cursor-pointer hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded bg-amber-100 text-amber-700 flex items-center justify-center">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900 group-hover:text-amber-600 transition-colors">
                      Web Page (.html)
                    </h3>
                    <div className="text-[11px] text-slate-400">Standalone clean HTML document</div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Exports complete HTML code suitable for websites and blog publishing.
                </p>
              </div>

              <div
                onClick={() => {
                  exportToMarkdown(documentTitle, htmlContent);
                  onClose();
                }}
                className="bg-white border border-slate-200 hover:border-blue-500 p-5 rounded-lg shadow-xs cursor-pointer hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                      Markdown (.md)
                    </h3>
                    <div className="text-[11px] text-slate-400">Standard GitHub & developer markdown</div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Exports structured headings, lists, tables, and bold markdown tags.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'print' && (
          <div className="max-w-xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Print</h1>
              <p className="text-sm text-slate-500 mt-1">Configure print settings and output to physical paper or PDF.</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded border border-slate-200">
                <Printer className="w-6 h-6 text-blue-600" />
                <div>
                  <div className="text-xs font-semibold text-slate-800">Print Preview Engine</div>
                  <div className="text-[11px] text-slate-500">Prints with {pageSize.toUpperCase()} paper and {margins.top}" margins.</div>
                </div>
              </div>

              <button
                onClick={handlePrint}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Open System Print Dialog</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
