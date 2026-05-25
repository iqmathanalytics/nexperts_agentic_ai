/**
 * Nexperts Academy — Google Sheets webhook (Leads + Payments).
 * Deploy: Execute as Me · Who has access: Anyone · New version after every edit.
 */

function doPost(e) {
  try {
    var SPREADSHEET_ID = "1hHD-UEP-O2unUh0_Osq9gGsve24dUyfKr2MxW5Vm3RY";
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var p = getRequestParams_(e);

    var sheetName = p.sheet ? String(p.sheet) : "Leads";
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      return jsonResponse({ ok: false, error: "Sheet not found: " + sheetName }, 400);
    }

    var programmePage = resolveProgrammePage_(p);
    var course = resolveCourse_(p);

    if (sheetName === "Payments") {
      appendPaymentRow_(sheet, p, programmePage, course);
    } else {
      appendLeadRow_(sheet, p, programmePage, course);
    }

    return jsonResponse({
      ok: true,
      sheet: sheetName,
      programmePage: programmePage,
      course: course,
      scriptTag: "header-map-v3",
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err && err.message ? err.message : err) }, 500);
  }
}

function getRequestParams_(e) {
  var p = {};
  if (e && e.parameter) {
    for (var key in e.parameter) {
      if (Object.prototype.hasOwnProperty.call(e.parameter, key)) {
        p[key] = e.parameter[key];
      }
    }
  }
  if (e && e.postData && e.postData.contents) {
    var contents = String(e.postData.contents);
    var type = String(e.postData.type || "").toLowerCase();
    if (type.indexOf("application/json") >= 0) {
      try {
        var json = JSON.parse(contents);
        for (var j in json) {
          if (Object.prototype.hasOwnProperty.call(json, j)) p[j] = json[j];
        }
      } catch (ignore) {}
    } else {
      var pairs = contents.split("&");
      for (var i = 0; i < pairs.length; i++) {
        var part = pairs[i];
        var eq = part.indexOf("=");
        if (eq < 0) continue;
        var name = decodeURIComponent(part.substring(0, eq).replace(/\+/g, " "));
        var val = decodeURIComponent(part.substring(eq + 1).replace(/\+/g, " "));
        if (name) p[name] = val;
      }
    }
  }
  if (p.jsonPayload) {
    try {
      var nested = JSON.parse(String(p.jsonPayload));
      for (var k in nested) {
        if (Object.prototype.hasOwnProperty.call(nested, k)) p[k] = nested[k];
      }
    } catch (ignore2) {}
  }
  return p;
}

function normalizeHeaderKey_(h) {
  return String(h || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_\-]+/g, "");
}

/** Write values into columns that match row-1 headers (any column order). */
function appendRowByHeaders_(sheet, valueMap, fallbackRow) {
  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var hasHeader = false;
  for (var h = 0; h < headers.length; h++) {
    if (String(headers[h] || "").trim()) {
      hasHeader = true;
      break;
    }
  }

  if (!hasHeader) {
    sheet.appendRow(fallbackRow);
    return sheet.getLastRow();
  }

  var row = [];
  for (var c = 0; c < headers.length; c++) {
    var key = normalizeHeaderKey_(headers[c]);
    row.push(key && valueMap.hasOwnProperty(key) ? valueMap[key] : "");
  }
  sheet.appendRow(row);
  return sheet.getLastRow();
}

function resolveProgrammePage_(p) {
  if (p.programmePage) return String(p.programmePage);
  if (p.programme_page) return String(p.programme_page);
  var ch = String(p.channel || "").toLowerCase();
  if (ch.indexOf("vibe") >= 0) return "Vibe Coding";
  var src = String(p.source || "").toLowerCase();
  if (src.indexOf("vibe") >= 0 || src.indexOf("vibe%20coding") >= 0) return "Vibe Coding";
  return "Agentic AI";
}

function resolveCourse_(p) {
  if (p.course) return String(p.course);
  if (p.course_key) return String(p.course_key);
  return resolveProgrammePage_(p) === "Vibe Coding" ? "vibe-coding-bootcamp" : "agentic-ai-founding";
}

function appendLeadRow_(sheet, p, programmePage, course) {
  var phone = stripLeadingApostrophe_(p.phone || "");
  var receivedAt = new Date();
  var valueMap = {
    timestamp: receivedAt,
    serverreceivedat: receivedAt,
    datereceived: receivedAt,
    name: p.name || "",
    phone: phone,
    email: p.email || "",
    message: p.message || "",
    source: p.source || "",
    submittedat: p.submittedAt || "",
    submitted: p.submittedAt || "",
    programmepage: programmePage,
    programme: programmePage,
    program: programmePage,
    course: course,
    coursekey: course,
  };
  var fallback = [
    receivedAt,
    p.name || "",
    phone,
    p.email || "",
    p.message || "",
    p.source || "",
    p.submittedAt || "",
    programmePage,
    course,
  ];
  var lastRow = appendRowByHeaders_(sheet, valueMap, fallback);
  applyTimestampColumn_(sheet, lastRow, receivedAt);
  var phoneCol = findColumnByHeader_(sheet, ["phone", "mobile", "phonenumber"]);
  if (phoneCol > 0) {
    var phoneCell = sheet.getRange(lastRow, phoneCol);
    phoneCell.setNumberFormat("@");
    phoneCell.setValue(phone);
  }
}

function appendPaymentRow_(sheet, p, programmePage, course) {
  var amountTotal = toNumber_(p.amountTotal);
  var amountDisplay = amountTotal ? amountTotal / 100 : "";
  var phone = stripLeadingApostrophe_(p.payerPhone || "");
  var receivedAt = new Date();

  var valueMap = {
    timestamp: receivedAt,
    serverreceivedat: receivedAt,
    datereceived: receivedAt,
    status: p.status || "",
    sessionid: p.sessionId || "",
    payername: p.payerName || "",
    payeremail: p.payerEmail || "",
    payerphone: phone,
    currency: p.currency || "",
    amounttotal: amountTotal === "" ? "" : amountTotal,
    amountdisplay: amountDisplay === "" ? "" : amountDisplay,
    note: p.note || "",
    source: p.source || "",
    submittedat: p.submittedAt || "",
    submitted: p.submittedAt || "",
    programmepage: programmePage,
    programme: programmePage,
    program: programmePage,
    course: course,
    coursekey: course,
  };
  var fallback = [
    receivedAt,
    p.status || "",
    p.sessionId || "",
    p.payerName || "",
    p.payerEmail || "",
    phone,
    p.currency || "",
    amountTotal === "" ? "" : amountTotal,
    amountDisplay === "" ? "" : amountDisplay,
    p.note || "",
    p.source || "",
    p.submittedAt || "",
    programmePage,
    course,
  ];
  var lastRow = appendRowByHeaders_(sheet, valueMap, fallback);
  applyTimestampColumn_(sheet, lastRow, receivedAt);

  var phoneCol = findColumnByHeader_(sheet, ["payerphone", "phone", "mobile"]);
  if (phoneCol > 0) {
    var phoneCell = sheet.getRange(lastRow, phoneCol);
    phoneCell.setNumberFormat("@");
    phoneCell.setValue(phone);
  }
  var rawAmountCol = findColumnByHeader_(sheet, ["amounttotal", "amountraw"]);
  if (rawAmountCol > 0 && amountTotal !== "") {
    sheet.getRange(lastRow, rawAmountCol).setNumberFormat("0");
  }
  var displayAmountCol = findColumnByHeader_(sheet, ["amountdisplay", "amount"]);
  if (displayAmountCol > 0 && amountDisplay !== "") {
    sheet.getRange(lastRow, displayAmountCol).setNumberFormat("#,##0.00");
  }
}

function applyTimestampColumn_(sheet, lastRow, when) {
  var col = findColumnByHeader_(sheet, [
    "timestamp",
    "serverreceivedat",
    "datereceived",
    "createdat",
    "created",
    "datetime",
  ]);
  if (col > 0) {
    var cell = sheet.getRange(lastRow, col);
    cell.setValue(when || new Date());
    cell.setNumberFormat("yyyy-mm-dd hh:mm:ss");
  }
}

function findColumnByHeader_(sheet, aliases) {
  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  for (var i = 0; i < headers.length; i++) {
    var key = normalizeHeaderKey_(headers[i]);
    for (var a = 0; a < aliases.length; a++) {
      if (key === normalizeHeaderKey_(aliases[a])) return i + 1;
    }
  }
  return 0;
}

function stripLeadingApostrophe_(v) {
  return String(v || "").replace(/^'/, "");
}

function toNumber_(v) {
  var s = String(v || "").trim();
  if (!s) return "";
  var n = Number(s);
  return isNaN(n) ? "" : n;
}

function jsonResponse(obj, statusCode) {
  obj.statusCode = statusCode || 200;
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
