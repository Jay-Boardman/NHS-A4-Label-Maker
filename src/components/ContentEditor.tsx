import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  ContentMode,
  LabelDimensions,
  LabelStyleSettings,
  SpreadsheetRow,
  SpreadsheetState,
} from '../types';
import {
  SAMPLE_NHS_PATIENTS,
  downloadSampleSpreadsheet,
  formatLabelText,
  generateBarcodeSvg,
} from '../utils/sampleData';
import {
  FileSpreadsheet,
  Copy,
  Upload,
  Download,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Eye,
  CheckCircle2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Info,
  ArrowRight,
  Search,
} from 'lucide-react';

interface ContentEditorProps {
  mode: ContentMode;
  setMode: (mode: ContentMode) => void;
  repeatText: string;
  setRepeatText: (text: string) => void;
  styleSettings: LabelStyleSettings;
  setStyleSettings: React.Dispatch<React.SetStateAction<LabelStyleSettings>>;
  spreadsheet: SpreadsheetState;
  setSpreadsheet: React.Dispatch<React.SetStateAction<SpreadsheetState>>;
  dimensions: LabelDimensions;
  onProceed: () => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  mode,
  setMode,
  repeatText,
  setRepeatText,
  styleSettings,
  setStyleSettings,
  spreadsheet,
  setSpreadsheet,
  dimensions,
  onProceed,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const templateTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [currentPreviewRecord, setCurrentPreviewRecord] = useState<number>(0);
  const [tableSearch, setTableSearch] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const labelsPerSheet = dimensions.cols * dimensions.rows;

  // Handle spreadsheet file parsing (.xlsx, .xls, .csv)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const parsedRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
          defval: '',
        });

        if (!parsedRows || parsedRows.length === 0) {
          setUploadError('The uploaded spreadsheet contains no data rows.');
          return;
        }

        // Extract headers
        const headers = Object.keys(parsedRows[0]);
        const formattedRows: SpreadsheetRow[] = parsedRows.map((r) => {
          const rowObj: SpreadsheetRow = {};
          headers.forEach((h) => {
            rowObj[h] = String(r[h] ?? '').trim();
          });
          return rowObj;
        });

        // Generate default template from headers
        let defaultTemplate = '';
        if (headers.includes('Title') && headers.includes('First Name') && headers.includes('Last Name')) {
          defaultTemplate = '{Title} {First Name} {Last Name}\n';
        } else if (headers.includes('First Name') && headers.includes('Last Name')) {
          defaultTemplate = '{First Name} {Last Name}\n';
        } else if (headers.length > 0) {
          defaultTemplate = `{${headers[0]}}\n`;
        }

        if (headers.includes('Address Line 1')) defaultTemplate += '{Address Line 1}\n';
        if (headers.includes('Address Line 2')) defaultTemplate += '{Address Line 2}\n';
        if (headers.includes('City')) defaultTemplate += '{City}\n';
        if (headers.includes('Postcode')) defaultTemplate += '{Postcode}';

        setSpreadsheet({
          fileName: file.name,
          headers,
          rows: formattedRows,
          template: defaultTemplate || headers.map((h) => `{${h}}`).join('\n'),
          startOffset: 0,
        });

        setCurrentPreviewRecord(0);
      } catch (err: any) {
        setUploadError(`Failed to read spreadsheet: ${err?.message || 'Invalid format'}`);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Load built-in NHS sample patient addresses
  const handleLoadSampleData = () => {
    const headers = Object.keys(SAMPLE_NHS_PATIENTS[0]);
    setSpreadsheet({
      fileName: 'NHS_Sample_Patients_List.xlsx',
      headers,
      rows: SAMPLE_NHS_PATIENTS,
      template: `CONFIDENTIAL
{Title} {First Name} {Last Name}
{Address Line 1}
{Address Line 2}
{City}
{Postcode}
NHS: {NHS Number}`,
      startOffset: 0,
    });
    setMode('spreadsheet');
    setCurrentPreviewRecord(0);
    setUploadError(null);
  };

  // Insert a token/placeholder like {First Name} into template
  const handleInsertToken = (token: string) => {
    const placeholder = `{${token}}`;
    const textarea = templateTextareaRef.current;
    if (!textarea) {
      setSpreadsheet((prev) => ({ ...prev, template: prev.template + ' ' + placeholder }));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const oldText = spreadsheet.template;
    const newText = oldText.substring(0, start) + placeholder + oldText.substring(end);

    setSpreadsheet((prev) => ({ ...prev, template: newText }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + placeholder.length, start + placeholder.length);
    }, 50);
  };

  // Filtered rows for the inspection table
  const filteredRows = spreadsheet.rows.filter((row) => {
    if (!tableSearch) return true;
    const q = tableSearch.toLowerCase();
    return Object.values(row).some((val) => val.toLowerCase().includes(q));
  });

  // Calculate pages required for spreadsheet
  const totalSheetsRequired =
    mode === 'repeat'
      ? 1
      : Math.ceil(
          (spreadsheet.rows.length + (spreadsheet.startOffset || 0)) / (labelsPerSheet || 1)
        ) || 1;

  // Single label preview text
  const previewText =
    mode === 'repeat'
      ? repeatText
      : spreadsheet.rows.length > 0
      ? formatLabelText(spreadsheet.template, spreadsheet.rows[currentPreviewRecord] || spreadsheet.rows[0])
      : 'No spreadsheet data loaded yet';

  return (
    <div className="space-y-6">
      {/* Mode Selector Segmented Tabs */}
      <div className="bg-white p-5 rounded-lg border border-[#d8dde0] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#212b32]">Select Label Generation Mode</h2>
            <p className="text-xs text-[#4c6272] mt-0.5">
              Choose whether to duplicate one label across the entire sheet, or upload a spreadsheet for multiple people.
            </p>
          </div>

          <div className="flex bg-[#f0f4f5] p-1 rounded-lg border border-[#d8dde0]">
            <button
              onClick={() => setMode('repeat')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-md transition-all ${
                mode === 'repeat'
                  ? 'bg-[#005eb8] text-white shadow-xs'
                  : 'text-[#4c6272] hover:text-[#212b32]'
              }`}
            >
              <Copy className="w-4 h-4" />
              <span>Single Repeating Label (All Labels Same)</span>
            </button>

            <button
              onClick={() => setMode('spreadsheet')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-md transition-all ${
                mode === 'spreadsheet'
                  ? 'bg-[#005eb8] text-white shadow-xs'
                  : 'text-[#4c6272] hover:text-[#212b32]'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Spreadsheet / Address List (Mail Merge)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {mode === 'repeat' ? (
            /* MODE A: Single Repeating Label */
            <div className="bg-white p-5 rounded-lg border border-[#d8dde0] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#212b32] uppercase tracking-wide">
                    Repeating Label Text
                  </h3>
                  <p className="text-xs text-[#4c6272]">
                    This text will automatically populate all {labelsPerSheet} labels on the A4 sheet.
                  </p>
                </div>
              </div>

              {/* Text Area */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#212b32]">
                    Type Label Content
                  </label>
                  {repeatText && (
                    <button
                      type="button"
                      onClick={() => setRepeatText('')}
                      className="text-[11px] text-[#4c6272] hover:text-red-600 font-medium"
                    >
                      Clear text
                    </button>
                  )}
                </div>
                <textarea
                  rows={6}
                  value={repeatText}
                  onChange={(e) => setRepeatText(e.target.value)}
                  placeholder="Enter text to appear on all labels..."
                  className="w-full p-3 text-sm border border-[#768692] rounded bg-white text-[#212b32] focus:border-[#005eb8] focus:ring-1 focus:ring-[#005eb8] outline-hidden font-sans"
                />
              </div>
            </div>
          ) : (
            /* MODE B: Spreadsheet Mail Merge Upload */
            <div className="bg-white p-5 rounded-lg border border-[#d8dde0] shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#212b32] uppercase tracking-wide flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-[#005eb8]" />
                    Upload Spreadsheet (.xlsx, .xls, .csv)
                  </h3>
                  <p className="text-xs text-[#4c6272]">
                    Upload a spreadsheet of patient addresses or clinical records to generate individual labels.
                  </p>
                </div>
              </div>

              {/* Upload Drop Zone & Sample Buttons */}
              <div className="border-2 border-dashed border-[#005eb8]/40 bg-blue-50/20 hover:bg-blue-50/40 rounded-lg p-5 text-center transition-colors">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                />

                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-[#005eb8]" />
                  <div className="text-xs text-[#212b32] font-semibold">
                    {spreadsheet.fileName ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Loaded: {spreadsheet.fileName} ({spreadsheet.rows.length} records)
                      </span>
                    ) : (
                      <span>Drag & drop your Excel or CSV file here, or</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-[#005eb8] hover:bg-[#004b93] rounded shadow-xs"
                    >
                      {spreadsheet.fileName ? 'Change File' : 'Select Spreadsheet File'}
                    </button>

                    <button
                      onClick={handleLoadSampleData}
                      className="px-3 py-1.5 text-xs font-semibold text-[#005eb8] bg-white border border-[#005eb8] hover:bg-blue-50 rounded flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Load Sample NHS Patients (21 Records)</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-[#4c6272]">
                    <span>Need a blank template?</span>
                    <button
                      onClick={() => downloadSampleSpreadsheet('xlsx')}
                      className="text-[#005eb8] hover:underline font-medium flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Download Excel Template
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => downloadSampleSpreadsheet('csv')}
                      className="text-[#005eb8] hover:underline font-medium flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Download CSV
                    </button>
                  </div>
                </div>
              </div>

              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                  {uploadError}
                </div>
              )}

              {/* Template Builder with Column Insertion Chips */}
              {spreadsheet.headers.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-[#d8dde0]">
                  <div>
                    <label className="block text-xs font-bold text-[#212b32] mb-1">
                      Click to insert spreadsheet column into label:
                    </label>
                    <div className="flex flex-wrap gap-1.5 p-2 bg-[#f0f4f5] rounded border border-[#d8dde0]">
                      {spreadsheet.headers.map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => handleInsertToken(h)}
                          className="px-2.5 py-1 text-xs font-medium bg-white text-[#005eb8] border border-[#005eb8]/30 rounded hover:bg-[#005eb8] hover:text-white transition-colors cursor-pointer shadow-2xs"
                        >
                          +{h}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#212b32] mb-1">
                      Label Format Template
                    </label>
                    <textarea
                      ref={templateTextareaRef}
                      rows={5}
                      value={spreadsheet.template}
                      onChange={(e) =>
                        setSpreadsheet((prev) => ({ ...prev, template: e.target.value }))
                      }
                      className="w-full p-2.5 text-xs border border-[#768692] rounded bg-white text-[#212b32] focus:border-[#005eb8] focus:ring-1 focus:ring-[#005eb8] outline-hidden font-mono"
                    />
                    <p className="text-[11px] text-[#4c6272] mt-0.5">
                      Placeholders like <code className="bg-[#f0f4f5] px-1 rounded">&#123;First Name&#125;</code> will be replaced with each row's data. Empty optional lines are automatically collapsed.
                    </p>
                  </div>

                  {/* Partial Sheet / Skip Used Labels Selector */}
                  <div className="p-3 bg-[#f0f4f5] rounded border border-[#d8dde0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-[#212b32] block">
                        Reuse Partially Peeled Sheet?
                      </span>
                      <span className="text-[11px] text-[#4c6272]">
                        Start printing from label #{spreadsheet.startOffset + 1} to skip already used labels on Sheet 1.
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <label className="text-xs font-medium text-[#212b32]">Start at Label:</label>
                      <select
                        value={spreadsheet.startOffset}
                        onChange={(e) =>
                          setSpreadsheet((prev) => ({
                            ...prev,
                            startOffset: parseInt(e.target.value) || 0,
                          }))
                        }
                        className="text-xs px-2.5 py-1.5 border border-[#768692] rounded bg-white font-bold text-[#005eb8]"
                      >
                        {Array.from({ length: labelsPerSheet }).map((_, idx) => (
                          <option key={idx} value={idx}>
                            #{idx + 1} {idx === 0 ? '(Top Left / Full Sheet)' : `(Skip ${idx} labels)`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Typography & Style Toolbar (Common to both modes) */}
          <div className="bg-white p-5 rounded-lg border border-[#d8dde0] shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#212b32] uppercase tracking-wide">
              Typography & Label Layout
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Font Size */}
              <div>
                <label className="block text-xs font-semibold text-[#212b32] mb-1">
                  Font Size
                </label>
                <select
                  value={styleSettings.fontSizePt}
                  onChange={(e) =>
                    setStyleSettings((prev) => ({
                      ...prev,
                      fontSizePt: parseInt(e.target.value) || 10,
                    }))
                  }
                  className="w-full text-xs px-2.5 py-1.5 border border-[#768692] rounded bg-white"
                >
                  <option value={7}>7 pt (Very Small / Mini)</option>
                  <option value={8}>8 pt (Small)</option>
                  <option value={9}>9 pt (Compact)</option>
                  <option value={10}>10 pt (Standard NHS)</option>
                  <option value={11}>11 pt (Medium)</option>
                  <option value={12}>12 pt (Large)</option>
                  <option value={14}>14 pt (Extra Large)</option>
                  <option value={16}>16 pt (Bold Notice)</option>
                </select>
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-xs font-semibold text-[#212b32] mb-1">
                  Font Style
                </label>
                <select
                  value={styleSettings.fontFamily}
                  onChange={(e) =>
                    setStyleSettings((prev) => ({
                      ...prev,
                      fontFamily: e.target.value as any,
                    }))
                  }
                  className="w-full text-xs px-2.5 py-1.5 border border-[#768692] rounded bg-white"
                >
                  <option value="sans">Clean Sans-Serif (NHS)</option>
                  <option value="mono">Monospace (Clinical/Data)</option>
                  <option value="serif">Serif (Formal)</option>
                </select>
              </div>

              {/* Alignment */}
              <div>
                <label className="block text-xs font-semibold text-[#212b32] mb-1">
                  Text Align
                </label>
                <div className="flex border border-[#768692] rounded overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setStyleSettings((prev) => ({ ...prev, textAlign: 'left' }))}
                    className={`flex-1 py-1.5 flex items-center justify-center transition-colors ${
                      styleSettings.textAlign === 'left' ? 'bg-[#005eb8] text-white' : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setStyleSettings((prev) => ({ ...prev, textAlign: 'center' }))}
                    className={`flex-1 py-1.5 flex items-center justify-center transition-colors ${
                      styleSettings.textAlign === 'center' ? 'bg-[#005eb8] text-white' : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setStyleSettings((prev) => ({ ...prev, textAlign: 'right' }))}
                    className={`flex-1 py-1.5 flex items-center justify-center transition-colors ${
                      styleSettings.textAlign === 'right' ? 'bg-[#005eb8] text-white' : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-xs font-semibold text-[#212b32] mb-1">
                  Font Weight
                </label>
                <select
                  value={styleSettings.fontWeight}
                  onChange={(e) =>
                    setStyleSettings((prev) => ({
                      ...prev,
                      fontWeight: e.target.value as any,
                    }))
                  }
                  className="w-full text-xs px-2.5 py-1.5 border border-[#768692] rounded bg-white"
                >
                  <option value="normal">Normal (400)</option>
                  <option value="semibold">Medium-Bold (600)</option>
                  <option value="bold">Heavy Bold (700)</option>
                </select>
              </div>
            </div>

            {/* Additional Features: NHS Logo, Barcode, Borders */}
            <div className="pt-2 border-t border-[#d8dde0] grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 text-xs text-[#212b32] cursor-pointer">
                <input
                  type="checkbox"
                  checked={styleSettings.addNhsLogo}
                  onChange={(e) =>
                    setStyleSettings((prev) => ({ ...prev, addNhsLogo: e.target.checked }))
                  }
                  className="rounded text-[#005eb8] focus:ring-[#005eb8]"
                />
                <span className="font-medium">Add NHS Logo Badge</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#212b32] cursor-pointer">
                <input
                  type="checkbox"
                  checked={styleSettings.showBorder}
                  onChange={(e) =>
                    setStyleSettings((prev) => ({ ...prev, showBorder: e.target.checked }))
                  }
                  className="rounded text-[#005eb8] focus:ring-[#005eb8]"
                />
                <span className="font-medium">Print Cut / Border Line</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#212b32] cursor-pointer">
                <input
                  type="checkbox"
                  checked={styleSettings.addBarcode}
                  onChange={(e) =>
                    setStyleSettings((prev) => ({ ...prev, addBarcode: e.target.checked }))
                  }
                  className="rounded text-[#005eb8] focus:ring-[#005eb8]"
                />
                <span className="font-medium">Add Barcode / Tracking</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Live Label Preview Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-lg border border-[#d8dde0] shadow-xs sticky top-24">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#212b32] uppercase tracking-wide flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#005eb8]" />
                Individual Label Preview
              </h3>

              <span className="text-xs text-[#4c6272]">
                {dimensions.labelWidth} × {dimensions.labelHeight} mm
              </span>
            </div>

            {/* Record navigation for spreadsheet mode */}
            {mode === 'spreadsheet' && spreadsheet.rows.length > 0 && (
              <div className="flex items-center justify-between bg-[#f0f4f5] px-3 py-1.5 rounded mb-3 text-xs">
                <span className="font-semibold text-[#212b32]">
                  Record {currentPreviewRecord + 1} of {spreadsheet.rows.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPreviewRecord === 0}
                    onClick={() => setCurrentPreviewRecord((p) => Math.max(0, p - 1))}
                    className="p-1 rounded hover:bg-white disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={currentPreviewRecord >= spreadsheet.rows.length - 1}
                    onClick={() =>
                      setCurrentPreviewRecord((p) =>
                        Math.min(spreadsheet.rows.length - 1, p + 1)
                      )
                    }
                    className="p-1 rounded hover:bg-white disabled:opacity-30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* The Scaled Label Box */}
            <div className="bg-slate-100 p-4 rounded-lg flex items-center justify-center border border-slate-200 min-h-[220px]">
              <div
                style={{
                  width: '100%',
                  maxWidth: '320px',
                  aspectRatio: `${dimensions.labelWidth} / ${dimensions.labelHeight}`,
                  borderRadius: `${dimensions.cornerRadius * 2}px`,
                  fontSize: `${styleSettings.fontSizePt}pt`,
                  textAlign: styleSettings.textAlign,
                  fontFamily:
                    styleSettings.fontFamily === 'mono'
                      ? 'JetBrains Mono, monospace'
                      : styleSettings.fontFamily === 'serif'
                      ? 'serif'
                      : 'Plus Jakarta Sans, sans-serif',
                  fontWeight: styleSettings.fontWeight === 'bold' ? 700 : styleSettings.fontWeight === 'semibold' ? 600 : 400,
                  lineHeight: styleSettings.lineHeight,
                  padding: `${styleSettings.paddingMm * 1.5}mm`,
                }}
                className={`bg-white shadow-sm border border-slate-300 flex flex-col justify-between overflow-hidden relative select-none`}
              >
                {/* Optional NHS Logo */}
                {styleSettings.addNhsLogo && (
                  <div className="mb-1">
                    <span className="bg-[#005eb8] text-white font-black italic px-1.5 py-0.5 text-[9px] rounded-2xs inline-block">
                      NHS
                    </span>
                  </div>
                )}

                {/* Content text */}
                <div className="whitespace-pre-wrap break-words flex-1 text-[#212b32]">
                  {previewText || <span className="text-slate-400 italic">Label is blank</span>}
                </div>

                {/* Optional Barcode */}
                {styleSettings.addBarcode && (
                  <div className="mt-1 pt-1 border-t border-slate-100">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: generateBarcodeSvg(
                          mode === 'spreadsheet' && spreadsheet.rows[currentPreviewRecord]?.['NHS Number']
                            ? spreadsheet.rows[currentPreviewRecord]['NHS Number']
                            : 'NHS-739281'
                        ),
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Summary details */}
            <div className="mt-4 pt-3 border-t border-[#d8dde0] text-xs text-[#4c6272] space-y-1">
              <div className="flex justify-between">
                <span>Total labels per sheet:</span>
                <span className="font-bold text-[#212b32]">{labelsPerSheet}</span>
              </div>
              <div className="flex justify-between">
                <span>Active records / content:</span>
                <span className="font-bold text-[#212b32]">
                  {mode === 'repeat' ? `${labelsPerSheet} (repeating)` : `${spreadsheet.rows.length} addresses`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sheets required:</span>
                <span className="font-bold text-[#005eb8]">{totalSheetsRequired} A4 Sheet(s)</span>
              </div>
            </div>

            <button
              onClick={onProceed}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#005eb8] hover:bg-[#004b93] text-white text-xs font-bold rounded-md shadow-xs transition-colors"
            >
              <span>Continue to Sheet Preview & Print</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Spreadsheet Data Inspection Table (if in spreadsheet mode) */}
      {mode === 'spreadsheet' && spreadsheet.rows.length > 0 && (
        <div className="bg-white p-5 rounded-lg border border-[#d8dde0] shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#212b32] uppercase tracking-wide">
                Spreadsheet Records ({spreadsheet.rows.length} total)
              </h3>
              <p className="text-xs text-[#4c6272]">
                Verify the uploaded address data before printing.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs border border-[#768692] rounded bg-white w-48"
                />
              </div>

              <button
                onClick={() =>
                  setSpreadsheet({
                    fileName: '',
                    headers: [],
                    rows: [],
                    template: '',
                    startOffset: 0,
                  })
                }
                className="p-1.5 text-xs text-red-600 hover:bg-red-50 rounded border border-red-200"
                title="Remove spreadsheet"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-[#d8dde0] rounded max-h-64">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f0f4f5] border-b border-[#d8dde0] sticky top-0">
                <tr>
                  <th className="p-2 font-bold text-[#212b32] w-12 text-center">#</th>
                  {spreadsheet.headers.slice(0, 7).map((h) => (
                    <th key={h} className="p-2 font-bold text-[#212b32]">
                      {h}
                    </th>
                  ))}
                  {spreadsheet.headers.length > 7 && (
                    <th className="p-2 font-bold text-[#4c6272]">
                      +{spreadsheet.headers.length - 7} more
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d8dde0]">
                {filteredRows.slice(0, 50).map((row, idx) => (
                  <tr
                    key={idx}
                    onClick={() => setCurrentPreviewRecord(idx)}
                    className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${
                      currentPreviewRecord === idx ? 'bg-blue-50 font-medium' : ''
                    }`}
                  >
                    <td className="p-2 text-center text-[#4c6272] tabular-nums">{idx + 1}</td>
                    {spreadsheet.headers.slice(0, 7).map((h) => (
                      <td key={h} className="p-2 text-[#212b32] truncate max-w-[160px]">
                        {row[h] || <span className="text-slate-300">—</span>}
                      </td>
                    ))}
                    {spreadsheet.headers.length > 7 && (
                      <td className="p-2 text-[#768692]">...</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRows.length > 50 && (
            <p className="text-[11px] text-[#4c6272] text-right">
              Showing first 50 of {filteredRows.length} matching rows
            </p>
          )}
        </div>
      )}
    </div>
  );
};
