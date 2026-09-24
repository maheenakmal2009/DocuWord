/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { TitleBar } from './components/Ribbon/TitleBar';
import { RibbonTabs } from './components/Ribbon/RibbonTabs';
import { Ruler } from './components/Editor/Ruler';
import { DocumentPage } from './components/Editor/DocumentPage';
import { NavigationPane } from './components/Editor/NavigationPane';
import { CommentsDrawer } from './components/Editor/CommentsDrawer';
import { FindReplaceBar } from './components/Editor/FindReplaceBar';
import { StatusBar } from './components/Editor/StatusBar';

import { WordCountModal } from './components/Modals/WordCountModal';
import { InsertTableModal } from './components/Modals/InsertTableModal';
import { InsertImageModal } from './components/Modals/InsertImageModal';
import { InsertLinkModal } from './components/Modals/InsertLinkModal';
import { SpecialSymbolsModal } from './components/Modals/SpecialSymbolsModal';
import { PageSetupModal } from './components/Modals/PageSetupModal';
import { FileBackstageModal } from './components/Modals/FileBackstageModal';
import { AutoCorrectModal } from './components/Modals/AutoCorrectModal';

import { PRESET_DOCUMENTS } from './templates/presetDocuments';
import {
  Margins,
  PageSize,
  Orientation,
  WatermarkConfig,
  ViewMode,
  ActiveFormats,
  DocumentComment,
  DocumentTemplate
} from './types/document';

export default function App() {
  const defaultTemplate = PRESET_DOCUMENTS[0]; // Executive Project Proposal

  // Document Core State
  const [documentTitle, setDocumentTitle] = useState('Executive Project Proposal');
  const [content, setContent] = useState(defaultTemplate.content);

  // Page Setup State
  const [margins, setMargins] = useState<Margins>({ top: 1.0, right: 1.0, bottom: 1.0, left: 1.0 });
  const [pageSize, setPageSize] = useState<PageSize>('letter');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [pageColor, setPageColor] = useState('#ffffff');
  const [watermark, setWatermark] = useState<WatermarkConfig>({
    enabled: false,
    text: 'CONFIDENTIAL',
    opacity: 0.12,
    color: '#94a3b8'
  });

  // View & UI State
  const [viewMode, setViewMode] = useState<ViewMode>('print');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showRuler, setShowRuler] = useState<boolean>(true);
  const [showGridlines, setShowGridlines] = useState<boolean>(false);
  const [showNavPane, setShowNavPane] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [showFindReplace, setShowFindReplace] = useState<boolean>(false);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);

  // Active Formatting in Selection
  const [activeFormats, setActiveFormats] = useState<ActiveFormats>({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    subscript: false,
    superscript: false,
    fontName: 'Calibri',
    fontSize: '11pt',
    foreColor: '#0f172a',
    hiliteColor: 'transparent',
    align: 'left',
    heading: 'p',
    list: 'none'
  });

  // Comments State
  const [comments, setComments] = useState<DocumentComment[]>([
    {
      id: 'c1',
      author: 'David Chen (CTO)',
      text: 'Phase 2 milestones are well structured. Ensure cloud cluster capacity is provisioned in advance.',
      createdAt: '10:15 AM',
      resolved: false,
      replies: [
        {
          id: 'r1',
          author: 'Alexandra Vance',
          text: 'Confirmed, DevOps team has reserved the multi-region instances.',
          createdAt: '10:28 AM'
        }
      ]
    }
  ]);

  // Dialog Modals State
  const [isBackstageOpen, setIsBackstageOpen] = useState(false);
  const [isWordCountOpen, setIsWordCountOpen] = useState(false);
  const [isInsertTableOpen, setIsInsertTableOpen] = useState(false);
  const [isInsertImageOpen, setIsInsertImageOpen] = useState(false);
  const [isInsertLinkOpen, setIsInsertLinkOpen] = useState(false);
  const [isSpecialSymbolsOpen, setIsSpecialSymbolsOpen] = useState(false);
  const [isPageSetupOpen, setIsPageSetupOpen] = useState(false);
  const [isAutoCorrectOpen, setIsAutoCorrectOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const editorRef = useRef<HTMLDivElement | null>(null);

  // Global keyboard shortcut listener for Ctrl+S (Save), Ctrl+P (Print), Ctrl+F (Find)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier) {
        const key = e.key.toLowerCase();
        if (key === 's') {
          e.preventDefault();
          try {
            const currentContent = editorRef.current ? editorRef.current.innerHTML : content;
            localStorage.setItem('docuword_autosave_title', documentTitle);
            localStorage.setItem('docuword_autosave_content', currentContent);
            setSaveToast(true);
            setTimeout(() => setSaveToast(false), 2200);
          } catch (err) {
            console.error('Failed to save document:', err);
          }
        } else if (key === 'p') {
          e.preventDefault();
          window.print();
        } else if (key === 'f') {
          e.preventDefault();
          setShowFindReplace((prev) => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [documentTitle, content]);

  // Load Autosaved draft if present
  useEffect(() => {
    try {
      const savedTitle = localStorage.getItem('docuword_autosave_title');
      const savedContent = localStorage.getItem('docuword_autosave_content');
      if (savedTitle && savedContent) {
        setDocumentTitle(savedTitle);
        setContent(savedContent);
        if (editorRef.current) {
          editorRef.current.innerHTML = savedContent;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Compute Word & Character counts
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  const rawText = tempDiv.innerText || tempDiv.textContent || '';
  const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;
  const charCount = rawText.length;

  // Handle Template Selection
  const handleLoadTemplate = (template: DocumentTemplate) => {
    setDocumentTitle(template.title);
    setContent(template.content);
    if (editorRef.current) {
      editorRef.current.innerHTML = template.content;
    }
  };

  // Handle File Import
  const handleImportContent = (title: string, importedContent: string) => {
    setDocumentTitle(title);
    setContent(importedContent);
    if (editorRef.current) {
      editorRef.current.innerHTML = importedContent;
    }
  };

  // Comments Management
  const handleAddComment = (text: string) => {
    const newComment: DocumentComment = {
      id: `comm_${Date.now()}`,
      author: 'Author',
      text,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      resolved: false,
      replies: []
    };
    setComments([newComment, ...comments]);
    setShowComments(true);
  };

  const handleResolveComment = (id: string) => {
    setComments(
      comments.map((c) => (c.id === id ? { ...c, resolved: !c.resolved } : c))
    );
  };

  const handleDeleteComment = (id: string) => {
    setComments(comments.filter((c) => c.id !== id));
  };

  const handleAddReply = (commentId: string, replyText: string) => {
    setComments(
      comments.map((c) => {
        if (c.id === commentId) {
          const newReply = {
            id: `rep_${Date.now()}`,
            author: 'Author',
            text: replyText,
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          return { ...c, replies: [...(c.replies || []), newReply] };
        }
        return c;
      })
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-100 overflow-hidden font-sans">
      {/* 1. Word Title Bar */}
      <TitleBar
        documentTitle={documentTitle}
        setDocumentTitle={setDocumentTitle}
        onOpenBackstage={() => setIsBackstageOpen(true)}
        onOpenWordCount={() => setIsWordCountOpen(true)}
        htmlContent={content}
        margins={margins}
        pageSize={pageSize}
        onSearchCommand={(query) => {
          if (query.trim()) {
            setShowFindReplace(true);
          }
        }}
      />

      {/* 2. Word Ribbon Tabs */}
      <RibbonTabs
        onOpenBackstage={() => setIsBackstageOpen(true)}
        activeFormats={activeFormats}
        onToggleFindReplace={() => setShowFindReplace(!showFindReplace)}
        onOpenInsertTable={() => setIsInsertTableOpen(true)}
        onOpenInsertImage={() => setIsInsertImageOpen(true)}
        onOpenInsertLink={() => setIsInsertLinkOpen(true)}
        onOpenSpecialSymbols={() => setIsSpecialSymbolsOpen(true)}
        onAddComment={() => setShowComments(true)}
        margins={margins}
        onUpdateMargins={setMargins}
        pageSize={pageSize}
        onUpdatePageSize={setPageSize}
        orientation={orientation}
        onUpdateOrientation={setOrientation}
        pageColor={pageColor}
        onUpdatePageColor={setPageColor}
        watermark={watermark}
        onUpdateWatermark={setWatermark}
        onOpenPageSetup={() => setIsPageSetupOpen(true)}
        onOpenWordCount={() => setIsWordCountOpen(true)}
        onOpenAutoCorrect={() => setIsAutoCorrectOpen(true)}
        showComments={showComments}
        onToggleComments={() => setShowComments(!showComments)}
        commentCount={comments.filter((c) => !c.resolved).length}
        isReadOnly={isReadOnly}
        onToggleReadOnly={() => setIsReadOnly(!isReadOnly)}
        viewMode={viewMode}
        onUpdateViewMode={setViewMode}
        showRuler={showRuler}
        onToggleRuler={() => setShowRuler(!showRuler)}
        showGridlines={showGridlines}
        onToggleGridlines={() => setShowGridlines(!showGridlines)}
        showNavPane={showNavPane}
        onToggleNavPane={() => setShowNavPane(!showNavPane)}
        zoomLevel={zoomLevel}
        onUpdateZoom={setZoomLevel}
      />

      {/* 3. Horizontal Document Ruler (Print Layout) */}
      {showRuler && viewMode === 'print' && (
        <Ruler
          margins={margins}
          pageSize={pageSize}
          orientation={orientation}
          zoomLevel={zoomLevel}
        />
      )}

      {/* 4. Main Document Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Document Outline & Navigation Pane */}
        {showNavPane && (
          <NavigationPane
            isOpen={showNavPane}
            onClose={() => setShowNavPane(false)}
            editorRef={editorRef}
          />
        )}

        {/* Center: Realistic Document Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Find & Replace Floating Panel */}
          <FindReplaceBar
            isOpen={showFindReplace}
            onClose={() => setShowFindReplace(false)}
            editorRef={editorRef}
          />

          <DocumentPage
            content={content}
            onChange={setContent}
            margins={margins}
            pageSize={pageSize}
            orientation={orientation}
            pageColor={pageColor}
            watermark={watermark}
            viewMode={viewMode}
            zoomLevel={zoomLevel}
            isReadOnly={isReadOnly}
            onUpdateActiveFormats={setActiveFormats}
            onToggleFindReplace={() => setShowFindReplace(!showFindReplace)}
            onOpenInsertLink={() => setIsInsertLinkOpen(true)}
            editorRef={editorRef}
            documentTitle={documentTitle}
          />
        </div>

        {/* Right: Comments Drawer */}
        {showComments && (
          <CommentsDrawer
            isOpen={showComments}
            onClose={() => setShowComments(false)}
            comments={comments}
            onAddComment={handleAddComment}
            onResolveComment={handleResolveComment}
            onDeleteComment={handleDeleteComment}
            onAddReply={handleAddReply}
          />
        )}
      </div>

      {/* 5. Classic Word Status Bar */}
      <StatusBar
        wordCount={wordCount}
        charCount={charCount}
        onOpenWordCount={() => setIsWordCountOpen(true)}
        onOpenAutoCorrect={() => setIsAutoCorrectOpen(true)}
        viewMode={viewMode}
        onUpdateViewMode={setViewMode}
        zoomLevel={zoomLevel}
        onUpdateZoom={setZoomLevel}
      />

      {/* Modals & Dialogs */}
      <WordCountModal
        isOpen={isWordCountOpen}
        onClose={() => setIsWordCountOpen(false)}
        htmlContent={content}
      />

      <InsertTableModal
        isOpen={isInsertTableOpen}
        onClose={() => setIsInsertTableOpen(false)}
      />

      <InsertImageModal
        isOpen={isInsertImageOpen}
        onClose={() => setIsInsertImageOpen(false)}
      />

      <InsertLinkModal
        isOpen={isInsertLinkOpen}
        onClose={() => setIsInsertLinkOpen(false)}
      />

      <SpecialSymbolsModal
        isOpen={isSpecialSymbolsOpen}
        onClose={() => setIsSpecialSymbolsOpen(false)}
      />

      <PageSetupModal
        isOpen={isPageSetupOpen}
        onClose={() => setIsPageSetupOpen(false)}
        margins={margins}
        onUpdateMargins={setMargins}
        pageSize={pageSize}
        onUpdatePageSize={setPageSize}
        orientation={orientation}
        onUpdateOrientation={setOrientation}
        watermark={watermark}
        onUpdateWatermark={setWatermark}
      />

      <FileBackstageModal
        isOpen={isBackstageOpen}
        onClose={() => setIsBackstageOpen(false)}
        documentTitle={documentTitle}
        setDocumentTitle={setDocumentTitle}
        htmlContent={content}
        onLoadTemplate={handleLoadTemplate}
        onImportContent={handleImportContent}
        margins={margins}
        pageSize={pageSize}
      />

      <AutoCorrectModal
        isOpen={isAutoCorrectOpen}
        onClose={() => setIsAutoCorrectOpen(false)}
      />

      {/* Global Shortcut Notification Toast */}
      {saveToast && (
        <div className="fixed bottom-10 right-6 z-50 bg-slate-900/95 text-white px-3.5 py-2 rounded-lg shadow-xl border border-slate-700/60 flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Document saved to local storage</span>
        </div>
      )}
    </div>
  );
}
