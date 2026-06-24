const SHEET_NAME = 'Game Submissions';
const HEADERS = [
  'Họ tên', 'Email', 'Mã lớp', 'Bắt đầu lúc', 'Hoàn thành lúc', 'Trạng thái',
  'Tổng điểm', 'Business Question', 'Data Mapping', 'Pipeline & ETL',
  'Data Warehouse', 'Data Model', 'ADO & Dashboard', 'AI Opportunity',
  'Xếp hạng', 'Số lần làm', 'Submission ID'
];

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    if (!['start', 'complete'].includes(payload.action)) {
      throw new Error('Invalid action');
    }

    const sheet = getSheet_();
    const email = String(payload.email || '').trim().toLowerCase();
    const classCode = String(payload.classCode || '').trim().toUpperCase();
    if (!email || !classCode || !payload.submissionId) {
      throw new Error('Missing required fields');
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const row = findRow_(sheet, payload.submissionId);
      const attempts = countAttempts_(sheet, email, classCode, payload.submissionId);
      const values = buildRow_(payload, attempts);
      if (row) sheet.getRange(row, 1, 1, HEADERS.length).setValues([values]);
      else sheet.appendRow(values);
    } finally {
      lock.releaseLock();
    }

    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: String(error) });
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#ccfbf1');
  }
  return sheet;
}

function findRow_(sheet, submissionId) {
  if (sheet.getLastRow() < 2) return 0;
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues();
  const index = rows.findIndex(row =>
    String(row[16]).trim() === submissionId
  );
  return index === -1 ? 0 : index + 2;
}

function countAttempts_(sheet, email, classCode, currentSubmissionId) {
  if (sheet.getLastRow() < 2) return 1;
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues();
  const uniqueSubmissions = new Set();
  rows.forEach(row => {
    if (String(row[1]).trim().toLowerCase() === email &&
        String(row[2]).trim().toUpperCase() === classCode) {
      uniqueSubmissions.add(String(row[16]).trim());
    }
  });
  uniqueSubmissions.add(currentSubmissionId);
  return uniqueSubmissions.size;
}

function buildRow_(payload, attempts) {
  const score = payload.scores || {};
  return [
    payload.name || '', payload.email || '', payload.classCode || '',
    payload.startedAt ? new Date(payload.startedAt) : '',
    payload.completedAt ? new Date(payload.completedAt) : '',
    payload.status || '', Number(payload.totalScore || 0),
    Number(score.businessQuestion || 0), Number(score.dataMapping || 0),
    Number(score.pipeline || 0), Number(score.warehouse || 0),
    Number(score.dataModel || 0), Number(score.dashboard || 0),
    Number(score.opportunity || 0), payload.rank || '', attempts,
    payload.submissionId || ''
  ];
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
