import React, { useState } from 'react';
import { X, Image as ImageIcon, Upload, Link as LinkIcon, Sparkles } from 'lucide-react';
import { insertImage } from '../../utils/editorCommands';

interface InsertImageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_STOCK_IMAGES = [
  {
    title: 'Modern Architecture',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    caption: 'Corporate Headquarters & Architectural Overview'
  },
  {
    title: 'Executive Team Meeting',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    caption: 'Cross-functional engineering and strategy collaborative session'
  },
  {
    title: 'Analytics & Financial Chart',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    caption: 'Quarterly performance metrics and yield distribution'
  },
  {
    title: 'Technology & Code',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    caption: 'Encrypted distributed network infrastructure'
  }
];

export const InsertImageModal: React.FC<InsertImageModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'url' | 'upload' | 'presets'>('url');
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('Document Image');
  const [caption, setCaption] = useState('');

  if (!isOpen) return null;

  const handleInsertUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    insertImage(imageUrl.trim(), altText.trim(), caption.trim());
    resetAndClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        insertImage(result, file.name.replace(/\.[^/.]+$/, ''), caption.trim());
        resetAndClose();
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePickPreset = (preset: typeof PRESET_STOCK_IMAGES[0]) => {
    insertImage(preset.url, preset.title, preset.caption);
    resetAndClose();
  };

  const resetAndClose = () => {
    setImageUrl('');
    setCaption('');
    setAltText('Document Image');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 dialog-overlay">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span>Insert Picture</span>
          </div>
          <button
            onClick={resetAndClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-5 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'url'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>From Web URL</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'upload'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload From Computer</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'presets'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Stock Gallery</span>
          </button>
        </div>

        <div className="p-5">
          {activeTab === 'url' && (
            <form onSubmit={handleInsertUrl} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Image Web Address (URL)</label>
                <input
                  type="url"
                  placeholder="https://example.com/chart-diagram.png"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Caption (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Figure 1: Organizational Hierarchy Matrix"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Alt Text Description</label>
                <input
                  type="text"
                  placeholder="Descriptive text for accessibility"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!imageUrl.trim()}
                  className="px-4 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Insert Picture
                </button>
              </div>
            </form>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-4">
              <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/20 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-slate-700">Click to choose image file</span>
                <span className="text-[11px] text-slate-400 mt-1">PNG, JPG, SVG, WebP up to 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Caption (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. System architecture diagram"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {PRESET_STOCK_IMAGES.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => handlePickPreset(preset)}
                  className="group border border-slate-200 rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 hover:shadow-sm transition-all bg-white"
                >
                  <div className="h-28 overflow-hidden bg-slate-100">
                    <img
                      src={preset.url}
                      alt={preset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-2">
                    <div className="text-xs font-semibold text-slate-800">{preset.title}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{preset.caption}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
