# NHS A4 Label Print Studio

An NHS-styled web application for printing onto various pre-cut A4 label paper sheets (e.g. 21 labels 63.5 × 38.1 mm, 24 labels, 14 labels, 65 mini labels, or custom mm dimensions). 

Built for clinical and administrative staff with zero technical barrier to entry. Runs 100% client-side in any modern web browser tab.

---

## Key Features

1. **Preset & Custom A4 Sheet Geometry**:
   - **Popular NHS 21-Label Sheet (3 × 7)**: 63.5 × 38.1 mm (Avery L7160 / J8160).
   - Additional standard templates: 24 labels (63.5 × 33.9 mm), 14 labels (99.1 × 38.1 mm), 16 labels, 18 labels, 65 mini vials labels, 8 shipping labels, etc.
   - **Custom Millimetre Inputs**: Enter exact label width, height, columns, rows, page margins, gaps, and corner radiuses.
   - Real-time A4 boundary validation (210 × 297 mm).
   - Hardware printer alignment offset adjustment (fine-tune horizontal/vertical ± mm if your printer pulls sheets off-center).

2. **Dual Content Generation Modes**:
   - **Single Repeating Label**: Enter your text once to instantly populate all labels on the A4 sheet (with quick NHS templates for outpatient appointments, pathology specimens, clinic return addresses, and pharmacy alerts).
   - **Spreadsheet Upload / Mail Merge**:
     - Upload `.xlsx`, `.xls`, or `.csv` files.
     - Clickable column pills (e.g., `+{First Name}`, `+{Last Name}`, `+{Address Line 1}`, `+{Postcode}`) to assemble your label template.
     - Includes 1-click **"Load Sample NHS Patient Data"** and downloadable Excel/CSV sample templates.
     - Automatically handles multi-sheet pagination for large address lists.

3. **Reuse Partially Peeled Sheets (Zero Paper Waste)**:
   - Select starting label position (e.g., skip first 3 peeled labels on Sheet 1).
   - Click any label cell on the interactive preview to toggle it on or off.

4. **100% Accurate Printing in Modern Browsers**:
   - Dedicated `@page { size: 210mm 297mm; margin: 0; }` styling.
   - Built-in **100 mm Calibration Sheet** and printer settings guide (Paper: A4, Margins: None, Scale: 100%).

---

## Deploy to Vercel / GitHub

This app is 100% static and requires no database or backend server.

### Deploying to Vercel
1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import this repository.
4. Framework Preset will auto-detect as **Vite**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **Deploy**. Your app will be live at `https://your-project.vercel.app`.

### Local Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
