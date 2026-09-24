import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  Highlighter,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  RemoveFormatting,
  Search,
  Check,
  ChevronDown,
  Paintbrush,
  Copy,
  Scissors,
  ClipboardPaste,
  Quote,
  Code
} from 'lucide-react';
import { ActiveFormats } from '../../types/document';
import { execDocCommand, formatBlock } from '../../utils/editorCommands';

interface HomeTabProps {
  activeFormats: ActiveFormats;
  onToggleFindReplace: () => void;
  onApplyFormatPainter?: () => void;
}

const FONT_FAMILIES = [
  { name: 'Calibri', value: 'Calibri, sans-serif' },
  { name: 'Aptos / Sans', value: 'Plus Jakarta Sans, sans-serif' },
  { name: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { name: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Garamond', value: '"EB Garamond", Garamond, serif' },
  { name: 'Lora', value: 'Lora, serif' },
  { name: 'JetBrains Mono', value: '"IBM Plex Mono", monospace' }
];

const FONT_SIZES = ['8pt', '9pt', '10pt', '11pt', '12pt', '14pt', '16pt', '18pt', '20pt', '24pt', '28pt', '36pt', '48pt', '72pt'];

const HIGHLIGHT_COLORS = [
  { name: 'None', value: 'transparent' },
  { name: 'Yellow', value: '#fef08a' },
  { name: 'Bright Green', value: '#bbf7d0' },
  { name: 'Cyan Blue', value: '#bae6fd' },
  { name: 'Magenta Pink', value: '#fbcfe8' },
  { name: 'Orange', value: '#fed7aa' },
  { name: 'Soft Gray', value: '#e2e8f0' }
];

const TEXT_COLORS = [
  { name: 'Black', value: '#0f172a' },
  { name: 'Dark Gray', value: '#475569' },
  { name: 'Navy Blue', value: '#1e3a8a' },
  { name: 'Royal Blue', value: '#2563eb' },
  { name: 'Forest Green', value: '#166534' },
  { name: 'Crimson Red', value: '#dc2626' },
  { name: 'Burnt Orange', value: '#c2410c' },
  { name: 'Purple', value: '#7e22ce' }
];

export const HomeTab: React.FC<HomeTabProps> = ({ activeFormats, onToggleFindReplace }) => {
  const [selectedFont, setSelectedFont] = useState('Calibri, sans-serif');
  const [selectedSize, setSelectedSize] = useState('11pt');
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showSpacingMenu, setShowSpacingMenu] = useState(false);
  const [formatPainterActive, setFormatPainterActive] = useState(false);

  const handleFontChange = (val: string) => {
    setSelectedFont(val);
    execDocCommand('fontName', val);
  };

  const handleSizeChange = (val: string) => {
    setSelectedSize(val);
    // Since execCommand fontSize takes 1-7, wrap with span style for precise pt
    const sel = window.getSelection();
    if (sel && sel.rangeCount) {
      const span = document.createElement('span');
      span.style.fontSize = val;
      const range = sel.getRangeAt(0);
      try {
        range.surroundContents(span);
      } catch {
        execDocCommand('fontSize', '3');
      }
    }
  };

  const handleGrowFont = () => {
    const curIdx = FONT_SIZES.indexOf(selectedSize);
    if (curIdx < FONT_SIZES.length - 1) {
      handleSizeChange(FONT_SIZES[curIdx + 1]);
    }
  };

  const handleShrinkFont = () => {
    const curIdx = FONT_SIZES.indexOf(selectedSize);
    if (curIdx > 0) {
      handleSizeChange(FONT_SIZES[curIdx - 1]);
    }
  };

  const handleApplyHighlight = (color: string) => {
    execDocCommand('hiliteColor', color);
    setShowHighlightMenu(false);
  };

  const handleApplyTextColor = (color: string) => {
    execDocCommand('foreColor', color);
    setShowColorMenu(false);
  };

  const handleApplyLineSpacing = (spacing: string) => {
    const sel = window.getSelection();
    if (sel && sel.anchorNode) {
      let node: Node | null = sel.anchorNode;
      while (node && node !== document.body) {
        if (node instanceof HTMLElement && (node.nodeName === 'P' || node.nodeName.startsWith('H'))) {
          node.style.lineHeight = spacing;
          break;
        }
        node = node.parentNode;
      }
    }
    setShowSpacingMenu(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 py-1 px-3 text-slate-700 text-xs">
      {/* Group: Clipboard */}
      <div className="flex items-center gap-0.5 pr-2 border-r border-slate-200">
        <button
          onClick={() => {
            navigator.clipboard.readText().then(text => {
              if (text) execDocCommand('insertText', text);
            }).catch(() => {
              execDocCommand('paste');
            });
          }}
          title="Paste from clipboard (Ctrl+V)"
          className="flex flex-col items-center p-1 hover:bg-slate-100 rounded text-slate-700 transition-colors"
        >
          <ClipboardPaste className="w-4 h-4 text-blue-600" />
          <span className="text-[10px] mt-0.5">Paste</span>
        </button>

        <div className="flex flex-col gap-0.5 ml-1">
          <button
            onClick={() => execDocCommand('cut')}
            title="Cut (Ctrl+X)"
            className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
          >
            <Scissors className="w-3 h-3" />
            <span className="text-[10px] hidden xl:inline">Cut</span>
          </button>
          <button
            onClick={() => execDocCommand('copy')}
            title="Copy (Ctrl+C)"
            className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            <span className="text-[10px] hidden xl:inline">Copy</span>
          </button>
        </div>

        <button
          onClick={() => setFormatPainterActive(!formatPainterActive)}
          title="Format Painter"
          className={`p-1.5 rounded transition-colors ml-0.5 ${
            formatPainterActive ? 'bg-amber-100 text-amber-800' : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Paintbrush className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Group: Font Selection & Controls */}
      <div className="flex flex-col gap-1 pr-2 border-r border-slate-200">
        {/* Row 1: Font Family, Size, Grow/Shrink, Clear */}
        <div className="flex items-center gap-1">
          <select
            value={selectedFont}
            onChange={(e) => handleFontChange(e.target.value)}
            className="h-6 text-xs bg-white border border-slate-300 rounded px-1.5 focus:border-blue-500 focus:outline-none w-28 sm:w-32"
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f.name} value={f.value}>
                {f.name}
              </option>
            ))}
          </select>

          <select
            value={selectedSize}
            onChange={(e) => handleSizeChange(e.target.value)}
            className="h-6 text-xs bg-white border border-slate-300 rounded px-1 focus:border-blue-500 focus:outline-none w-14"
          >
            {FONT_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={handleGrowFont}
            title="Increase Font Size"
            className="p-1 hover:bg-slate-100 rounded text-slate-700 font-bold text-xs"
          >
            A<span className="text-[9px] align-top">&#9650;</span>
          </button>
          <button
            onClick={handleShrinkFont}
            title="Decrease Font Size"
            className="p-1 hover:bg-slate-100 rounded text-slate-700 font-bold text-xs"
          >
            A<span className="text-[9px] align-top">&#9660;</span>
          </button>

          <button
            onClick={() => execDocCommand('removeFormat')}
            title="Clear All Formatting"
            className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors ml-0.5"
          >
            <RemoveFormatting className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Row 2: Bold, Italic, Underline, Strike, Sub, Super, Highlight, Text Color */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => execDocCommand('bold')}
            title="Bold (Ctrl+B)"
            className={`p-1 rounded transition-colors ${
              activeFormats.bold ? 'bg-blue-100 text-blue-800 font-bold' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => execDocCommand('italic')}
            title="Italic (Ctrl+I)"
            className={`p-1 rounded transition-colors ${
              activeFormats.italic ? 'bg-blue-100 text-blue-800' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => execDocCommand('underline')}
            title="Underline (Ctrl+U)"
            className={`p-1 rounded transition-colors ${
              activeFormats.underline ? 'bg-blue-100 text-blue-800' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => execDocCommand('strikeThrough')}
            title="Strikethrough"
            className={`p-1 rounded transition-colors ${
              activeFormats.strikeThrough ? 'bg-blue-100 text-blue-800' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => execDocCommand('subscript')}
            title="Subscript"
            className={`p-1 rounded transition-colors ${
              activeFormats.subscript ? 'bg-blue-100 text-blue-800' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Subscript className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => execDocCommand('superscript')}
            title="Superscript"
            className={`p-1 rounded transition-colors ${
              activeFormats.superscript ? 'bg-blue-100 text-blue-800' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Superscript className="w-3.5 h-3.5" />
          </button>

          {/* Highlight Color Picker */}
          <div className="relative">
            <button
              onClick={() => setShowHighlightMenu(!showHighlightMenu)}
              title="Text Highlight Color"
              className="p-1 hover:bg-slate-100 rounded text-slate-700 flex items-center gap-0.5"
            >
              <Highlighter className="w-3.5 h-3.5 text-amber-500" />
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </button>

            {showHighlightMenu && (
              <div
                className="absolute left-0 top-full mt-1 bg-white border border-slate-200 shadow-md rounded p-2 z-50 grid grid-cols-4 gap-1 w-32 animate-in fade-in"
                onClick={() => setShowHighlightMenu(false)}
              >
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleApplyHighlight(c.value)}
                    title={c.name}
                    className="w-5 h-5 rounded border border-slate-300 transition-transform hover:scale-110"
                    style={{ backgroundColor: c.value === 'transparent' ? '#ffffff' : c.value }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Font Color Picker */}
          <div className="relative">
            <button
              onClick={() => setShowColorMenu(!showColorMenu)}
              title="Font Color"
              className="p-1 hover:bg-slate-100 rounded text-slate-700 flex items-center gap-0.5"
            >
              <Palette className="w-3.5 h-3.5 text-blue-600" />
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </button>

            {showColorMenu && (
              <div
                className="absolute left-0 top-full mt-1 bg-white border border-slate-200 shadow-md rounded p-2 z-50 grid grid-cols-4 gap-1 w-32 animate-in fade-in"
                onClick={() => setShowColorMenu(false)}
              >
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleApplyTextColor(c.value)}
                    title={c.name}
                    className="w-5 h-5 rounded border border-slate-300 transition-transform hover:scale-110"
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Group: Paragraph (Bullets, Numbers, Indents, Alignment, Spacing) */}
      <div className="flex flex-col gap-1 pr-2 border-r border-slate-200">
        {/* Row 1: Bullets, Numbering, Indent decrease/increase */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => execDocCommand('insertUnorderedList')}
            title="Bulleted List"
            className={`p-1 rounded transition-colors ${
              activeFormats.list === 'ul' ? 'bg-blue-100 text-blue-800' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => execDocCommand('insertOrderedList')}
            title="Numbered List"
            className={`p-1 rounded transition-colors ${
              activeFormats.list === 'ol' ? 'bg-blue-100 text-blue-800' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => execDocCommand('outdent')}
            title="Decrease Indent"
            className="p-1 hover:bg-slate-100 rounded text-slate-700 transition-colors"
          >
            <Outdent className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => execDocCommand('indent')}
            title="Increase Indent"
            className="p-1 hover:bg-slate-100 rounded text-slate-700 transition-colors"
          >
            <Indent className="w-3.5 h-3.5" />
          </button>

          {/* Line spacing dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSpacingMenu(!showSpacingMenu)}
              title="Line and Paragraph Spacing"
              className="p-1 hover:bg-slate-100 rounded text-slate-700 flex items-center gap-0.5 ml-1 text-[11px]"
            >
              <span>Spacing</span>
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </button>

            {showSpacingMenu && (
              <div
                className="absolute left-0 top-full mt-1 bg-white border border-slate-200 shadow-md rounded py-1 z-50 w-28 animate-in fade-in"
                onClick={() => setShowSpacingMenu(false)}
              >
                {['1.0', '1.15', '1.5', '2.0', '2.5', '3.0'].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleApplyLineSpacing(s)}
                    className="w-full text-left px-3 py-1 hover:bg-slate-100 text-xs"
                  >
                    {s} line spacing
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Alignment left, center, right, justify */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => execDocCommand('justifyLeft')}
            title="Align Left (Ctrl+L)"
            className={`p-1 rounded transition-colors ${
              activeFormats.align === 'left' ? 'bg-blue-100 text-blue-800' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => execDocCommand('justifyCenter')}
            title="Center (Ctrl+E)"
            className={`p-1 rounded transition-colors ${
              activeFormats.align === 'center' ? 'bg-blue-100 text-blue-800' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => execDocCommand('justifyRight')}
            title="Align Right (Ctrl+R)"
            className={`p-1 rounded transition-colors ${
              activeFormats.align === 'right' ? 'bg-blue-100 text-blue-800' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => execDocCommand('justifyFull')}
            title="Justify (Ctrl+J)"
            className={`p-1 rounded transition-colors ${
              activeFormats.align === 'justify' ? 'bg-blue-100 text-blue-800' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Group: Quick Styles Gallery */}
      <div className="hidden lg:flex items-center gap-1.5 px-2 border-r border-slate-200 overflow-x-auto py-0.5">
        <button
          onClick={() => formatBlock('p')}
          className={`px-2.5 py-1 rounded border text-center transition-all ${
            activeFormats.heading === 'p'
              ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold'
              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
          }`}
        >
          <div className="text-[11px] leading-tight font-normal">Normal</div>
          <div className="text-[9px] text-slate-400">AaBbCc</div>
        </button>

        <button
          onClick={() => formatBlock('h1')}
          className={`px-2.5 py-1 rounded border text-center transition-all ${
            activeFormats.heading === 'h1'
              ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold'
              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
          }`}
        >
          <div className="text-[11px] leading-tight font-bold text-blue-900">Heading 1</div>
          <div className="text-[9px] text-slate-400">AaBbCc</div>
        </button>

        <button
          onClick={() => formatBlock('h2')}
          className={`px-2.5 py-1 rounded border text-center transition-all ${
            activeFormats.heading === 'h2'
              ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold'
              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
          }`}
        >
          <div className="text-[11px] leading-tight font-semibold text-blue-800">Heading 2</div>
          <div className="text-[9px] text-slate-400">AaBbCc</div>
        </button>

        <button
          onClick={() => formatBlock('h3')}
          className={`px-2.5 py-1 rounded border text-center transition-all ${
            activeFormats.heading === 'h3'
              ? 'border-blue-600 bg-blue-50 text-blue-800 font-semibold'
              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
          }`}
        >
          <div className="text-[11px] leading-tight font-semibold text-slate-700">Heading 3</div>
          <div className="text-[9px] text-slate-400">AaBbCc</div>
        </button>

        <button
          onClick={() => formatBlock('blockquote')}
          className={`px-2.5 py-1 rounded border text-center transition-all ${
            activeFormats.heading === 'blockquote'
              ? 'border-blue-600 bg-blue-50 text-blue-800 italic'
              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
          }`}
        >
          <div className="text-[11px] leading-tight italic text-slate-600">Quote</div>
          <div className="text-[9px] text-slate-400">&ldquo;AaBbCc&rdquo;</div>
        </button>
      </div>

      {/* Group: Editing (Find, Select All) */}
      <div className="flex flex-col gap-1 pl-1">
        <button
          onClick={onToggleFindReplace}
          title="Find & Replace (Ctrl+F)"
          className="p-1 hover:bg-slate-100 rounded text-slate-700 transition-colors flex items-center gap-1.5"
        >
          <Search className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[11px]">Find & Replace</span>
        </button>

        <button
          onClick={() => execDocCommand('selectAll')}
          title="Select All (Ctrl+A)"
          className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors text-[11px] text-left"
        >
          Select All
        </button>
      </div>
    </div>
  );
};
