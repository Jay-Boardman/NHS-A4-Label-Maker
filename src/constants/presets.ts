import { LabelDimensions } from '../types';

export const STORAGE_KEY_TEMPLATES = 'nhs_custom_label_templates_v1';

export const DEFAULT_LABEL_DIMENSIONS: LabelDimensions = {
  id: 'default-21',
  name: '21 Labels (63.5 × 38.1 mm)',
  description: '63.5 × 38.1 mm · 3 columns × 7 rows',
  cols: 3,
  rows: 7,
  labelWidth: 63.5,
  labelHeight: 38.1,
  topMargin: 15.1,
  bottomMargin: 15.1,
  leftMargin: 7.2,
  rightMargin: 7.2,
  colGap: 2.5,
  rowGap: 0,
  cornerRadius: 1.5,
};

export const DEFAULT_STYLE_SETTINGS = {
  fontFamily: 'sans' as const,
  fontSizePt: 10,
  lineHeight: 1.25,
  textAlign: 'left' as const,
  verticalAlign: 'center' as const,
  fontWeight: 'normal' as const,
  paddingMm: 2.5,
  showBorder: false,
  textColor: '#212b32',
  backgroundColor: '#ffffff',
  addNhsLogo: false,
  addBarcode: false,
  barcodeFormat: 'code128' as const,
  barcodeField: '',
};

export function getSavedTemplates(): LabelDimensions[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEMPLATES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load saved templates from localStorage', e);
    return [];
  }
}

export function saveTemplateToStorage(template: LabelDimensions): LabelDimensions[] {
  try {
    const existing = getSavedTemplates();
    const index = existing.findIndex((t) => t.id === template.id || t.name.toLowerCase() === template.name.toLowerCase());
    let updated: LabelDimensions[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = template;
    } else {
      updated = [template, ...existing];
    }
    localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save template to localStorage', e);
    return [];
  }
}

export function deleteTemplateFromStorage(id: string): LabelDimensions[] {
  try {
    const existing = getSavedTemplates();
    const updated = existing.filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete template from localStorage', e);
    return [];
  }
}
