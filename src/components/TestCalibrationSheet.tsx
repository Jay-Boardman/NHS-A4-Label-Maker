import React from 'react';

export const TestCalibrationSheet: React.FC = () => {
  return (
    <div
      className="a4-print-sheet text-black font-sans relative"
      style={{
        width: '210mm',
        height: '297mm',
        padding: '15mm',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
      }}
    >
      {/* 4 Corner Crosshairs for A4 Boundary Verification */}
      <div className="absolute top-[10mm] left-[10mm] text-[9px] font-mono">
        + (10mm, 10mm)
      </div>
      <div className="absolute top-[10mm] right-[10mm] text-[9px] font-mono text-right">
        + (200mm, 10mm)
      </div>
      <div className="absolute bottom-[10mm] left-[10mm] text-[9px] font-mono">
        + (10mm, 287mm)
      </div>
      <div className="absolute bottom-[10mm] right-[10mm] text-[9px] font-mono text-right">
        + (200mm, 287mm)
      </div>

      {/* Header */}
      <div className="border-b-2 border-black pb-4 mb-6">
        <div className="flex items-center gap-3">
          <span
            style={{
              backgroundColor: '#005eb8',
              color: '#ffffff',
              fontWeight: 900,
              fontStyle: 'italic',
              padding: '2px 8px',
              fontSize: '14pt',
              borderRadius: '2px',
              display: 'inline-block',
            }}
          >
            NHS
          </span>
          <span className="text-xl font-bold tracking-tight">
            A4 Label Printer Calibration & Scale Verification Sheet
          </span>
        </div>
        <p className="text-xs text-gray-700 mt-1">
          Measure the two test rulers below using a physical desk ruler. Each ruler should measure <strong>EXACTLY 100 mm (10.0 cm)</strong>.
        </p>
      </div>

      {/* Horizontal Ruler (100mm) */}
      <div className="mb-8 p-4 border border-gray-400 bg-gray-50/50">
        <div className="text-xs font-bold mb-2">
          1. Horizontal Calibration Ruler (Must measure exactly 100.0 mm from 0 to 100):
        </div>
        <div
          style={{ width: '100mm', height: '24px' }}
          className="relative border-b-2 border-black"
        >
          {/* Ticks every 10mm */}
          {Array.from({ length: 11 }).map((_, i) => (
            <div
              key={i}
              style={{ left: `${i * 10}mm` }}
              className="absolute bottom-0 w-[1px] bg-black"
            >
              <div
                style={{ height: i % 5 === 0 ? '16px' : '8px' }}
                className="w-[1px] bg-black"
              />
              <span
                style={{ fontSize: '8px' }}
                className="absolute -top-3.5 -left-1 font-mono font-bold"
              >
                {i * 10}
              </span>
            </div>
          ))}
        </div>
        <div className="text-[10px] text-gray-600 mt-3">
          If measured length &lt; 100mm: Your printer has "Fit to page" enabled. Change Scale to 100%.
        </div>
      </div>

      {/* Vertical Ruler (100mm) */}
      <div className="mb-8 p-4 border border-gray-400 bg-gray-50/50">
        <div className="text-xs font-bold mb-2">
          2. Vertical Calibration Ruler (Must measure exactly 100.0 mm vertically from 0 to 100):
        </div>
        <div
          style={{ height: '100mm', width: '60px' }}
          className="relative border-r-2 border-black ml-4"
        >
          {Array.from({ length: 11 }).map((_, i) => (
            <div
              key={i}
              style={{ top: `${i * 10}mm` }}
              className="absolute right-0 h-[1px] bg-black flex items-center justify-end"
            >
              <span
                style={{ fontSize: '8px' }}
                className="mr-1.5 font-mono font-bold"
              >
                {i * 10}mm
              </span>
              <div
                style={{ width: i % 5 === 0 ? '16px' : '8px' }}
                className="h-[1px] bg-black"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Guidelines Checklist */}
      <div className="p-4 border border-gray-300 rounded text-xs space-y-1.5 bg-gray-50">
        <div className="font-bold uppercase text-gray-800">Print Settings Checklist:</div>
        <div>[ ] Paper Size: A4 (210 x 297 mm)</div>
        <div>[ ] Margins: None (or Minimum)</div>
        <div>[ ] Scale: 100% (or "Actual size", NEVER "Fit to page")</div>
        <div>[ ] Duplex: 1-sided (do not print labels double-sided)</div>
      </div>
    </div>
  );
};
