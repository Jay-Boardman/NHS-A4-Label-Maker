import React, { useState } from 'react';
import {
  ContentMode,
  LabelDimensions,
  LabelStyleSettings,
  PrinterCalibration,
  SpreadsheetState,
} from '../types';
import { formatLabelText, generateBarcodeSvg } from '../utils/sampleData';
import {
  Printer,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  Sliders,
  HelpCircle,
  Eye,
  Info,
} from 'lucide-react';

interface A4SheetPreviewProps {
  dimensions: LabelDimensions;
  styleSettings: LabelStyleSettings;
  calibration: PrinterCalibration;
  mode: ContentMode;
  repeatText: string;
  spreadsheet: SpreadsheetState;
  onPrint: () => void;
  onOpenCalibration: () => void;
  skippedIndices: Set<number>; // indices of labels manually skipped
  toggleSkipIndex: (globalIndex: number) => void;
  onClearSkipped: () => void;
}

export const A4SheetPreview: React.FC<A4SheetPreviewProps> = ({
  dimensions,
  styleSettings,
  calibration,
  mode,
  repeatText,
  spreadsheet,
  onPrint,
  onOpenCalibration,
  skippedIndices,
  toggleSkipIndex,
  onClearSkipped,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(0.75); // 0.75 scale fits nicely on standard monitors
  const [showOutlines, setShowOutlines] = useState<boolean>(true);

  const labelsPerSheet = dimensions.cols * dimensions.rows;

  // Calculate total labels and sheets
  let totalRecords = 0;
  if (mode === 'repeat') {
    totalRecords = labelsPerSheet;
  } else {
    totalRecords = spreadsheet.rows.length;
  }

  const startOffset = mode === 'spreadsheet' ? spreadsheet.startOffset : 0;
  const totalSlotsNeeded = totalRecords + startOffset;
  const totalSheets = Math.max(1, Math.ceil(totalSlotsNeeded / labelsPerSheet));

  // Determine text for a specific slot on currentPage
  const getLabelContent = (slotIndexOnPage: number) => {
    const globalSlotIndex = currentPage * labelsPerSheet + slotIndexOnPage;

    if (skippedIndices.has(globalSlotIndex)) {
      return { isSkipped: true, text: '', recordNumber: null };
    }

    if (mode === 'repeat') {
      return { isSkipped: false, text: repeatText, recordNumber: slotIndexOnPage + 1 };
    }

    // Spreadsheet mode
    if (globalSlotIndex < startOffset) {
      // Offset skipped cell on page 0
      return { isSkipped: true, text: '', recordNumber: null, isInitialOffset: true };
    }

    const recordIndex = globalSlotIndex - startOffset;
    if (recordIndex < spreadsheet.rows.length) {
      const row = spreadsheet.rows[recordIndex];
      const text = formatLabelText(spreadsheet.template, row);
      return {
        isSkipped: false,
        text,
        recordNumber: recordIndex + 1,
        barcodeValue: row['NHS Number'] || row['NHS No'] || row['ID'] || '',
      };
    }

    return { isSkipped: true, text: '', recordNumber: null, isBeyondData: true };
  };

  return (
    <div className="space-y-4">
      {/* Top Preview Control Bar */}
      <div className="bg-white p-4 rounded-lg border border-[#d8dde0] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wide text-[#212b32] flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-[#005eb8]" />
            A4 Sheet Preview ({dimensions.name})
          </span>

          {totalSheets > 1 && (
            <div className="flex items-center gap-1 bg-[#f0f4f5] px-2.5 py-1 rounded border border-[#d8dde0] text-xs">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                className="p-1 rounded hover:bg-white disabled:opacity-30"
                title="Previous sheet"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-[#005eb8] px-1">
                Sheet {currentPage + 1} of {totalSheets}
              </span>
              <button
                disabled={currentPage >= totalSheets - 1}
                onClick={() => setCurrentPage((p) => Math.min(totalSheets - 1, p + 1))}
                className="p-1 rounded hover:bg-white disabled:opacity-30"
                title="Next sheet"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* View Options */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-[#212b32] cursor-pointer">
            <input
              type="checkbox"
              checked={showOutlines}
              onChange={(e) => setShowOutlines(e.target.checked)}
              className="rounded text-[#005eb8]"
            />
            <span className="font-medium">Show Label Outlines</span>
          </label>

          <div className="flex items-center gap-1 bg-[#f0f4f5] p-1 rounded border border-[#d8dde0]">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
              className="p-1 rounded hover:bg-white text-[#212b32]"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono font-semibold px-1 w-12 text-center text-[#212b32]">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.2, Number((z + 0.1).toFixed(2))))}
              className="p-1 rounded hover:bg-white text-[#212b32]"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(0.75)}
              className="px-2 py-0.5 text-xs text-[#005eb8] hover:bg-white rounded font-medium"
              title="Reset Zoom"
            >
              Fit
            </button>
          </div>

          <button
            onClick={onPrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#007f3b] hover:bg-[#00662f] rounded-md shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print {totalSheets} {totalSheets === 1 ? 'Sheet' : 'Sheets'} Now</span>
          </button>
        </div>
      </div>

      {/* Helpful Click-to-Skip Guidance Banner */}
      <div className="bg-[#f0f4f5] px-4 py-2.5 rounded-lg border border-[#d8dde0] flex items-center justify-between text-xs text-[#4c6272]">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#005eb8] shrink-0" />
          <span>
            <strong>Tip for reusing partially peeled sheets:</strong> Click on any individual label below to toggle it on or off (skip blank/peeled positions).
          </span>
        </div>

        {skippedIndices.size > 0 && (
          <button
            onClick={onClearSkipped}
            className="text-xs text-[#005eb8] font-bold hover:underline shrink-0 ml-4"
          >
            Clear {skippedIndices.size} Skipped Label(s)
          </button>
        )}
      </div>

      {/* Sheet Canvas Container */}
      <div className="overflow-auto bg-slate-200/80 p-6 rounded-xl border border-slate-300 flex justify-center min-h-[600px]">
        {/* The Exact A4 Sheet in Millimeters (210mm x 297mm) scaled via CSS Transform */}
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            width: '210mm',
            height: '297mm',
            minHeight: '297mm',
            boxSizing: 'border-box',
          }}
          className="bg-white shadow-xl relative transition-transform duration-100 select-none border border-slate-300 print:shadow-none"
        >
          {/* Render All Labels for Current Page */}
          {Array.from({ length: labelsPerSheet }).map((_, slotIndex) => {
            const col = slotIndex % dimensions.cols;
            const row = Math.floor(slotIndex / dimensions.cols);
            const globalIndex = currentPage * labelsPerSheet + slotIndex;

            // Physical millimeter coordinates on A4
            const leftMm =
              dimensions.leftMargin +
              col * (dimensions.labelWidth + dimensions.colGap) +
              calibration.offsetXmm;

            const topMm =
              dimensions.topMargin +
              row * (dimensions.labelHeight + dimensions.rowGap) +
              calibration.offsetYmm;

            const content = getLabelContent(slotIndex);

            return (
              <div
                key={slotIndex}
                onClick={() => toggleSkipIndex(globalIndex)}
                title={content.isSkipped ? 'Click to unskip label' : 'Click to skip this label'}
                style={{
                  position: 'absolute',
                  left: `${leftMm}mm`,
                  top: `${topMm}mm`,
                  width: `${dimensions.labelWidth}mm`,
                  height: `${dimensions.labelHeight}mm`,
                  borderRadius: `${dimensions.cornerRadius}mm`,
                  padding: `${styleSettings.paddingMm}mm`,
                  fontSize: `${styleSettings.fontSizePt}pt`,
                  textAlign: styleSettings.textAlign,
                  fontFamily:
                    styleSettings.fontFamily === 'mono'
                      ? 'JetBrains Mono, monospace'
                      : styleSettings.fontFamily === 'serif'
                      ? 'serif'
                      : 'Plus Jakarta Sans, sans-serif',
                  fontWeight:
                    styleSettings.fontWeight === 'bold'
                      ? 700
                      : styleSettings.fontWeight === 'semibold'
                      ? 600
                      : 400,
                  lineHeight: styleSettings.lineHeight,
                  boxSizing: 'border-box',
                }}
                className={`flex flex-col justify-between overflow-hidden cursor-pointer transition-all ${
                  content.isSkipped
                    ? 'bg-slate-100/90 border border-dashed border-slate-300 text-slate-400 opacity-60'
                    : showOutlines
                    ? 'border border-dashed border-blue-300/80 hover:border-[#005eb8] bg-white'
                    : 'border border-transparent hover:border-blue-200 bg-white'
                }`}
              >
                {content.isSkipped ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                      {content.isInitialOffset ? 'Offset Blank' : 'Skipped / Peeled'}
                    </span>
                    <span className="text-[8px] text-slate-400">#{slotIndex + 1}</span>
                  </div>
                ) : (
                  <>
                    {/* Header badge if NHS logo enabled */}
                    {styleSettings.addNhsLogo && (
                      <div className="mb-0.5">
                        <span className="bg-[#005eb8] text-white font-black italic px-1 py-0.2 text-[8px] rounded-2xs inline-block">
                          NHS
                        </span>
                      </div>
                    )}

                    {/* Main Label Text */}
                    <div className="whitespace-pre-wrap break-words flex-1 text-[#212b32]">
                      {content.text || <span className="text-slate-300 italic">Empty</span>}
                    </div>

                    {/* Barcode if enabled */}
                    {styleSettings.addBarcode && (
                      <div className="mt-0.5">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: generateBarcodeSvg(content.barcodeValue || 'NHS-49102'),
                          }}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
