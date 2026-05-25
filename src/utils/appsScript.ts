export const APPS_SCRIPT_CODE = `// ============================================================
//  TzviAir Form — Google Apps Script
//  Paste this entire file into script.google.com
//  then deploy as a Web App (see setup guide below)
// ============================================================

// Human-readable column headers.
// If you add questions in the admin panel, add their IDs here too.
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
    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Submissions') || ss.insertSheet('Submissions');
    var data  = JSON.parse(e.postData.contents);

    // ── Build or read header row ────────────────────────────
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

      // Write header labels
      sheet.appendRow(headers.map(getLabel));

      // Style header row
      var hRange = sheet.getRange(1, 1, 1, headers.length);
      hRange.setFontWeight('bold');
      hRange.setBackground('#1C2D55');
      hRange.setFontColor('#FFFFFF');
      hRange.setHorizontalAlignment('center');
      sheet.setFrozenRows(1);

    } else {
      // Read existing header labels back as keys via reverse lookup
      var labelRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var reverseMap = {};
      Object.keys(LABELS).forEach(function(k) { reverseMap[LABELS[k]] = k; });
      headers = labelRow.map(function(lbl) { return reverseMap[lbl] || lbl; });
    }

    // ── Add any new dynamic columns not yet in the sheet ───
    Object.keys(data).forEach(function(key) {
      if (headers.indexOf(key) === -1) {
        headers.push(key);
        var col  = headers.length;
        var cell = sheet.getRange(1, col);
        cell.setValue(getLabel(key))
            .setFontWeight('bold')
            .setBackground('#44B3E1')
            .setFontColor('#FFFFFF');
      }
    });

    // ── Append data row ──────────────────────────────────────
    var row = headers.map(function(h) {
      return data.hasOwnProperty(h) ? data[h] : '';
    });
    sheet.appendRow(row);

    // Auto-resize every 20 rows to keep things tidy
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

// Quick health-check — visit the /exec URL in a browser to confirm it's live
function doGet() {
  return ContentService
    .createTextOutput('TzviAir Form endpoint is active ✓')
    .setMimeType(ContentService.MimeType.TEXT);
}`;
