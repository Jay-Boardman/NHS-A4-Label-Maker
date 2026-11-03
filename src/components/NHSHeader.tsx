import React from 'react';
import { Printer, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';

interface NHSHeaderProps {
  totalSheets: number;
  totalLabels: number;
  onPrint: () => void;
  onOpenCalibration: () => void;
  activeTab: 'setup' | 'content' | 'preview';
  setActiveTab: (tab: 'setup' | 'content' | 'preview') => void;
  contentMode: 'repeat' | 'spreadsheet';
}

export const NHSHeader: React.FC<NHSHeaderProps> = ({
  totalSheets,
  totalLabels,
  onPrint,
  onOpenCalibration,
  activeTab,
  setActiveTab,
  contentMode,
}) => {
  return (
    <header className="bg-white border-b border-[#d8dde0] sticky top-0 z-40 shadow-xs">
      {/* Top NHS Blue Brand Bar */}
      <div className="bg-[#005eb8] text-white px-4 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Authentic NHS Lozenge Logo */}
            <div className="bg-white text-[#005eb8] font-black italic px-2.5 py-0.5 text-lg tracking-tighter select-none rounded-xs shadow-xs">
              NHS
            </div>
            <div className="leading-tight">
              <span className="font-bold text-base tracking-tight block sm:inline">
                A4 Label Print Studio
              </span>
              <span className="hidden sm:inline text-blue-100 text-xs ml-2 font-normal">
                Clinical & Administrative Label Production
              </span>
            </div>
          </div>

          {/* Header Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCalibration}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#004b93] hover:bg-[#003b73] rounded-md transition-colors"
              title="Calibration tips and test print guide"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Printer Guide & Calibration</span>
              <span className="md:hidden">Guide</span>
            </button>

            <button
              onClick={onPrint}
              className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-[#007f3b] hover:bg-[#00662f] active:bg-[#004d23] rounded-md transition-all shadow-sm"
              title="Print all labels now"
            >
              <Printer className="w-4 h-4" />
              <span>Print {totalLabels} {totalLabels === 1 ? 'Label' : 'Labels'} ({totalSheets} {totalSheets === 1 ? 'Sheet' : 'Sheets'})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Workflow Tabs */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-4 border-b border-[#d8dde0]" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('setup')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'setup'
                ? 'border-[#005eb8] text-[#005eb8]'
                : 'border-transparent text-[#4c6272] hover:text-[#212b32] hover:border-[#d8dde0]'
            }`}
          >
            <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold bg-[#f0f4f5] text-[#212b32]">1</span>
            <span>1. Label Size & Sheet Setup</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'content'
                ? 'border-[#005eb8] text-[#005eb8]'
                : 'border-transparent text-[#4c6272] hover:text-[#212b32] hover:border-[#d8dde0]'
            }`}
          >
            <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold bg-[#f0f4f5] text-[#212b32]">2</span>
            <span>2. Label Content {contentMode === 'spreadsheet' ? '(Spreadsheet)' : '(Single Repeat)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'preview'
                ? 'border-[#005eb8] text-[#005eb8]'
                : 'border-transparent text-[#4c6272] hover:text-[#212b32] hover:border-[#d8dde0]'
            }`}
          >
            <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold bg-[#f0f4f5] text-[#212b32]">3</span>
            <span>3. Sheet Preview & Print</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
