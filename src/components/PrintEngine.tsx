import React from 'react';
import {
  ContentMode,
  LabelDimensions,
  LabelStyleSettings,
  PrinterCalibration,
  SpreadsheetState,
} from '../types';
import { formatLabelText, generateBarcodeSvg } from '../utils/sampleData';

interface PrintEngineProps {
  dimensions: LabelDimensions;
  styleSettings: LabelStyleSettings;
  calibration: PrinterCalibration;
  mode: ContentMode;
  repeatText: string;
  spreadsheet: SpreadsheetState;
  skippedIndices: Set<number>;
}

export const PrintEngine: React.FC<PrintEngineProps> = ({
  dimensions,
  styleSettings,
  calibration,
  mode,
  repeatText,
  spreadsheet,
  skippedIndices,
}) => {
  const labelsPerSheet = dimensions.cols * dimensions.rows;

  let totalRecords = 0;
  if (mode === 'repeat') {
    totalRecords = labelsPerSheet;
  } else {
    totalRecords = spreadsheet.rows.length;
  }

  const startOffset = mode === 'spreadsheet' ? spreadsheet.startOffset : 0;
  const totalSlotsNeeded = totalRecords + startOffset;
  const totalSheets = Math.max(1, Math.ceil(totalSlotsNeeded / labelsPerSheet));

  // Determine text for a specific slot on pageIndex
  const getSlotData = (pageIndex: number, slotIndex: number) => {
    const globalIndex = pageIndex * labelsPerSheet + slotIndex;

    if (skippedIndices.has(globalIndex)) {
      return { print: false, text: '', barcode: '' };
    }

    if (mode === 'repeat') {
      return { print: true, text: repeatText, barcode: '' };
    }

    // Spreadsheet mode
    if (globalIndex < startOffset) {
      return { print: false, text: '', barcode: '' };
    }

    const recordIndex = globalIndex - startOffset;
    if (recordIndex < spreadsheet.rows.length) {
      const row = spreadsheet.rows[recordIndex];
      const text = formatLabelText(spreadsheet.template, row);
      const barcode = row['NHS Number'] || row['NHS No'] || row['ID'] || '';
      return { print: true, text, barcode };
    }

    return { print: false, text: '', barcode: '' };
  };

  return (
    <div className="print-area-wrapper hidden print:block">
      {Array.from({ length: totalSheets }).map((_, pageIndex) => (
        <div
          key={pageIndex}
          className="a4-print-sheet"
          style={{
            width: '210mm',
            height: '297mm',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
            pageBreakAfter: pageIndex < totalSheets - 1 ? 'always' : 'auto',
            breakAfter: pageIndex < totalSheets - 1 ? 'page' : 'auto',
            boxSizing: 'border-box',
          }}
        >
          {Array.from({ length: labelsPerSheet }).map((_, slotIndex) => {
            const col = slotIndex % dimensions.cols;
            const row = Math.floor(slotIndex / dimensions.cols);

            const leftMm =
              dimensions.leftMargin +
              col * (dimensions.labelWidth + dimensions.colGap) +
              calibration.offsetXmm;

            const topMm =
              dimensions.topMargin +
              row * (dimensions.labelHeight + dimensions.rowGap) +
              calibration.offsetYmm;

            const slot = getSlotData(pageIndex, slotIndex);

            if (!slot.print || !slot.text.trim()) {
              // Completely blank slot: render invisible spacer so nothing prints
              return (
                <div
                  key={slotIndex}
                  style={{
                    position: 'absolute',
                    left: `${leftMm}mm`,
                    top: `${topMm}mm`,
                    width: `${dimensions.labelWidth}mm`,
                    height: `${dimensions.labelHeight}mm`,
                    visibility: 'hidden',
                  }}
                />
              );
            }

            return (
              <div
                key={slotIndex}
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
                  border: styleSettings.showBorder ? '1px solid #000000' : 'none',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                }}
                className="flex flex-col justify-between"
              >
                {/* Optional NHS Badge */}
                {styleSettings.addNhsLogo && (
                  <div className="mb-0.5">
                    <span
                      style={{
                        backgroundColor: '#005eb8',
                        color: '#ffffff',
                        fontWeight: 900,
                        fontStyle: 'italic',
                        padding: '1px 3px',
                        fontSize: '7pt',
                        borderRadius: '1px',
                        display: 'inline-block',
                      }}
                    >
                      NHS
                    </span>
                  </div>
                )}

                {/* Label text */}
                <div
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    color: '#000000',
                    flex: 1,
                  }}
                >
                  {slot.text}
                </div>

                {/* Optional Barcode */}
                {styleSettings.addBarcode && (
                  <div style={{ marginTop: '1mm' }}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: generateBarcodeSvg(slot.barcode || 'NHS-49102'),
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
