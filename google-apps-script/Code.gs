var SPREADSHEET_ID = '';
var DRIVE_FOLDER_ID = '';
var SHEET_NAME = 'SCI 匿名評估資料';
var SPREADSHEET_NAME = 'ASUS SCI 匿名評估資料庫';
var DRIVE_FOLDER_NAME = 'ASUS SCI 匿名評估附件';

var MAX_IMAGE_BYTES = 10 * 1024 * 1024;
var MAX_REQUESTS_PER_HOUR = 300;
var CACHE_SECONDS = 21600;

var SHEET_HEADERS = [
  '收到時間', '匿名 ID', '評估 ID', '同意蒐集', '同意時間',
  '工作身分', '角色標籤', '任務數', '任務 ID', '任務名稱', '任務填答 JSON',
  '同時執行任務數', '成本輸入值', '成本週期', '換算時數', '每小時成本',
  '雲端 AI 使用狀態', '雲端方案', '其他雲端月支出', '雲端月支出合計',
  '目前 SCI', '導入後 SCI', 'SCI 提升',
  '目前每月工時', '導入後每月工時', '每月釋放工時', '每月節省費用', '等值 Token',
  '影分身戰力', '設備級距', '推薦整機', '任務結果 JSON', '影分身 JSON', '設備推薦 JSON',
  '報表圖片', '完整資料 JSON', '來源頁面', '資料格式版本', '報告產生時間',
  // 2026-10 新增欄位：一律加在最後面，既有資料列的欄位位置才不會跑掉。
  '工作領域', '成本或收入範圍', '共用人數', '建議情境', '運算需求等級', '負載等級'
];

var SCENARIO_NAMES = {
  personal: '個人 AI',
  development: 'AI 開發',
  homelab: '家用實驗室／AI 節點',
  workstation: '企業工作站',
  premium: '企業工作站進階版',
  scale: '企業級規模'
};
var COST_BAND_NAMES = {
  '10000-40000': '1–4 萬',
  '50000-90000': '5–9 萬',
  '100000-150000': '10–15 萬',
  '160000-190000': '16–19 萬',
  '200000+': '20 萬以上',
  other: '其他（自填）'
};
var DEMAND_LEVEL_NAMES = { 1: '輕量', 2: '中等', 3: '高', 4: '模型開發' };
var LOAD_LEVEL_NAMES = { 1: '低', 2: '中', 3: '高' };

function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents;
    if (!raw) return jsonResponse({ ok: false, reason: '沒有收到資料。' });

    var data;
    try {
      data = JSON.parse(raw);
    } catch (error) {
      return jsonResponse({ ok: false, reason: '資料格式不正確。' });
    }

    var validation = validatePayload(data);
    if (!validation.ok) return jsonResponse(validation);

    var cache = CacheService.getScriptCache();
    var hourKey = 'hour_' + Math.floor(Date.now() / 3600000);
    var hourCount = Number(cache.get(hourKey) || 0);
    if (hourCount >= MAX_REQUESTS_PER_HOUR) {
      return jsonResponse({ ok: false, reason: '目前資料量較大，請稍後再試。' });
    }

    var assessmentId = cleanText(data.assessmentId);
    var duplicateKey = 'assessment_' + hashText(assessmentId);
    if (cache.get(duplicateKey)) {
      return jsonResponse({ ok: true, duplicate: true });
    }

    var lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      var sheet = getSheet();
      if (hasAssessmentId(sheet, assessmentId)) {
        cache.put(duplicateKey, '1', CACHE_SECONDS);
        return jsonResponse({ ok: true, duplicate: true });
      }

      var folder = getDataFolder();
      var imageFile = saveReportImage(folder, data.reportImage, assessmentId);
      var archiveFile = savePayloadArchive(folder, data, assessmentId);
      sheet.appendRow(buildSheetRow(data, imageFile.getUrl(), archiveFile.getUrl()));

      cache.put(duplicateKey, '1', CACHE_SECONDS);
      cache.put(hourKey, String(hourCount + 1), 3900);

      return jsonResponse({
        ok: true,
        assessmentId: assessmentId,
        imageUrl: imageFile.getUrl(),
        archiveUrl: archiveFile.getUrl()
      });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    return jsonResponse({ ok: false, reason: '伺服器處理資料時發生錯誤。' });
  }
}

function doGet() {
  return ContentService
    .createTextOutput('OK - ASUS SCI anonymous collection endpoint')
    .setMimeType(ContentService.MimeType.TEXT);
}

function validatePayload(data) {
  if (data.consent !== true) return { ok: false, reason: '未取得匿名資料蒐集同意。' };
  if (!/^SCI-U-[A-Z0-9-]{20,}$/i.test(cleanText(data.anonymousId))) {
    return { ok: false, reason: '匿名識別碼格式不正確。' };
  }
  if (!/^SCI-[A-Z0-9-]{5,}$/i.test(cleanText(data.assessmentId))) {
    return { ok: false, reason: '評估識別碼格式不正確。' };
  }
  if (!data.assessment || !data.result || !data.reportImage) {
    return { ok: false, reason: '評估資料或報表圖片不完整。' };
  }
  if (cleanText(data.reportImage.mimeType) !== 'image/png') {
    return { ok: false, reason: '報表圖片格式必須是 PNG。' };
  }
  var base64 = cleanText(data.reportImage.dataBase64).replace(/^data:image\/png;base64,/, '');
  if (!base64) return { ok: false, reason: '報表圖片內容為空。' };
  if (Math.ceil(base64.length * 0.75) > MAX_IMAGE_BYTES) {
    return { ok: false, reason: '報表圖片超過 10 MB。' };
  }
  return { ok: true };
}

function buildSheetRow(data, imageUrl, archiveUrl) {
  var assessment = data.assessment || {};
  var result = data.result || {};
  var cost = result.cost || {};
  var sci = result.sci || {};
  var time = result.time || {};
  var tokens = result.tokens || {};
  var recommendation = result.recommendation || {};
  var taskResults = Array.isArray(result.taskResults) ? result.taskResults : [];
  var taskIds = Array.isArray(assessment.selectedRecipeIds) ? assessment.selectedRecipeIds : [];
  var taskTitles = taskResults.map(function (task) { return cleanText(task.title); });
  var models = Array.isArray(recommendation.models) ? recommendation.models : [];
  var modelNames = models.map(function (model) { return cleanText(model.name); });
  var cloudPlans = Array.isArray(assessment.cloudPlans) ? assessment.cloudPlans : [];

  return [
    new Date(),
    safeCell(data.anonymousId),
    safeCell(data.assessmentId),
    '是',
    safeCell(data.consentedAt),
    safeCell(assessment.persona),
    safeCell(assessment.roleTag),
    taskIds.length,
    safeCell(taskIds.join(', ')),
    safeCell(taskTitles.join('｜')),
    safeJsonCell(assessment.taskAnswers),
    safeCell(assessment.executionNeeds && assessment.executionNeeds.parallelBand),
    numberOrBlank(assessment.costAmountTwd),
    safeCell(assessment.costPeriod),
    numberOrBlank(assessment.periodHours),
    numberOrBlank(assessment.hourlyCostTwd),
    safeCell(assessment.cloudUsage),
    safeCell(cloudPlans.join(', ')),
    numberOrBlank(assessment.cloudOtherCostTwd),
    numberOrBlank(cost.cloudSavedMonthlyTwd),
    numberOrBlank(sci.current),
    numberOrBlank(sci.target),
    numberOrBlank(sci.gap),
    numberOrBlank(time.currentHoursMonthly),
    numberOrBlank(time.targetHoursMonthly),
    numberOrBlank(time.savedHoursMonthly),
    numberOrBlank(cost.savedMonthlyTwd),
    numberOrBlank(tokens.savedMonthly),
    safeCell(recommendation.grade),
    safeCell(recommendation.tier),
    safeCell(modelNames.join('｜')),
    safeJsonCell(taskResults),
    safeJsonCell(result.clones),
    safeJsonCell(recommendation),
    safeCell(imageUrl),
    safeCell(archiveUrl),
    safeCell(data.sourcePage),
    safeCell(data.schemaVersion),
    safeCell(result.generatedAt),
    safeCell(assessment.functionId),
    safeCell(COST_BAND_NAMES[assessment.costBand] || assessment.costBand),
    safeCell(recommendation.sharedUsers || (assessment.executionNeeds && assessment.executionNeeds.sharedUsers)),
    safeCell(SCENARIO_NAMES[recommendation.scenarioId] || recommendation.scenarioId),
    safeCell(DEMAND_LEVEL_NAMES[recommendation.demandLevel] || recommendation.demandLevel),
    safeCell(LOAD_LEVEL_NAMES[recommendation.loadLevel] || recommendation.loadLevel)
  ];
}

function saveReportImage(folder, reportImage, assessmentId) {
  var base64 = cleanText(reportImage.dataBase64).replace(/^data:image\/png;base64,/, '');
  var bytes = Utilities.base64Decode(base64);
  if (bytes.length > MAX_IMAGE_BYTES) throw new Error('Report image exceeds size limit.');
  var filename = safeFilename(reportImage.filename || ('ASUS-SCI-' + assessmentId + '.png'));
  return folder.createFile(Utilities.newBlob(bytes, 'image/png', filename));
}

function savePayloadArchive(folder, data, assessmentId) {
  var archive = JSON.parse(JSON.stringify(data));
  if (archive.reportImage) {
    delete archive.reportImage.dataBase64;
    archive.reportImage.storedInDrive = true;
  }
  var filename = safeFilename('ASUS-SCI-' + assessmentId + '.json');
  return folder.createFile(filename, JSON.stringify(archive, null, 2), MimeType.PLAIN_TEXT);
}

function getSheet() {
  var props = PropertiesService.getScriptProperties();
  var id = SPREADSHEET_ID || props.getProperty('SCI_SPREADSHEET_ID');
  var spreadsheet;
  if (id) {
    spreadsheet = SpreadsheetApp.openById(id);
  } else {
    spreadsheet = SpreadsheetApp.create(SPREADSHEET_NAME);
    props.setProperty('SCI_SPREADSHEET_ID', spreadsheet.getId());
  }
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  ensureHeaders(sheet);
  return sheet;
}

function ensureHeaders(sheet) {
  var currentColumns = Math.max(sheet.getLastColumn(), SHEET_HEADERS.length);
  if (sheet.getMaxColumns() < currentColumns) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), currentColumns - sheet.getMaxColumns());
  }
  sheet.getRange(1, 1, 1, SHEET_HEADERS.length).setValues([SHEET_HEADERS]);
  sheet.setFrozenRows(1);
}

function getDataFolder() {
  var props = PropertiesService.getScriptProperties();
  var id = DRIVE_FOLDER_ID || props.getProperty('SCI_DRIVE_FOLDER_ID');
  if (id) return DriveApp.getFolderById(id);
  var folder = DriveApp.createFolder(DRIVE_FOLDER_NAME);
  props.setProperty('SCI_DRIVE_FOLDER_ID', folder.getId());
  return folder;
}

function hasAssessmentId(sheet, assessmentId) {
  if (sheet.getLastRow() < 2) return false;
  var finder = sheet
    .getRange(2, 3, sheet.getLastRow() - 1, 1)
    .createTextFinder(assessmentId)
    .matchEntireCell(true);
  return Boolean(finder.findNext());
}

function setup() {
  var sheet = getSheet();
  var folder = getDataFolder();
  console.log('試算表：' + sheet.getParent().getUrl());
  console.log('附件資料夾：' + folder.getUrl());
  return { spreadsheetUrl: sheet.getParent().getUrl(), folderUrl: folder.getUrl() };
}

function showResources() {
  return setup();
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function cleanText(value) {
  return String(value == null ? '' : value).trim();
}

function safeCell(value) {
  var text = cleanText(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function safeJsonCell(value) {
  var text = JSON.stringify(value == null ? null : value);
  if (text.length > 45000) text = text.slice(0, 44980) + '…[完整內容請見 JSON 附件]';
  return text;
}

function numberOrBlank(value) {
  if (value === '' || value == null) return '';
  var number = Number(value);
  return isFinite(number) ? number : '';
}

function safeFilename(value) {
  return cleanText(value).replace(/[\\/:*?"<>|\x00-\x1F]/g, '-').slice(0, 180);
}

function hashText(text) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text);
  return bytes.map(function (value) {
    return ((value < 0 ? value + 256 : value) + 256).toString(16).slice(1);
  }).join('').slice(0, 24);
}
