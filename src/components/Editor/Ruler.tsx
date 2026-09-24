import React from 'react';
import { Margins, PageSize, Orientation } from '../../types/document';

interface RulerProps {
  margins: Margins;
  pageSize: PageSize;
  orientation: Orientation;
  zoomLevel: number;
}

export const Ruler: React.FC<RulerProps> = ({ margins, pageSize, orientation, zoomLevel }) => {
  // Determine physical width in inches
  let totalInches = 8.5;
  if (pageSize === 'letter') {
    totalInches = orientation === 'portrait' ? 8.5 : 11.0;
  } else if (pageSize === 'a4') {
    totalInches = orientation === 'portrait' ? 8.27 : 11.69;
  } else if (pageSize === 'legal') {
    totalInches = orientation === 'portrait' ? 8.5 : 14.0;
  }

  const inchCount = Math.floor(totalInches);
  const leftMarginPercent = (margins.left / totalInches) * 100;
  const rightMarginPercent = (margins.right / totalInches) * 100;

  return (
    <div className="h-6 bg-slate-200 border-b border-slate-300 flex items-center justify-center select-none overflow-hidden ruler-container no-print">
      {/* Container aligned with the document paper width */}
      <div
        className="h-full bg-white relative border-x border-slate-300 flex items-end shadow-xs"
        style={{
          width: `${(totalInches * 96 * (zoomLevel / 100)).toFixed(0)}px`,
          maxWidth: '100%'
        }}
      >
        {/* Margin shade zones */}
        <div
          className="absolute top-0 bottom-0 left-0 bg-slate-100/90 border-r border-slate-300 z-10"
          style={{ width: `${leftMarginPercent}%` }}
        />
        <div
          className="absolute top-0 bottom-0 right-0 bg-slate-100/90 border-l border-slate-300 z-10"
          style={{ width: `${rightMarginPercent}%` }}
        />

        {/* Left Margin Indent Marker */}
        <div
          className="absolute top-0 -ml-1 z-20 text-[9px] text-blue-600 font-bold"
          style={{ left: `${leftMarginPercent}%` }}
          title={`Left margin: ${margins.left} inch`}
        >
          &#9660;
        </div>

        {/* Right Margin Indent Marker */}
        <div
          className="absolute top-0 -mr-1 z-20 text-[9px] text-blue-600 font-bold"
          style={{ right: `${rightMarginPercent}%` }}
          title={`Right margin: ${margins.right} inch`}
        >
          &#9660;
        </div>

        {/* Inch markings */}
        <div className="w-full h-full flex items-end relative z-0">
          {Array.from({ length: inchCount + 1 }).map((_, idx) => (
            <div
              key={idx}
              className="absolute bottom-0 flex flex-col items-center"
              style={{ left: `${(idx / totalInches) * 100}%` }}
            >
              <span className="text-[9px] text-slate-500 font-mono -mb-0.5">{idx}</span>
              <div className="w-[1px] h-2 bg-slate-400"></div>
            </div>
          ))}

          {/* Half-inch ticks */}
          {Array.from({ length: inchCount }).map((_, idx) => (
            <div
              key={`half-${idx}`}
              className="absolute bottom-0"
              style={{ left: `${((idx + 0.5) / totalInches) * 100}%` }}
            >
              <div className="w-[1px] h-1.5 bg-slate-300"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
