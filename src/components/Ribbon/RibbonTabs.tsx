import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { HomeTab } from './HomeTab';
import { InsertTab } from './InsertTab';
import { LayoutTab } from './LayoutTab';
import { ReviewTab } from './ReviewTab';
import { ViewTab } from './ViewTab';
import {
  ActiveFormats,
  Margins,
  PageSize,
  Orientation,
  WatermarkConfig,
  ViewMode
} from '../../types/document';

interface RibbonTabsProps {
  onOpenBackstage: () => void;
  activeFormats: ActiveFormats;
  onToggleFindReplace: () => void;
  onOpenInsertTable: () => void;
  onOpenInsertImage: () => void;
  onOpenInsertLink: () => void;
  onOpenSpecialSymbols: () => void;
  onAddComment: () => void;
  margins: Margins;
  onUpdateMargins: (margins: Margins) => void;
  pageSize: PageSize;
  onUpdatePageSize: (size: PageSize) => void;
  orientation: Orientation;
  onUpdateOrientation: (orient: Orientation) => void;
  pageColor: string;
  onUpdatePageColor: (color: string) => void;
  watermark: WatermarkConfig;
  onUpdateWatermark: (watermark: WatermarkConfig) => void;
  onOpenPageSetup: () => void;
  onOpenWordCount: () => void;
  showComments: boolean;
  onToggleComments: () => void;
  commentCount: number;
  isReadOnly: boolean;
  onToggleReadOnly: () => void;
  viewMode: ViewMode;
  onUpdateViewMode: (mode: ViewMode) => void;
  showRuler: boolean;
  onToggleRuler: () => void;
  showGridlines: boolean;
  onToggleGridlines: () => void;
  showNavPane: boolean;
  onToggleNavPane: () => void;
  zoomLevel: number;
  onUpdateZoom: (zoom: number) => void;
}

export const RibbonTabs: React.FC<RibbonTabsProps> = ({
  onOpenBackstage,
  activeFormats,
  onToggleFindReplace,
  onOpenInsertTable,
  onOpenInsertImage,
  onOpenInsertLink,
  onOpenSpecialSymbols,
  onAddComment,
  margins,
  onUpdateMargins,
  pageSize,
  onUpdatePageSize,
  orientation,
  onUpdateOrientation,
  pageColor,
  onUpdatePageColor,
  watermark,
  onUpdateWatermark,
  onOpenPageSetup,
  onOpenWordCount,
  showComments,
  onToggleComments,
  commentCount,
  isReadOnly,
  onToggleReadOnly,
  viewMode,
  onUpdateViewMode,
  showRuler,
  onToggleRuler,
  showGridlines,
  onToggleGridlines,
  showNavPane,
  onToggleNavPane,
  zoomLevel,
  onUpdateZoom
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'insert' | 'layout' | 'review' | 'view'>('home');
  const [isRibbonCollapsed, setIsRibbonCollapsed] = useState(false);

  return (
    <div className="bg-slate-50 border-b border-slate-300 shadow-xs select-none no-print ribbon-container">
      {/* Top Tab Bar Navigation */}
      <div className="flex items-center justify-between px-3 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-0.5">
          {/* File Tab Button (Signature Blue) */}
          <button
            onClick={onOpenBackstage}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#185abd] hover:bg-[#104896] transition-colors rounded-t-xs"
          >
            File
          </button>

          {/* Standard Tabs */}
          <button
            onClick={() => {
              setActiveTab('home');
              if (isRibbonCollapsed) setIsRibbonCollapsed(false);
            }}
            className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-all ${
              activeTab === 'home' && !isRibbonCollapsed
                ? 'border-blue-600 text-blue-700 font-semibold bg-slate-50'
                : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => {
              setActiveTab('insert');
              if (isRibbonCollapsed) setIsRibbonCollapsed(false);
            }}
            className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-all ${
              activeTab === 'insert' && !isRibbonCollapsed
                ? 'border-blue-600 text-blue-700 font-semibold bg-slate-50'
                : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Insert
          </button>

          <button
            onClick={() => {
              setActiveTab('layout');
              if (isRibbonCollapsed) setIsRibbonCollapsed(false);
            }}
            className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-all ${
              activeTab === 'layout' && !isRibbonCollapsed
                ? 'border-blue-600 text-blue-700 font-semibold bg-slate-50'
                : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Layout
          </button>

          <button
            onClick={() => {
              setActiveTab('review');
              if (isRibbonCollapsed) setIsRibbonCollapsed(false);
            }}
            className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-all ${
              activeTab === 'review' && !isRibbonCollapsed
                ? 'border-blue-600 text-blue-700 font-semibold bg-slate-50'
                : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Review
          </button>

          <button
            onClick={() => {
              setActiveTab('view');
              if (isRibbonCollapsed) setIsRibbonCollapsed(false);
            }}
            className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-all ${
              activeTab === 'view' && !isRibbonCollapsed
                ? 'border-blue-600 text-blue-700 font-semibold bg-slate-50'
                : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            View
          </button>
        </div>

        {/* Collapse Ribbon Toggle */}
        <button
          onClick={() => setIsRibbonCollapsed(!isRibbonCollapsed)}
          title={isRibbonCollapsed ? 'Show Ribbon' : 'Collapse Ribbon'}
          className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded transition-colors"
        >
          {isRibbonCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Tab Panels */}
      {!isRibbonCollapsed && (
        <div className="min-h-[64px] bg-slate-50/90 py-1 flex items-center">
          {activeTab === 'home' && (
            <HomeTab
              activeFormats={activeFormats}
              onToggleFindReplace={onToggleFindReplace}
            />
          )}

          {activeTab === 'insert' && (
            <InsertTab
              onOpenInsertTable={onOpenInsertTable}
              onOpenInsertImage={onOpenInsertImage}
              onOpenInsertLink={onOpenInsertLink}
              onOpenSpecialSymbols={onOpenSpecialSymbols}
              onAddComment={onAddComment}
            />
          )}

          {activeTab === 'layout' && (
            <LayoutTab
              margins={margins}
              onUpdateMargins={onUpdateMargins}
              pageSize={pageSize}
              onUpdatePageSize={onUpdatePageSize}
              orientation={orientation}
              onUpdateOrientation={onUpdateOrientation}
              pageColor={pageColor}
              onUpdatePageColor={onUpdatePageColor}
              watermark={watermark}
              onUpdateWatermark={onUpdateWatermark}
              onOpenPageSetup={onOpenPageSetup}
            />
          )}

          {activeTab === 'review' && (
            <ReviewTab
              onOpenWordCount={onOpenWordCount}
              onAddComment={onAddComment}
              showComments={showComments}
              onToggleComments={onToggleComments}
              commentCount={commentCount}
              isReadOnly={isReadOnly}
              onToggleReadOnly={onToggleReadOnly}
            />
          )}

          {activeTab === 'view' && (
            <ViewTab
              viewMode={viewMode}
              onUpdateViewMode={onUpdateViewMode}
              showRuler={showRuler}
              onToggleRuler={onToggleRuler}
              showGridlines={showGridlines}
              onToggleGridlines={onToggleGridlines}
              showNavPane={showNavPane}
              onToggleNavPane={onToggleNavPane}
              zoomLevel={zoomLevel}
              onUpdateZoom={onUpdateZoom}
            />
          )}
        </div>
      )}
    </div>
  );
};
