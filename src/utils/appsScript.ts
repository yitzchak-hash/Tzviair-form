export const APPS_SCRIPT_CODE = `// ============================================================
//  TzviAir Form — Google Apps Script
// ============================================================
//
//  HOW TO CONNECT THIS TO YOUR GOOGLE SHEET
//  -----------------------------------------
//  OPTION A — Recommended (bound script):
//    1. Open your Google Sheet in Drive
//    2. Click Extensions → Apps Script
//    3. Delete any existing code, paste this entire file
//    4. The sheet is connected automatically — no ID needed
//
//  OPTION B — Standalone script (script.google.com):
//    1. Create a new project at script.google.com
//    2. Paste this file, then find the line below marked ★
//    3. Replace getActiveSpreadsheet() with openById(...)
//       and paste your Sheet ID (from the URL of your sheet)
//
//  Either way, after pasting:
//    Deploy → New deployment → Web App
//    Execute as: Me
//    Who has access: Anyone
//    → Copy the /exec URL → paste it in the TzviAir admin panel
//
// ============================================================

// ── STEP 1: Connect to your spreadsheet ─────────────────────
//
//  ★ OPTION A (Extensions → Apps Script inside your sheet):
var ss = SpreadsheetApp.getActiveSpreadsheet();
//
//  ★ OPTION B (standalone at script.google.com) — comment out
//  the line above and uncomment + fill in the line below:
//
//  var ss = SpreadsheetApp.openById('PASTE_YOUR_SPREADSHEET_ID_HERE');
//
//  Find your Sheet ID in the URL:
//  https://docs.google.com/spreadsheets/d/ ► ID IS HERE ◄ /edit
//
// ────────────────────────────────────────────────────────────


// Human-readable column headers shown in the sheet.
// Add any new question IDs you create in the admin panel here too.
var LABELS = {
  timestamp:             'Timestamp',
  language:              'Language',
  fullName:              'Full Name',
  phone:                 'Phone Number',
  previousAcCompany:     'Previous AC Company',
  yearsInBusiness:       'Years in Business',
  previousAcExperience:  'Previous AC Experience',
  socialFollowed:        'Social Followed'
};

// Preferred column order (extra/dynamic fields appear after these)
var PREFERRED_ORDER = [
  'timestamp', 'language',
  'fullName', 'phone', 'previousAcCompany',
  'yearsInBusiness', 'previousAcExperience',
  'socialFollowed'
];

function getLabel(key) {
  return LABELS[key] || key;
}

function doPost(e) {
  try {
    var sheet = ss.getSheetByName('Submissions') || ss.insertSheet('Submissions');
    var data  = JSON.parse(e.postData.contents);

    // ── Build or read header row ─────────────────────────────
    var headers;
    if (sheet.getLastRow() === 0) {
      // First ever submission — create headers in preferred order
      var dataKeys = Object.keys(data);
      headers = PREFERRED_ORDER.filter(function(k) {
        return dataKeys.indexOf(k) !== -1;
      });
      dataKeys.forEach(function(k) {
        if (headers.indexOf(k) === -1) headers.push(k);
      });

      sheet.appendRow(headers.map(getLabel));

      // Style header row (navy background)
      var hRange = sheet.getRange(1, 1, 1, headers.length);
      hRange.setFontWeight('bold');
      hRange.setBackground('#1C2D55');
      hRange.setFontColor('#FFFFFF');
      hRange.setHorizontalAlignment('center');
      sheet.setFrozenRows(1);

    } else {
      // Read existing headers back and reverse-map labels → IDs
      var labelRow   = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var reverseMap = {};
      Object.keys(LABELS).forEach(function(k) { reverseMap[LABELS[k]] = k; });
      headers = labelRow.map(function(lbl) { return reverseMap[lbl] || lbl; });
    }

    // ── Add any new dynamic columns not yet in the sheet ────
    Object.keys(data).forEach(function(key) {
      if (headers.indexOf(key) === -1) {
        headers.push(key);
        var cell = sheet.getRange(1, headers.length);
        cell.setValue(getLabel(key))
            .setFontWeight('bold')
            .setBackground('#44B3E1')   // cyan for new dynamic columns
            .setFontColor('#FFFFFF');
      }
    });

    // ── Append the data row ──────────────────────────────────
    var row = headers.map(function(h) {
      return data.hasOwnProperty(h) ? data[h] : '';
    });
    sheet.appendRow(row);

    // Auto-resize columns every 20 rows
    if (sheet.getLastRow() % 20 === 0) {
      sheet.autoResizeColumns(1, headers.length);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', row: sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Health-check: open the /exec URL in a browser to confirm it's live
function doGet() {
  return ContentService
    .createTextOutput('TzviAir Form endpoint is active ✓')
    .setMimeType(ContentService.MimeType.TEXT);
}`;
