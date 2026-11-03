export interface LabelDimensions {
  id: string;
  name: string;
  averyCode?: string;
  description?: string;
  category?: string;
  cols: number;
  rows: number;
  labelWidth: number; // in mm
  labelHeight: number; // in mm
  topMargin: number; // in mm
  bottomMargin: number; // in mm
  leftMargin: number; // in mm
  rightMargin: number; // in mm
  colGap: number; // in mm (horizontal space between labels)
  rowGap: number; // in mm (vertical space between labels)
  cornerRadius: number; // in mm
}

export type TextAlignment = 'left' | 'center' | 'right';
export type VerticalAlignment = 'top' | 'center' | 'bottom';
export type FontFamily = 'sans' | 'serif' | 'mono';
export type FontWeight = 'normal' | 'semibold' | 'bold';

export interface LabelStyleSettings {
  fontFamily: FontFamily;
  fontSizePt: number;
  lineHeight: number;
  textAlign: TextAlignment;
  verticalAlign: VerticalAlignment;
  fontWeight: FontWeight;
  paddingMm: number;
  showBorder: boolean; // For printing a visible outline
  textColor: string;
  backgroundColor: string;
  addNhsLogo: boolean;
  addBarcode: boolean;
  barcodeFormat: 'code128' | 'qrcode';
  barcodeField: string;
}

export interface PrinterCalibration {
  offsetXmm: number; // Horizontal calibration adjustment (+ right, - left)
  offsetYmm: number; // Vertical calibration adjustment (+ down, - up)
}

export type ContentMode = 'repeat' | 'spreadsheet';

export interface SpreadsheetRow {
  [key: string]: string;
}

export interface SpreadsheetState {
  fileName: string;
  headers: string[];
  rows: SpreadsheetRow[];
  template: string;
  startOffset: number; // 0-indexed position on sheet 1 (e.g. 0 = top-left, 3 = skip first 3)
}
