import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Printer, Ruler, Sliders, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { PrinterCalibration } from '../types';

interface PrintCalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrintTestSheet: () => void;
  calibration: PrinterCalibration;
  setCalibration: (cal: PrinterCalibration) => void;
}

export const PrintCalibrationModal: React.FC<PrintCalibrationModalProps> = ({
  isOpen,
  onClose,
  onPrintTestSheet,
  calibration,
  setCalibration,
}) => {
  const [showOffsetPanel, setShowOffsetPanel] = useState<boolean>(false);

  if (!isOpen) return null;

  const hasNonZeroOffset = calibration.offsetXmm !== 0 || calibration.offsetYmm !== 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-[#d8dde0]">
        {/* Header */}
        <div className="bg-[#005eb8] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white text-[#005eb8] font-black italic px-2 py-0.5 text-sm rounded-xs">
              NHS
            </div>
            <h2 className="text-base font-bold">
              Printer Settings & Alignment Calibration Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-sm text-[#212b32] max-h-[80vh] overflow-y-auto">
          <p className="text-xs text-[#4c6272] leading-relaxed">
            Standard browser print dialogs (Google Chrome, Microsoft Edge, Safari) sometimes default to "Fit to Page" or add default margins. For labels to align perfectly onto pre-cut A4 sheets, verify these 3 settings in the print window:
          </p>

          {/* 3 Golden Rules */}
          <div className="space-y-3">
            <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-lg flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#005eb8] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-xs font-bold text-[#005eb8] uppercase block">
                  Paper Size: Must be A4
                </strong>
                <p className="text-xs text-[#4c6272] mt-0.5">
                  Confirm the paper size dropdown is set to <strong>A4</strong> (210 × 297 mm), not US Letter or Executive.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-lg flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#005eb8] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-xs font-bold text-[#005eb8] uppercase block">
                  Margins: Set to "None" or "Minimum"
                </strong>
                <p className="text-xs text-[#4c6272] mt-0.5">
                  In the print preview, expand "More settings" and change <strong>Margins: None</strong>. Do not use "Default" margins because the browser will shift your sheet down and right.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-lg flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#005eb8] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-xs font-bold text-[#005eb8] uppercase block">
                  Scale: Set to 100% (Actual Size)
                </strong>
                <p className="text-xs text-[#4c6272] mt-0.5">
                  Never select "Fit to printable area" or "Fit to paper". Choose <strong>Scale: 100%</strong> (or "Default" / "Actual size").
                </p>
              </div>
            </div>
          </div>

          {/* Test Sheet Banner */}
          <div className="p-4 bg-[#f0f4f5] border border-[#d8dde0] rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Ruler className="w-5 h-5 text-[#005eb8] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-[#212b32] block">
                  Print 100mm Physical Test Sheet
                </span>
                <span className="text-[11px] text-[#4c6272] block">
                  Prints an A4 verification page with a 100mm calibration ruler so you can hold up a physical desk ruler and verify 100% scale before using real label sheets.
                </span>
              </div>
            </div>

            <button
              onClick={onPrintTestSheet}
              className="px-3.5 py-2 text-xs font-bold text-[#005eb8] bg-white border border-[#005eb8] hover:bg-blue-50 rounded-md whitespace-nowrap shrink-0 shadow-2xs"
            >
              Print Test Sheet
            </button>
          </div>

          {/* Printer Hardware Offset Button & Panel */}
          <div className="border border-[#d8dde0] rounded-lg overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => setShowOffsetPanel((prev) => !prev)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-[#005eb8]" />
                <div>
                  <span className="text-xs font-bold text-[#212b32] block">
                    Printer Hardware Offset Calibration
                  </span>
                  <span className="text-[11px] text-[#4c6272] block">
                    {hasNonZeroOffset
                      ? `Active Hardware Offset: X: ${calibration.offsetXmm}mm, Y: ${calibration.offsetYmm}mm`
                      : 'Fine-tune margin offset if your printer pulls paper slightly off-center'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#005eb8]">
                <span>{showOffsetPanel ? 'Hide Controls' : 'Adjust Offsets'}</span>
                {showOffsetPanel ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </button>

            {showOffsetPanel && (
              <div className="p-4 bg-[#f0f4f5] border-t border-[#d8dde0] space-y-4">
                <p className="text-xs text-[#4c6272]">
                  Some office laserjet printers have feeder rollers that pull paper 1–2 mm left, right, up, or down. Enter fine-tuning offsets below to shift all printed labels:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded border border-[#d8dde0]">
                    <label className="block text-xs font-bold text-[#212b32] mb-1">
                      Horizontal Offset (X)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.5"
                        min="-15"
                        max="15"
                        value={calibration.offsetXmm}
                        onChange={(e) =>
                          setCalibration({
                            ...calibration,
                            offsetXmm: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-24 px-3 py-1.5 text-sm border border-[#768692] rounded bg-white font-mono text-center"
                      />
                      <span className="text-xs text-[#4c6272]">mm (+ Right, - Left)</span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded border border-[#d8dde0]">
                    <label className="block text-xs font-bold text-[#212b32] mb-1">
                      Vertical Offset (Y)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.5"
                        min="-15"
                        max="15"
                        value={calibration.offsetYmm}
                        onChange={(e) =>
                          setCalibration({
                            ...calibration,
                            offsetYmm: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-24 px-3 py-1.5 text-sm border border-[#768692] rounded bg-white font-mono text-center"
                      />
                      <span className="text-xs text-[#4c6272]">mm (+ Down, - Up)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[#4c6272]">
                    {hasNonZeroOffset
                      ? `Active: X: ${calibration.offsetXmm}mm, Y: ${calibration.offsetYmm}mm`
                      : 'Offsets are currently at 0 mm.'}
                  </span>

                  {hasNonZeroOffset && (
                    <button
                      type="button"
                      onClick={() => setCalibration({ offsetXmm: 0, offsetYmm: 0 })}
                      className="px-3 py-1 text-xs text-[#005eb8] hover:bg-white rounded border border-[#005eb8]/40 font-semibold flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset to 0 mm
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#f0f4f5] px-6 py-3 border-t border-[#d8dde0] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-[#005eb8] hover:bg-[#004b93] rounded-md transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
