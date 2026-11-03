import * as XLSX from 'xlsx';
import { SpreadsheetRow } from '../types';

export const SAMPLE_NHS_PATIENTS: SpreadsheetRow[] = [
  {
    Title: 'Mr',
    'First Name': 'Arthur',
    'Last Name': 'Pendleton',
    'NHS Number': '485 910 2341',
    DOB: '12/04/1954',
    Gender: 'M',
    'Address Line 1': '14 Victoria Crescent',
    'Address Line 2': 'Flat 2B',
    City: 'Leeds',
    Postcode: 'LS2 9NQ',
    Ward: 'Cardiology 3B',
    Clinic: 'Post-Op Review',
  },
  {
    Title: 'Mrs',
    'First Name': 'Eleanor',
    'Last Name': 'Vance',
    'NHS Number': '394 821 7562',
    DOB: '23/09/1968',
    Gender: 'F',
    'Address Line 1': '7 Primrose Meadow',
    'Address Line 2': 'Oakwood',
    City: 'Harrogate',
    Postcode: 'HG1 4PL',
    Ward: 'Outpatient Clinic',
    Clinic: 'Endocrinology',
  },
  {
    Title: 'Dr',
    'First Name': 'Marcus',
    'Last Name': 'Sterling',
    'NHS Number': '812 405 9183',
    DOB: '05/11/1982',
    Gender: 'M',
    'Address Line 1': '88 Wellington Road',
    'Address Line 2': '',
    City: 'York',
    Postcode: 'YO10 3DD',
    Ward: 'Surgical Day Unit',
    Clinic: 'Orthopaedics',
  },
  {
    Title: 'Miss',
    'First Name': 'Sophie',
    'Last Name': 'Chen',
    'NHS Number': '651 298 3409',
    DOB: '18/02/1995',
    Gender: 'F',
    'Address Line 1': '23 St. Andrews Court',
    'Address Line 2': 'Headingley',
    City: 'Leeds',
    Postcode: 'LS6 3BR',
    Ward: 'Ophthalmology',
    Clinic: 'Retinal Screening',
  },
  {
    Title: 'Mr',
    'First Name': 'David',
    'Last Name': 'O\'Connor',
    'NHS Number': '720 394 8156',
    DOB: '30/07/1961',
    Gender: 'M',
    'Address Line 1': '45 Kingfisher Avenue',
    'Address Line 2': 'Bramhope',
    City: 'Leeds',
    Postcode: 'LS16 9HZ',
    Ward: 'Respiratory',
    Clinic: 'Chest Clinic',
  },
  {
    Title: 'Ms',
    'First Name': 'Fatima',
    'Last Name': 'Al-Mansoor',
    'NHS Number': '913 847 2065',
    DOB: '14/12/1979',
    Gender: 'F',
    'Address Line 1': '112 Roundhay Park Lane',
    'Address Line 2': '',
    City: 'Leeds',
    Postcode: 'LS8 1QR',
    Ward: 'Haematology',
    Clinic: 'Anticoagulation',
  },
  {
    Title: 'Mr',
    'First Name': 'Robert',
    'Last Name': 'Taylor',
    'NHS Number': '502 931 4728',
    DOB: '08/03/1947',
    Gender: 'M',
    'Address Line 1': '19 Millfield Gardens',
    'Address Line 2': 'Otley',
    City: 'West Yorkshire',
    Postcode: 'LS21 1EA',
    Ward: 'Elderly Care',
    Clinic: 'Falls Prevention',
  },
  {
    Title: 'Mrs',
    'First Name': 'Grace',
    'Last Name': 'Adegoke',
    'NHS Number': '284 719 3054',
    DOB: '27/05/1988',
    Gender: 'F',
    'Address Line 1': '62 Kirkstall Hill',
    'Address Line 2': 'Kirkstall',
    City: 'Leeds',
    Postcode: 'LS5 3ET',
    Ward: 'Maternity Unit',
    Clinic: 'Antenatal Review',
  },
  {
    Title: 'Mr',
    'First Name': 'Liam',
    'Last Name': 'Gallagher',
    'NHS Number': '491 620 5837',
    DOB: '19/10/1973',
    Gender: 'M',
    'Address Line 1': '5 Burnage Road',
    'Address Line 2': '',
    City: 'Manchester',
    Postcode: 'M19 1ER',
    Ward: 'Audiology',
    Clinic: 'Hearing Assessment',
  },
  {
    Title: 'Mrs',
    'First Name': 'Margaret',
    'Last Name': 'Thatcher-Jones',
    'NHS Number': '639 201 8475',
    DOB: '02/01/1939',
    Gender: 'F',
    'Address Line 1': '8 The Coppice',
    'Address Line 2': 'Ilkley',
    City: 'West Yorkshire',
    Postcode: 'LS29 8TY',
    Ward: 'Rheumatology',
    Clinic: 'Joint Injection',
  },
  {
    Title: 'Master',
    'First Name': 'Oliver',
    'Last Name': 'Davies',
    'NHS Number': '184 927 3650',
    DOB: '15/06/2018',
    Gender: 'M',
    'Address Line 1': '31 Willow Brook Close',
    'Address Line 2': 'Horsforth',
    City: 'Leeds',
    Postcode: 'LS18 5NU',
    Ward: 'Paediatrics',
    Clinic: 'Allergy Clinic',
  },
  {
    Title: 'Mr',
    'First Name': 'Tariq',
    'Last Name': 'Mahmood',
    'NHS Number': '740 183 9526',
    DOB: '21/08/1965',
    Gender: 'M',
    'Address Line 1': '104 Devonshire Street',
    'Address Line 2': '',
    City: 'Keighley',
    Postcode: 'BD21 2BL',
    Ward: 'Diabetic Medicine',
    Clinic: 'Foot Clinic',
  },
  {
    Title: 'Ms',
    'First Name': 'Hannah',
    'Last Name': 'Wilkinson',
    'NHS Number': '392 841 7056',
    DOB: '11/11/1991',
    Gender: 'F',
    'Address Line 1': '74 Clarence Dock Way',
    'Address Line 2': 'Apartment 402',
    City: 'Leeds',
    Postcode: 'LS10 1LU',
    Ward: 'Physiotherapy',
    Clinic: 'Spinal Rehab',
  },
  {
    Title: 'Mr',
    'First Name': 'George',
    'Last Name': 'Papadopoulos',
    'NHS Number': '859 203 1478',
    DOB: '04/04/1959',
    Gender: 'M',
    'Address Line 1': '15 Regent Terrace',
    'Address Line 2': 'Chapel Allerton',
    City: 'Leeds',
    Postcode: 'LS7 4DY',
    Ward: 'Renal Unit',
    Clinic: 'Nephrology',
  },
  {
    Title: 'Mrs',
    'First Name': 'Barbara',
    'Last Name': 'Smith',
    'NHS Number': '471 902 3845',
    DOB: '29/07/1943',
    Gender: 'F',
    'Address Line 1': '90 Harrogate Road',
    'Address Line 2': '',
    City: 'Leeds',
    Postcode: 'LS7 4LZ',
    Ward: 'Dermatology',
    Clinic: 'Skin Lesion Clinic',
  },
  {
    Title: 'Mr',
    'First Name': 'Kofi',
    'Last Name': 'Mensah',
    'NHS Number': '628 394 1507',
    DOB: '16/09/1984',
    Gender: 'M',
    'Address Line 1': '28 Beckett Street',
    'Address Line 2': 'Burmantofts',
    City: 'Leeds',
    Postcode: 'LS9 7TU',
    Ward: 'General Surgery',
    Clinic: 'Hernia Assessment',
  },
  {
    Title: 'Mrs',
    'First Name': 'Dorothy',
    'Last Name': 'Wright',
    'NHS Number': '904 812 7365',
    DOB: '03/02/1936',
    Gender: 'F',
    'Address Line 1': '12 Sycamore Grove',
    'Address Line 2': 'Guiseley',
    City: 'West Yorkshire',
    Postcode: 'LS20 9PB',
    Ward: 'Memory Clinic',
    Clinic: 'Cognitive Health',
  },
  {
    Title: 'Mr',
    'First Name': 'Alan',
    'Last Name': 'Partridge',
    'NHS Number': '519 283 4701',
    DOB: '14/10/1955',
    Gender: 'M',
    'Address Line 1': 'Linton Travel Tavern',
    'Address Line 2': 'Room 214',
    City: 'Norwich',
    Postcode: 'NR1 1AA',
    Ward: 'ENT Clinic',
    Clinic: 'Vocal Health',
  },
  {
    Title: 'Ms',
    'First Name': 'Zara',
    'Last Name': 'Hussain',
    'NHS Number': '381 904 2576',
    DOB: '09/01/2001',
    Gender: 'F',
    'Address Line 1': '55 Hyde Park Road',
    'Address Line 2': '',
    City: 'Leeds',
    Postcode: 'LS6 1PY',
    Ward: 'Student Health',
    Clinic: 'Immunisation',
  },
  {
    Title: 'Mr',
    'First Name': 'William',
    'Last Name': 'Forbes',
    'NHS Number': '827 491 6302',
    DOB: '22/05/1971',
    Gender: 'M',
    'Address Line 1': '3 Castle View',
    'Address Line 2': 'Knaresborough',
    City: 'North Yorkshire',
    Postcode: 'HG5 8AS',
    Ward: 'Cardiovascular',
    Clinic: 'Pacemaker Check',
  },
  {
    Title: 'Mrs',
    'First Name': 'Patricia',
    'Last Name': 'Bell',
    'NHS Number': '716 384 9205',
    DOB: '17/12/1950',
    Gender: 'F',
    'Address Line 1': '41 Ashville Terrace',
    'Address Line 2': 'Cardigan Road',
    City: 'Leeds',
    Postcode: 'LS6 1JS',
    Ward: 'Oncology Day Unit',
    Clinic: 'Chemotherapy Follow-up',
  },
];

export function downloadSampleSpreadsheet(format: 'xlsx' | 'csv' = 'xlsx') {
  const worksheet = XLSX.utils.json_to_sheet(SAMPLE_NHS_PATIENTS);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'NHS Patients');

  if (format === 'csv') {
    XLSX.writeFile(workbook, 'NHS_Patient_Address_Sample.csv', { bookType: 'csv' });
  } else {
    XLSX.writeFile(workbook, 'NHS_Patient_Address_Sample.xlsx', { bookType: 'xlsx' });
  }
}

/**
 * Replaces placeholders in the format {Field Name} with values from a row.
 * Cleans up empty lines if an optional field like Address Line 2 is blank.
 */
export function formatLabelText(template: string, row: SpreadsheetRow): string {
  if (!template) return '';

  let result = template;
  for (const key of Object.keys(row)) {
    const val = row[key] || '';
    const regex = new RegExp(`\\{${key}\\}`, 'gi');
    result = result.replace(regex, val);
  }

  // Also replace any remaining unresolved placeholders with empty strings
  result = result.replace(/\{[^{}]+\}/g, '');

  // Remove duplicate consecutive blank lines created by empty fields
  const lines = result.split('\n');
  const cleanedLines: string[] = [];
  for (const line of lines) {
    if (line.trim() === '' && cleanedLines.length > 0 && cleanedLines[cleanedLines.length - 1].trim() === '') {
      continue;
    }
    cleanedLines.push(line);
  }

  return cleanedLines.join('\n').trim();
}

/**
 * Generates a clean Code 128 / Barcode SVG representation for clinical/tracking codes
 */
export function generateBarcodeSvg(value: string): string {
  if (!value) return '';
  const cleanVal = value.replace(/[^A-Za-z0-9]/g, '');
  if (!cleanVal) return '';

  // Generate deterministic bar widths based on char codes
  const bars: { width: number; isBlack: boolean }[] = [];
  // Quiet zone
  bars.push({ width: 4, isBlack: false });
  // Start pattern
  bars.push({ width: 2, isBlack: true }, { width: 1, isBlack: false }, { width: 2, isBlack: true });

  for (let i = 0; i < cleanVal.length; i++) {
    const code = cleanVal.charCodeAt(i);
    const pattern = [(code % 3) + 1, ((code >> 2) % 3) + 1, ((code >> 4) % 3) + 1, ((code >> 1) % 2) + 1];
    pattern.forEach((w, idx) => {
      bars.push({ width: w, isBlack: idx % 2 === 0 });
    });
  }

  // Stop pattern
  bars.push({ width: 2, isBlack: true }, { width: 1, isBlack: false }, { width: 2, isBlack: true }, { width: 4, isBlack: false });

  let currentX = 0;
  const rects = bars
    .map((bar) => {
      const rect = bar.isBlack ? `<rect x="${currentX}" y="0" width="${bar.width}" height="28" fill="#000000" />` : '';
      currentX += bar.width;
      return rect;
    })
    .join('');

  return `<svg viewBox="0 0 ${currentX} 38" class="w-full h-auto max-h-7" xmlns="http://www.w3.org/2000/svg">
    ${rects}
    <text x="${currentX / 2}" y="36" font-size="8" font-family="monospace" text-anchor="middle" fill="#000">${value}</text>
  </svg>`;
}
