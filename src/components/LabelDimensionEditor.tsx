import React, { useState, useEffect } from 'react';
import { LabelDimensions, PrinterCalibration } from '../types';
import {
  getSavedTemplates,
  saveTemplateToStorage,
  deleteTemplateFromStorage,
  DEFAULT_LABEL_DIMENSIONS,
} from '../constants/presets';
import {
  Sliders,
  Check,
  AlertTriangle,
  ArrowRight,
  BookmarkPlus,
  Trash2,
  BookmarkCheck,
  FolderOpen,
  Plus,
  Upload,
  Download,
  Info,
} from 'lucide-react';

interface LabelDimensionEditorProps {
  dimensions: LabelDimensions;
  setDimensions: (dims: LabelDimensions) => void;
  calibration: PrinterCalibration;
  setCalibration: (cal: PrinterCalibration) => void;
  onProceed: () => void;
}

export const LabelDimensionEditor: React.FC<LabelDimensionEditorProps> = ({
  dimensions,
  setDimensions,
  calibration,
  setCalibration,
  onProceed,
}) => {
  const [savedTemplates, setSavedTemplates] = useState<LabelDimensions[]>([]);
  const [isSavingModalOpen, setIsSavingModalOpen] = useState<boolean>(false);
  const [templateNameInput, setTemplateNameInput] = useState<string>('');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Load custom templates from localStorage on mount
  useEffect(() => {
    const loaded = getSavedTemplates();
    setSavedTemplates(loaded);
  }, []);

  // Calculate total footprint on A4 (210 x 297 mm)
  const totalWidthUsed =
    dimensions.leftMargin +
    dimensions.cols * dimensions.labelWidth +
    Math.max(0, dimensions.cols - 1) * dimensions.colGap;

  const totalHeightUsed =
    dimensions.topMargin +
    dimensions.rows * dimensions.labelHeight +
    Math.max(0, dimensions.rows - 1) * dimensions.rowGap;

  const widthFits = totalWidthUsed <= 210.5;
  const heightFits = totalHeightUsed <= 297.5;
  const totalLabelsPerSheet = dimensions.cols * dimensions.rows;

  const handleCustomChange = (field: keyof LabelDimensions, value: number) => {
    setDimensions({
      ...dimensions,
      [field]: Math.max(0, Number(value) || 0),
    });
  };

  const openSaveModal = () => {
    const suggestedName =
      dimensions.name && dimensions.name !== 'Custom Dimensions'
        ? dimensions.name
        : `${totalLabelsPerSheet} Labels (${dimensions.labelWidth} × ${dimensions.labelHeight} mm)`;
    setTemplateNameInput(suggestedName);
    setIsSavingModalOpen(true);
    setSaveSuccessMessage(null);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = templateNameInput.trim();
    if (!trimmedName) return;

    const newTemplate: LabelDimensions = {
      ...dimensions,
      id: `tmpl-${Date.now()}`,
      name: trimmedName,
      description: `${dimensions.labelWidth} × ${dimensions.labelHeight} mm · ${dimensions.cols} cols × ${dimensions.rows} rows`,
      category: 'Custom',
    };

    const updated = saveTemplateToStorage(newTemplate);
    setSavedTemplates(updated);
    setDimensions(newTemplate);
    setIsSavingModalOpen(false);
    setSaveSuccessMessage(`Template "${trimmedName}" saved successfully!`);
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  const handleLoadTemplate = (template: LabelDimensions) => {
    setDimensions({ ...template });
    setSaveSuccessMessage(`Loaded template "${template.name}".`);
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  const handleDeleteTemplate = (id: string, name: string) => {
    if (window.confirm(`Delete saved template "${name}"?`)) {
      const updated = deleteTemplateFromStorage(id);
      setSavedTemplates(updated);
    }
  };

  // Export templates as JSON
  const handleExportTemplates = () => {
    if (savedTemplates.length === 0) {
      alert('You have no saved templates to export yet.');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedTemplates, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'NHS_Label_Custom_Templates.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import templates from JSON
  const handleImportTemplates = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          let updated = [...savedTemplates];
          parsed.forEach((t) => {
            if (t.cols && t.rows && t.labelWidth && t.labelHeight) {
              const item: LabelDimensions = {
                ...t,
                id: t.id || `tmpl-${Date.now()}-${Math.random()}`,
              };
              updated = [item, ...updated.filter((x) => x.name !== item.name)];
            }
          });
          localStorage.setItem('nhs_custom_label_templates_v1', JSON.stringify(updated));
          setSavedTemplates(updated);
          setSaveSuccessMessage(`Imported ${parsed.length} template(s) successfully!`);
          setTimeout(() => setSaveSuccessMessage(null), 4000);
        } else {
          alert('Invalid template file format.');
        }
      } catch (err) {
        alert('Failed to parse template JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Success Notification Banner */}
      {saveSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessMessage}</span>
          </div>
          <button
            onClick={() => setSaveSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Exact Millimetre Dimension Editor Section */}
      <div className="bg-white p-6 rounded-lg border border-[#d8dde0] shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d8dde0] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#212b32] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#005eb8]" />
              Label Dimensions
            </h2>
            <p className="text-xs text-[#4c6272] mt-0.5">
              Enter the exact size of your labels on the A4 sheet. You can save your dimensions as custom templates below.
            </p>
          </div>

          {/* Prominent Save as Template Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={openSaveModal}
              className="flex items-center gap-2 px-4 py-2 bg-[#005eb8] hover:bg-[#004b93] active:bg-[#003b73] text-white text-xs font-bold rounded-md shadow-xs transition-colors"
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>Save as Template</span>
            </button>
          </div>
        </div>

        {/* Dimension Input Fields */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#212b32] mb-1">
              Columns across
            </label>
            <input
              type="number"
              min="1"
              max="15"
              value={dimensions.cols}
              onChange={(e) => handleCustomChange('cols', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 text-sm border border-[#768692] rounded bg-white font-mono focus:border-[#005eb8] focus:ring-1 focus:ring-[#005eb8] outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#212b32] mb-1">
              Rows down
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={dimensions.rows}
              onChange={(e) => handleCustomChange('rows', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 text-sm border border-[#768692] rounded bg-white font-mono focus:border-[#005eb8] focus:ring-1 focus:ring-[#005eb8] outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#212b32] mb-1">
              Label Width (mm)
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="210"
              value={dimensions.labelWidth}
              onChange={(e) => handleCustomChange('labelWidth', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-[#768692] rounded bg-white font-mono focus:border-[#005eb8] focus:ring-1 focus:ring-[#005eb8] outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#212b32] mb-1">
              Label Height (mm)
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="297"
              value={dimensions.labelHeight}
              onChange={(e) => handleCustomChange('labelHeight', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-[#768692] rounded bg-white font-mono focus:border-[#005eb8] focus:ring-1 focus:ring-[#005eb8] outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#212b32] mb-1">
              Top Margin (mm)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="150"
              value={dimensions.topMargin}
              onChange={(e) => handleCustomChange('topMargin', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-[#768692] rounded bg-white font-mono focus:border-[#005eb8] focus:ring-1 focus:ring-[#005eb8] outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#212b32] mb-1">
              Left Margin (mm)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="150"
              value={dimensions.leftMargin}
              onChange={(e) => handleCustomChange('leftMargin', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-[#768692] rounded bg-white font-mono focus:border-[#005eb8] focus:ring-1 focus:ring-[#005eb8] outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#212b32] mb-1">
              Column Gap (mm)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="50"
              value={dimensions.colGap}
              onChange={(e) => handleCustomChange('colGap', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-[#768692] rounded bg-white font-mono focus:border-[#005eb8] focus:ring-1 focus:ring-[#005eb8] outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#212b32] mb-1">
              Row Gap (mm)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="50"
              value={dimensions.rowGap}
              onChange={(e) => handleCustomChange('rowGap', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-[#768692] rounded bg-white font-mono focus:border-[#005eb8] focus:ring-1 focus:ring-[#005eb8] outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#212b32] mb-1">
              Corner Radius (mm)
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="10"
              value={dimensions.cornerRadius}
              onChange={(e) => handleCustomChange('cornerRadius', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm border border-[#768692] rounded bg-white font-mono focus:border-[#005eb8] focus:ring-1 focus:ring-[#005eb8] outline-hidden"
            />
          </div>

          {/* Layout Validation Check */}
          <div className="col-span-2 sm:col-span-3 flex items-end">
            <div
              className={`w-full p-2.5 rounded text-xs flex items-center gap-2 ${
                widthFits && heightFits
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {widthFits && heightFits ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Valid A4 Sheet: <strong>{totalLabelsPerSheet} labels</strong> ({dimensions.cols} cols × {dimensions.rows} rows).
                    Sheet footprint: {totalWidthUsed.toFixed(1)} × {totalHeightUsed.toFixed(1)} mm.
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Exceeds standard A4 (210 × 297 mm)! Current total: {totalWidthUsed.toFixed(1)} × {totalHeightUsed.toFixed(1)} mm.
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User's Custom Saved Templates Section */}
      <div className="bg-white p-6 rounded-lg border border-[#d8dde0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d8dde0] pb-3">
          <div>
            <h3 className="text-sm font-bold text-[#212b32] uppercase tracking-wide flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-[#005eb8]" />
              My Saved Templates ({savedTemplates.length})
            </h3>
            <p className="text-xs text-[#4c6272]">
              Templates you have saved on this device. Click any template to apply its dimensions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {savedTemplates.length > 0 && (
              <button
                type="button"
                onClick={handleExportTemplates}
                className="px-2.5 py-1 text-xs text-[#4c6272] hover:text-[#005eb8] border border-[#d8dde0] hover:border-[#005eb8] rounded flex items-center gap-1 font-medium transition-colors"
                title="Export your templates as a JSON backup"
              >
                <Download className="w-3 h-3" />
                <span>Export</span>
              </button>
            )}

            <label
              className="px-2.5 py-1 text-xs text-[#4c6272] hover:text-[#005eb8] border border-[#d8dde0] hover:border-[#005eb8] rounded flex items-center gap-1 font-medium transition-colors cursor-pointer"
              title="Import templates from a JSON file"
            >
              <Upload className="w-3 h-3" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportTemplates}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {savedTemplates.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-[#d8dde0] rounded-lg bg-[#f0f4f5]/50">
            <BookmarkPlus className="w-8 h-8 text-[#768692] mx-auto mb-2 opacity-60" />
            <p className="text-xs font-semibold text-[#212b32]">
              No custom templates saved yet
            </p>
            <p className="text-xs text-[#4c6272] max-w-md mx-auto mt-1">
              Configure your label width, height, columns, and rows above, then click <strong>"Save as Template"</strong> to keep it saved for fast access anytime.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedTemplates.map((template) => {
              const isCurrentlyActive =
                dimensions.cols === template.cols &&
                dimensions.rows === template.rows &&
                dimensions.labelWidth === template.labelWidth &&
                dimensions.labelHeight === template.labelHeight &&
                dimensions.leftMargin === template.leftMargin &&
                dimensions.topMargin === template.topMargin;

              return (
                <div
                  key={template.id}
                  className={`p-3.5 rounded-lg border-2 transition-all flex flex-col justify-between ${
                    isCurrentlyActive
                      ? 'border-[#005eb8] bg-blue-50/40 ring-1 ring-[#005eb8]'
                      : 'border-[#d8dde0] hover:border-[#005eb8]/60 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => handleLoadTemplate(template)}
                      className="text-left flex-1 group"
                    >
                      <span className="text-xs font-bold text-[#212b32] group-hover:text-[#005eb8] block transition-colors">
                        {template.name}
                      </span>
                      <span className="text-[11px] text-[#4c6272] block mt-0.5">
                        {template.labelWidth} × {template.labelHeight} mm ({template.cols * template.rows} labels, {template.cols}×{template.rows})
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteTemplate(template.id, template.name)}
                      className="text-[#768692] hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Delete this saved template"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-[#d8dde0]/60 flex items-center justify-between text-[11px]">
                    <span className="text-[#4c6272]">
                      Margins: T:{template.topMargin} L:{template.leftMargin} mm
                    </span>

                    <button
                      type="button"
                      onClick={() => handleLoadTemplate(template)}
                      className={`font-bold px-2 py-0.5 rounded text-[11px] transition-colors ${
                        isCurrentlyActive
                          ? 'bg-[#005eb8] text-white'
                          : 'text-[#005eb8] hover:bg-blue-50'
                      }`}
                    >
                      {isCurrentlyActive ? 'Active' : 'Apply'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>


      {/* Save Template Modal */}
      {isSavingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-[#d8dde0] overflow-hidden">
            <div className="bg-[#005eb8] text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <BookmarkPlus className="w-4 h-4" />
                Save Custom Label Template
              </h3>
              <button
                type="button"
                onClick={() => setIsSavingModalOpen(false)}
                className="text-white/80 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#212b32] mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. 21 Labels (63.5 x 38.1 mm), Sample Tubes, etc."
                  value={templateNameInput}
                  onChange={(e) => setTemplateNameInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#768692] rounded bg-white text-[#212b32] focus:border-[#005eb8] focus:ring-1 focus:ring-[#005eb8] outline-hidden"
                />
              </div>

              <div className="p-3 bg-[#f0f4f5] rounded text-xs text-[#4c6272] space-y-1">
                <div className="font-bold text-[#212b32]">Dimensions being saved:</div>
                <div>Size: {dimensions.labelWidth} × {dimensions.labelHeight} mm</div>
                <div>Grid: {dimensions.cols} columns × {dimensions.rows} rows ({totalLabelsPerSheet} labels/sheet)</div>
                <div>Margins: Top {dimensions.topMargin}mm, Left {dimensions.leftMargin}mm</div>
                <div>Gaps: Col {dimensions.colGap}mm, Row {dimensions.rowGap}mm</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSavingModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#4c6272] hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#005eb8] hover:bg-[#004b93] rounded shadow-xs"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-[#4c6272]">
          Step 1 of 3: Sheet Geometry Configured
        </div>
        <button
          type="button"
          onClick={onProceed}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#005eb8] hover:bg-[#004b93] text-white text-sm font-bold rounded-md shadow-xs transition-colors"
        >
          <span>Continue to Label Content</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
