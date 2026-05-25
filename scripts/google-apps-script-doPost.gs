/**
 * Nexperts Academy — Google Sheets webhook (Leads + Payments).
 * Deploy as Web App: Execute as Me, Who has access: Anyone.
 * Paste into Apps Script, add headers on row 1, then Deploy → New version.
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

    if (sheetName === "Payments") {
      appendPaymentRow_(sheet, p);
    } else {
      appendLeadRow_(sheet, p);
    }

    return jsonResponse({ ok: true, sheet: sheetName, programmePage: resolveProgrammePage_(p), course: resolveCourse_(p) });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err && err.message ? err.message : err) }, 500);
  }
}

/** Merge e.parameter, urlencoded body, JSON body, and jsonPayload field. */
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
  return resolveProgrammePage_(p) === "Vibe Coding" ? "vibe-coding-bootcamp" : "agentic-ai-founding";
}

function appendLeadRow_(sheet, p) {
  var programmePage = resolveProgrammePage_(p);
  var course = resolveCourse_(p);

  var row = [
    new Date(),
    p.name || "",
    stripLeadingApostrophe_(p.phone || ""),
    p.email || "",
    p.message || "",
    p.source || "",
    p.submittedAt || "",
    programmePage,
    course
  ];
  sheet.appendRow(row);

  var lastRow = sheet.getLastRow();
  var phoneCell = sheet.getRange(lastRow, 3);
  phoneCell.setNumberFormat("@");
  phoneCell.setValue(stripLeadingApostrophe_(p.phone || ""));
}

function appendPaymentRow_(sheet, p) {
  var amountTotal = toNumber_(p.amountTotal);
  var amountDisplay = amountTotal ? amountTotal / 100 : "";
  var programmePage = resolveProgrammePage_(p);
  var course = resolveCourse_(p);

  var row = [
    new Date(),
    p.status || "",
    p.sessionId || "",
    p.payerName || "",
    p.payerEmail || "",
    stripLeadingApostrophe_(p.payerPhone || ""),
    p.currency || "",
    amountTotal === "" ? "" : amountTotal,
    amountDisplay === "" ? "" : amountDisplay,
    p.note || "",
    p.source || "",
    p.submittedAt || "",
    programmePage,
    course
  ];
  sheet.appendRow(row);

  var lastRow = sheet.getLastRow();
  var phoneCell = sheet.getRange(lastRow, 6);
  phoneCell.setNumberFormat("@");
  phoneCell.setValue(stripLeadingApostrophe_(p.payerPhone || ""));

  if (amountTotal !== "") sheet.getRange(lastRow, 8).setNumberFormat("0");
  if (amountDisplay !== "") sheet.getRange(lastRow, 9).setNumberFormat("#,##0.00");
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
