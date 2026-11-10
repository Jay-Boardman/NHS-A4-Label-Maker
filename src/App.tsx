import React, { useState } from 'react';
import {
  ContentMode,
  LabelDimensions,
  LabelStyleSettings,
  PrinterCalibration,
  SpreadsheetState,
} from './types';
import {
  DEFAULT_LABEL_DIMENSIONS,
  DEFAULT_STYLE_SETTINGS,
} from './constants/presets';
import { NHSHeader } from './components/NHSHeader';
import { LabelDimensionEditor } from './components/LabelDimensionEditor';
import { ContentEditor } from './components/ContentEditor';
import { A4SheetPreview } from './components/A4SheetPreview';
import { PrintEngine } from './components/PrintEngine';
import { PrintCalibrationModal } from './components/PrintCalibrationModal';
import { TestCalibrationSheet } from './components/TestCalibrationSheet';
import { Printer, HelpCircle, Layers, FileSpreadsheet, Eye } from 'lucide-react';

export default function App() {
  // Label Sheet Geometry Dimensions (defaults to 21 labels 63.5 x 38.1mm)
  const [dimensions, setDimensions] = useState<LabelDimensions>(DEFAULT_LABEL_DIMENSIONS);

  // Printer Hardware Calibration Offsets (± mm)
  const [calibration, setCalibration] = useState<PrinterCalibration>({
    offsetXmm: 0,
    offsetYmm: 0,
  });

  // Content Generation Mode ('repeat' vs 'spreadsheet')
  const [mode, setMode] = useState<ContentMode>('repeat');

  // Single Repeating Label Text
  const [repeatText, setRepeatText] = useState<string>(
    'PRIVATE & CONFIDENTIAL\nMrs Sarah Jenkins\n42 Nightingale Way\nLeeds\nLS1 4DP'
  );

  // Label Typography and Styling
  const [styleSettings, setStyleSettings] = useState<LabelStyleSettings>(DEFAULT_STYLE_SETTINGS);

  // Spreadsheet Data State
  const [spreadsheet, setSpreadsheet] = useState<SpreadsheetState>({
    fileName: '',
    headers: [],
    rows: [],
    template: '',
    startOffset: 0,
  });

  // Manual skipped label indices (for reusing partially peeled sheets)
  const [skippedIndices, setSkippedIndices] = useState<Set<number>>(new Set());

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'setup' | 'content' | 'preview'>('setup');

  // Calibration Help Modal
  const [isCalibrationModalOpen, setIsCalibrationModalOpen] = useState<boolean>(false);

  // Test Calibration Sheet Print Mode
  const [isPrintingTestSheet, setIsPrintingTestSheet] = useState<boolean>(false);

  // Total calculations
  const labelsPerSheet = dimensions.cols * dimensions.rows;
  let totalRecords = 0;
  if (mode === 'repeat') {
    totalRecords = labelsPerSheet;
  } else {
    totalRecords = spreadsheet.rows.length;
  }

  const startOffset = mode === 'spreadsheet' ? spreadsheet.startOffset : 0;
  const totalSlotsNeeded = totalRecords + startOffset;
  const totalSheets = Math.max(1, Math.ceil(totalSlotsNeeded / (labelsPerSheet || 1)));

  // Print Handlers
  const handlePrint = () => {
    setIsPrintingTestSheet(false);
    setTimeout(() => {
      window.print();
    }, 50);
  };

  const handlePrintTestSheet = () => {
    setIsPrintingTestSheet(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setIsPrintingTestSheet(false);
      }, 1000);
    }, 50);
  };

  const toggleSkipIndex = (globalIndex: number) => {
    setSkippedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(globalIndex)) {
        next.delete(globalIndex);
      } else {
        next.add(globalIndex);
      }
      return next;
    });
  };

  const clearSkippedIndices = () => {
    setSkippedIndices(new Set());
  };

  return (
    <>
      {/* Screen Interface - Completely excluded from print render tree */}
      <div id="screen-ui" className="no-print min-h-screen flex flex-col bg-[#f0f4f5] text-[#212b32]">
        {/* NHS Standard Top Header */}
        <NHSHeader
          totalSheets={totalSheets}
          totalLabels={totalRecords}
          onPrint={handlePrint}
          onOpenCalibration={() => setIsCalibrationModalOpen(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          contentMode={mode}
        />

        {/* Main Workspace Body */}
        <main className="no-print flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
          {activeTab === 'setup' && (
            <LabelDimensionEditor
              dimensions={dimensions}
              setDimensions={setDimensions}
              calibration={calibration}
              setCalibration={setCalibration}
              onProceed={() => setActiveTab('content')}
            />
          )}

          {activeTab === 'content' && (
            <ContentEditor
              mode={mode}
              setMode={setMode}
              repeatText={repeatText}
              setRepeatText={setRepeatText}
              styleSettings={styleSettings}
              setStyleSettings={setStyleSettings}
              spreadsheet={spreadsheet}
              setSpreadsheet={setSpreadsheet}
              dimensions={dimensions}
              onProceed={() => setActiveTab('preview')}
            />
          )}

          {activeTab === 'preview' && (
            <A4SheetPreview
              dimensions={dimensions}
              styleSettings={styleSettings}
              calibration={calibration}
              mode={mode}
              repeatText={repeatText}
              spreadsheet={spreadsheet}
              onPrint={handlePrint}
              onOpenCalibration={() => setIsCalibrationModalOpen(true)}
              skippedIndices={skippedIndices}
              toggleSkipIndex={toggleSkipIndex}
              onClearSkipped={clearSkippedIndices}
            />
          )}
        </main>

        {/* Persistent Status & Quick Navigation Footer */}
        <footer className="no-print bg-white border-t border-[#d8dde0] py-3 px-4 lg:px-8 text-xs text-[#4c6272]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#005eb8]">Jays A4 Label Studio</span>
              <span>·</span>
              <span>Sheet: <strong>{dimensions.name}</strong> ({dimensions.labelWidth} × {dimensions.labelHeight} mm, {dimensions.cols * dimensions.rows} labels/sheet)</span>
              <span>·</span>
              <span>Mode: <strong>{mode === 'repeat' ? 'Single Repeat' : `Spreadsheet (${spreadsheet.rows.length} rows)`}</strong></span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCalibrationModalOpen(true)}
                className="text-[#005eb8] hover:underline font-semibold flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Printer Settings Help
              </button>
              <span>·</span>
              <span>Standard A4: 210 × 297 mm</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Hidden Print Engine (Only visible during @media print) */}
      {isPrintingTestSheet ? (
        <div className="print-area-wrapper hidden print:block">
          <TestCalibrationSheet />
        </div>
      ) : (
        <PrintEngine
          dimensions={dimensions}
          styleSettings={styleSettings}
          calibration={calibration}
          mode={mode}
          repeatText={repeatText}
          spreadsheet={spreadsheet}
          skippedIndices={skippedIndices}
        />
      )}

      {/* Calibration Guide Modal */}
      <div className="no-print">
        <PrintCalibrationModal
          isOpen={isCalibrationModalOpen}
          onClose={() => setIsCalibrationModalOpen(false)}
          onPrintTestSheet={handlePrintTestSheet}
          calibration={calibration}
          setCalibration={setCalibration}
        />
      </div>
    </>
  );
}
